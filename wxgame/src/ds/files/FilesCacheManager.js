//wx文件管理系统
const fs = wx.getFileSystemManager();
//用户缓存目录
const usr = wx.env.USER_DATA_PATH;
//缓存对象字典
const FilesCacheManagerDc = {};

/**
 * 网络文件资源本地缓存管理器
 * 1、解决小游戏素材初始化从服务器端抓取
 */
class FilesCacheManager {

    /**
     * 构造函数
     * @param cacheName 缓存管理对象名称
     * @param version 缓存列表版本
     * @param debug 是否输出debug
     * @return {*}
     */
    constructor(cacheName = 'filesCache', version = '1', debug = false) {

        if (FilesCacheManagerDc[cacheName]) return FilesCacheManagerDc[cacheName];
        FilesCacheManagerDc[cacheName] = this;

        this._cacheName = cacheName;

        let _cachePath = this._cachePath = usr + '/' + this._cacheName;

        this._filesListDc = null;

        let _filesListDcJSONPath = this._filesListDcJSONPath = this._cachePath + '/cache.json';

        this.debug = debug;

        try {

            fs.accessSync(_cachePath);

        }
        catch (e) {

            if (this.debug) console.log('新建一个缓存管理目录', _cachePath);
            fs.mkdirSync(_cachePath);

        }

        //获取索引字典
        try {

            if (this.debug) console.log('开始获取本地文件索引字典');

            fs.accessSync(_filesListDcJSONPath);

            try {

                let _data = fs.readFileSync(_filesListDcJSONPath, 'utf8');
                this._filesListDc = JSON.parse(_data);
                if (this.debug) console.log('filesListDc:', this._filesListDc);
                this._version = this._filesListDc.version;
                if (this._version !== version) {
                    console.log('版本有差异重新构建缓存文件列表', this._version, version);
                    this._createFilesListDcJSON(version, '新建缓存字典 code:版本不统一');
                }

            }
            catch (e) {

                this._createFilesListDcJSON(version, '新建缓存字典 code:读取原配置失败');
            }


        }
        catch (e) {

            this._createFilesListDcJSON(version, '新建缓存字典 code:无配置');
        }

    }

    /**
     * 清空原来配置与文件 重新创建文件列表
     * @param version
     * @param info
     * @private
     */
    _createFilesListDcJSON(version, info) {
        if (this.debug && info) console.log(info);
        this._version = version;
        this.clearAll();
    }

    /**
     * 清空原来加载文件
     */
    clearAll() {
        try {
            //清空缓存目录
            let _cachePath = this._cachePath;
            let _paths = fs.readdirSync(_cachePath);
            for (let i = 0; i < _paths.length; i++) {
                let path = _cachePath + '/' + _paths[i];
                // console.log(path);
                fs.unlinkSync(path);
            }
            let _filesListDcJSONPath = this._filesListDcJSONPath = _cachePath + '/cache.json';
            this._filesListDc = {version: this._version};
            let _data = JSON.stringify(this._filesListDc);
            fs.writeFileSync(_filesListDcJSONPath, _data, 'utf8');

        }
        catch (e) {
            if (this.debug) console.log('clearAll error:', e);
        }
    }

    /**
     * 读取文件
     * @param readyPath 虚拟路径
     * @return {*} 读取出来数据
     */
    readFile(readyPath) {

        readyPath = this._getLegalPath(readyPath);
        let _fileInfo = this.getFileInfo(readyPath);
        if (!_fileInfo) return null;
        let _path = _fileInfo.path;
        let _type = _fileInfo.type;
        let _md5 = _fileInfo.md5;
        let _data;
        if (_type === 'image') {

            _data = this._readFile(_path, 'base64');
            if (_md5.indexOf('.jpg') || _md5.indexOf('.jpeg')) {
                _data = 'data:image/jpeg;base64,' + _data;
            }
            else if (_md5.indexOf('.png')) {
                _data = 'data:image/png;base64,' + _data;
            }
            else if (_md5.indexOf('.gif')) {
                _data = 'data:image/gif;base64,' + _data;
            }
            else if (_md5.indexOf('.svg')) {
                _data = 'data:image/svg+xml;base64,' + _data;
            }

        } else {

            _data = this._readFile(_path);

        }
        return _data;
    }


    /**
     * 根据虚拟路径获取 文件信息
     * @param readyPath
     * @return {object}  文件信息数据
     {
        //文件的md5文件名
        md5: "wxc4cadd473f4d2624.o6zAJs3ouzQWrIFsQswiqKLkIKOs.ZuwlvdFs6dKxefdb8518c21c476b2adb8d5c17cdddc9.png",
        //文件虚拟路径
        readyPath: "http://usr/gameFiles/images/gameUI/Bitmap1.png?v=0",
        //文件实际路径
        path: "http://usr/gameFiles/wxc4cadd473f4d2624.o6zAJs3ouz….ZuwlvdFs6dKxefdb8518c21c476b2adb8d5c17cdddc9.png",
        //文件类型
        type: "image"
      }
     */
    readFileInfo(readyPath) {
        readyPath = this._getLegalPath(readyPath);
        let _fileInfo = this.getFileInfo(readyPath);
        return _fileInfo;
    }

    /**
     * 读取文件
     * @param path 真实路径
     * @param encoding 读取编码方式
     * @return {*}
     * @private
     */
    _readFile(path, encoding = 'utf8') {
        try {
            let _res = fs.readFileSync(path, encoding);
            return _res;
        }
        catch (e) {
            return null;
        }

    }

    /**
     * 下载清单文件并进行缓存
     * 会进行分析返回是否全部直接本地加载
     * @param {array} manifest
     * @param {object} opts   配置
     * @param {number} opts.maxLink=5   最大并发数
     * @param {function} opts.success   加载完成 success(list[加载完成对象列表],errorFiles[加载不成对象列表]);
     * @param {function} opts.progress   加载进度 progress(_ps[进度值0-1])
     * @param {function} opts.fail   单文件加载失败  fail(error[错误提示], res[错误对象], url[错误链接],_obj[错误加载对象])
     * @return {boolean} 是否全部直接本地加载
     */
    loadAssets(manifest, opts) {

        opts = opts || {};
        //加载完成
        let success = getDefault(opts.success, null);
        //加载进度
        let progress = getDefault(opts.progress, null);
        //加载错误
        let fail = getDefault(opts.fail, null);
        //最大多个下载链接同时加载
        let maxLink = getDefault(opts.maxLink, 5);

        //需要下载列表
        let _downList = [];
        //已有缓存列表
        let _cacheList = [];
        let i, _data;
        for (i = 0; i < manifest.length; i++) {
            _data = manifest[i];
            let _readyPath = this._getLegalPath(_data.readyPath);
            let _fileInfo = this.getFileInfo(_readyPath);
            //无历史缓存，需要重新下载
            if (!_fileInfo) {
                _downList.push(_data);
            }
            //历史缓存虚拟路径不匹配需要更新下载
            else if (_fileInfo.readyPath !== _readyPath) {
                _downList.push(_data);
            }
            //判断文件被清空需要重新下载
            else {

                let _path = _fileInfo.path;
                try {
                    fs.accessSync(_path);
                }
                catch (e) {
                    if (this.debug) console.log('loadAssets', e);
                    _downList.push(_data);
                    continue;
                }
                _data.file = _fileInfo;
                //记录已有缓存列表
                _cacheList.push(_data);
            }
        }

        if (_cacheList.length >= manifest.length) {

            if (this.debug) console.log('已经有所有缓存，直接进行本地读取处理');
            if (success) success(manifest, []);

            return true;
        }
        else {

            if (this.debug) console.log('loadAssets: 总数：' + manifest.length + ' 需下载数：' + _downList.length + ' 已经缓存数：' + _cacheList.length);

            opts.success = (list, errorFiles) => {
                if (success) success(manifest, errorFiles);
            };

            this.loadManifest(_downList, opts);

            return false;
        }

    }

    /**
     * 下载清单文件并进行缓存
     * 不做直接本地缓存直接提取判断,需要做判断推荐使用loadAssets
     * @param {array} manifest
     * @param {object} opts   配置
     * @param {number} opts.maxLink=5   最大并发数
     * @param {function} opts.success   加载完成 success(list[加载完成对象列表],errorFiles[加载不成对象列表]);
     * @param {function} opts.progress   加载进度 progress(_ps[进度值0-1])
     * @param {function} opts.fail   单文件加载失败  fail(error[错误提示], res[错误对象], url[错误链接],_obj[错误加载对象])
     * @param {boolean} opts.mustComplete=false  必须完整
     */
    loadManifest(manifest, opts) {

        let _self = this;

        opts = opts || {};

        //加载完成
        let success = getDefault(opts.success, null);
        //加载进度
        let progress = getDefault(opts.progress, null);
        //加载错误
        let fail = getDefault(opts.fail, null);

        let mustComplete = getDefault(opts.mustComplete, false);

        //最大多个下载链接同时加载
        let maxLink = getDefault(opts.maxLink, 5);

        //加载总数
        let _all = manifest.length;
        //当前加载完成数
        let _loadEndNum = 0;
        //单批次加载开始索引
        let _starIndex = 0;
        //单批次加载结束索引
        let _endIndex = 0;


        for (let i = 0; i < manifest.length; i++) {
            let _obj = manifest[i];
            _obj.ps = 0;
        }

        let _errorFiles = [];

        let _interrupt = false;
        //开始加载
        batchDown();

        //批次加载
        function batchDown() {
            if (mustComplete && _interrupt) return;
            let _arr = [];
            _endIndex = _starIndex + maxLink;
            if (_endIndex >= _all) _endIndex = _all;

            for (let i = _starIndex; i < _endIndex; i++) {
                let _obj = manifest[i];
                _obj.ps = 0;
                _self.down(_obj.url,
                    _obj.readyPath,
                    //单个文件加载完成
                    (fileObj) => {
                        _obj.ps = 1;
                        _loadEndNum += 1;
                        _obj.file = fileObj;
                        if (mustComplete && _interrupt) return;
                        loadEnd();
                    },
                    //单文件加载进度
                    (ps) => {
                        if (mustComplete && _interrupt) return;
                        _obj.ps = ps;
                        progressEvent();
                    },
                    //单个文件加载失败
                    (error, res, url) => {
                        if (mustComplete && _interrupt) return;
                        _obj.ps = 1;
                        _loadEndNum += 1;
                        _obj.file = null;
                        _errorFiles.push(_obj);
                        //如果必须完整，在发现文件下载错误后会中断加载
                        if (mustComplete && !_interrupt) {
                            _interrupt = true;
                        }
                        if (fail) fail(_obj, error, res, url);
                        loadEnd();
                    },
                );
            }

        }


        //单个文件加载
        function loadEnd() {
            if (_self.debug) console.log('loadEnd');
            //全部加载完成
            if (_loadEndNum >= _all) {
                if (_self.debug) console.log('全部加载完成');
                if (progress) progress(1);
                if (success) success(manifest, _errorFiles);
                return;
            }

            //单次并发加载完成
            if (_loadEndNum >= _endIndex) {
                if (_self.debug) console.log('加载下一批次', _endIndex + '/' + _all);
                //设置并发加载的索引头
                _starIndex = _endIndex;
                //进入下次并发
                batchDown();

            }
            else {
                progressEvent();
            }


        }

        let _psTime = new Date().getTime() - 100;

        //单个文件加载进度
        function progressEvent() {
            let _time = new Date().getTime();
            if (_time - _psTime <= 100) return;
            _psTime = _time;

            let _num = 0;
            for (let i = 0; i < manifest.length; i++) {
                let _obj = manifest[i];
                _num = _num + _obj.ps;
            }
            let _ps = _num / _all;
            if (progress) progress(_ps);
        }
    }

    /**
     * 下载文件
     * @param url  网络真实下载地址
     * @param readyPath 本地虚拟地址
     * @param success  下载缓存完成
     * @param progress  下载进度
     * @param fail  下载或缓存失败 function(error,res)
     * @example
     *
     let _filer = new FilesCacheManager();
     _filer.down(
     'http://swatch.image.alimmdn.com/intro/v00.jpg',
     'd/c/0.jpg?a123455',
     function (data) {
                    // console.log(path);
                    // let _base64=_filer._readFile(path,'base64');
                    // console.log(_base64);
                    let _base64 = _filer.readFile(data.readyPath);
                    // console.log(_base64);

                    let _img = new Image();
                    let _bmp = new createjs.Bitmap(_img);
                    _self.root.addChildAt(_bmp, 0);
                    _img.src = _base64;
                }
     );

     */
    down(url, readyPath, success, progress, fail) {

        let _self = this;
        readyPath = this._getLegalPath(readyPath);
        let _fileInfo = this.getFileInfo(readyPath);

        if (!_fileInfo) {

            if (this.debug) console.log('无历史缓存，需要重新下载');
            startDown();

        }
        else if (_fileInfo.readyPath !== readyPath) {

            if (this.debug) console.log('历史缓存虚拟路径不匹配需要更新下载');
            this.remove(
                readyPath,
                function () {
                    console.log('历史缓存删除,开始重新下载');
                    startDown();
                });

        } else {

            let _path = _fileInfo.path;
            if (this.debug) console.log('开始获取历史缓存文件', _path);

            try {
                fs.accessSync(_path);
                if (this.debug) console.log('历史文件存真实存在');
                if (success) success(_fileInfo);
            }
            catch (e) {
                if (this.debug) console.log('历史缓存文件已被删除，需要重新下载');
                let _fileNativePath = readyPath.split("?")[0];
                delete this._filesListDc[_fileNativePath];
                startDown();
            }

        }

        function startDown() {


            let _task = {
                url: url,
                success: function (res) {
                    if (_self.debug) console.log('wx.downloadFile success', res);
                    if (res.statusCode === 200) {
                        _self._copyTempFileToCachePath(
                            res.tempFilePath,
                            readyPath,
                            function (filePath) {
                                if (_self.debug) console.log('下载完成并缓存成功:', filePath);
                                let _fileInfo = _self.getFileInfo(readyPath);
                                if (success) success(_fileInfo);
                            },
                            function (error, res) {
                                if (fail) fail('下载并移动保存文件->' + error, res, url);
                            }
                        );

                    }
                    else {
                        if (fail) fail('文件下载失败', res, url);
                        if (_self.debug) console.log('网络加载失败', res.statusCode, url);
                    }
                },
                fail: function (res) {
                    if (_self.debug) console.log(url, 'down Error:', res);
                    if (fail) fail('下载文件资源失败', res, url);
                },
                complete: function () {
                    if (_self.debug) console.log('wx.downloadFile执行完成');
                }
            };

            let downloadTask = wx.downloadFile(_task);
            if (_self.debug) console.log('startDown:', url);

            downloadTask.onProgressUpdate(function (res) {

                if (progress) progress(res.progress / 100);

            });

        }

    }

    /**
     * 进行对临时下载文件进行缓存copy
     * @param tempFilePath  临时路径
     * @param readyPath  虚拟路径
     * @param success  copy 完成
     * @param fail 失败
     * @private
     */
    _copyTempFileToCachePath(tempFilePath, readyPath, success, fail) {

        let _self = this;
        let _temp = tempFilePath.split("/");
        //临时文件名，带md5
        let _md5FileName = _temp[_temp.length - 1];
        let _fileInfo = this.getFileInfo(readyPath);
        if (!_fileInfo) {

            if (_self.debug) console.log('无历史缓存文件，可以进行缓存');

            let _destFile = this._cachePath + '/' + _md5FileName;

            fs.copyFile({
                srcPath: tempFilePath,
                destPath: _destFile,
                success: function (res) {

                    if (_self.debug) console.log('缓存临时文件缓存【完成】');
                    let _info = _self._setFileInfo(readyPath, _md5FileName);
                    if (success) success(_info.path);


                },
                fail: function (res) {
                    if (fail) fail('缓存临时文件【错误】', res);
                }
            });

        }

    }

    /**
     * 删除文件
     * @param readyPath  虚拟路径
     * @param success  删除成功
     */
    remove(readyPath, success) {

        let _fileInfo = this.getFileInfo(readyPath);
        let _deleteFilePath = _fileInfo.path;
        let _fileNativePath = readyPath.split("?")[0];

        if (!_fileInfo) {
            if (this.debug) console.log('删除时候未找到这个缓存记录');
            if (success) success('');
            return;
        }
        try {

            fs.accessSync(_deleteFilePath);
            fs.unlinkSync(_deleteFilePath);
            delete this._filesListDc[_fileNativePath];
            if (success) success(_deleteFilePath);

            // fs.unlinkSync({
            //     filePath: _deleteFilePath,
            //     success: function (res) {
            //         console.log('删除成功');
            //         let _fileNativePath = readyPath.split("?")[0];
            //         delete this._filesListDc[_fileNativePath];
            //         if (success) success(_deleteFilePath);
            //     },
            //     fail: function (res) {
            //         console.log('删除失败');
            //         if (fail) fail('删除本地过期文件错误', res);
            //         if (success) success(_deleteFilePath);
            //     }
            // });

        }
        catch (e) {
            delete this._filesListDc[_fileNativePath];
            if (this.debug) console.log('删除', e);
            if (success) success(_deleteFilePath);
        }
    }

    /**
     * 设置缓存文件信息
     * @param readyPath 虚拟路径
     * @param md5Name md5的文件名
     * @return {object}
     * @private
     */
    _setFileInfo(readyPath, md5Name) {
        let _self = this;
        readyPath = this._getLegalPath(readyPath);
        if (!readyPath) return null;

        let _fileNativePath = readyPath.split("?")[0];

        let _type = '';
        if (md5Name.indexOf('.jpg')
            || md5Name.indexOf('.jpeg')
            || md5Name.indexOf('.png')
            || md5Name.indexOf('.gif')
            || md5Name.indexOf('.svg')
        ) {
            _type = 'image';
        }
        else if (md5Name.indexOf('.mp3')
            || md5Name.indexOf('.aac')
            || md5Name.indexOf('.wav')
        ) {
            _type = 'audio';
        }
        else if (md5Name.indexOf('.mp4')) {
            _type = 'video';
        }
        else if (md5Name.indexOf('.json')) {
            _type = 'json';
        }
        else {
            _type = 'other';
        }

        let _parh = this.cachePath + '/' + md5Name;

        this.filesListDc[_fileNativePath] = {
            md5: md5Name,
            readyPath: readyPath,
            path: _parh,
            type: _type,
        };

        let _data = JSON.stringify(this.filesListDc);
        fs.writeFile({
            filePath: this.filesListDcJSONPath,
            encoding: 'utf8',
            data: _data,
            success: function (res) {
            },
            fail: function (res) {
                if (_self.debug) console.log('写入本地缓存列表错误', res);
            }
        });
        return this.filesListDc[_fileNativePath];
    }

    /**
     * 获取缓存文件信息
     * @param readyPath  虚拟路径
     * @return {object|null} 文件信息数据
     */
    getFileInfo(readyPath) {
        readyPath = this._getLegalPath(readyPath);
        if (!readyPath) return null;
        let _fileNativePath = readyPath.split("?")[0];
        let _fileObj = this._filesListDc[_fileNativePath];
        return _fileObj;
    }

    /**
     * 获取合理文件路径
     * @param path
     */
    _getLegalPath(path) {
        if (!path) return null;
        if (path.indexOf(this._cachePath) !== 0) {
            if (path.indexOf('/') !== 0) path = '/' + path;
            path = this._cachePath + path;
        }
        return path;
    }

    /**
     * 缓存管理字典存储位置
     * @return {string|*}
     */
    get filesListDcJSONPath() {
        return this._filesListDcJSONPath;
    }

    /**
     * 本地缓存文件地址
     * @return {*}
     */
    get cachePath() {
        return this._cachePath;
    }

    /**
     * 缓存模块名
     * @return {*}
     */
    get cacheName() {
        return this._cacheName;
    }

    /**
     * 缓存索引字典
     * @return {object}
     */
    get filesListDc() {
        return this._filesListDc;
    }

    /**
     * 缓存文件大版本
     * @return {}
     */
    get version() {
        return this._version;
    }

}

/**
 * 返回默认值方法
 * @memberof module:ds/utils/mixin
 * @param  {*} obj  一个对象
 * @param  {*} defaultValue 转换后默认值
 * @return {*}
 */
function getDefault(obj, defaultValue) {
    if (obj === undefined || obj === null) return defaultValue;
    if (obj === 'true') return true;
    else if (obj === 'false') return false;
    return obj;
}

const global = GameGlobal;

let ds = global.ds = global.ds ? global.ds : {};
ds.files = ds.files ? ds.files : {};

ds.files.FilesCacheManager = FilesCacheManager;

export default FilesCacheManager;