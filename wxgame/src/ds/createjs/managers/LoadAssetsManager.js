import {getDefault} from '../../utils/Mixin';

//wx文件管理系统
const fs = wx.getFileSystemManager();

const global = GameGlobal;
const root = global;

/**
 * 资源加载管理器
 */
class LoadAssetsManager {

    constructor() {

        /**
         * 设置网络加载地址
         * @type {string}
         * @example
         * ds.createjs.LoadAssetsManager.serverPath='https://weapp.cagoe.com/yearcongame/';
         */
        this.serverPath = '';

    }

    /**
     * 处理网络缓存资源加载
     * @param comp 资源对象
     * @param {ds.files.FilesCacheManager} fsCacher 【必填】资源缓存管理对象
     * @param {object} opts 配置参数
     * @param {string} opts.name 全局绑定这个库名
     * @param {function} opts.success 加载完成 success(list[加载完成对象列表],errorFiles[加载不成对象列表]);
     * @param {function} opts.progress 加载进度 progress(_ps[进度值0-1])
     * @param {function} opts.fail 单文件加载失败  fail(error[错误提示], res[错误对象], url[错误链接],_obj[错误加载对象])
     * @param {boolean} opts.mustComplete=false  必须完整
     * @param {boolean} opts.debug=false 是否打印debug信息
     * @return {boolean}
     */
    loadAssetsByNet(comp, fsCacher, opts) {


        if (typeof (opts) === 'string') opts = {name: opts};

        opts = opts || {};

        if (opts.name !== undefined) root[opts.name] = comp.lib;


        //加载完成
        let success = getDefault(opts.success, null);
        //加载进度
        let progress = getDefault(opts.progress, null);
        //加载错误
        let fail = getDefault(opts.fail, null);
        //必须加载完整资源
        let mustComplete = getDefault(opts.mustComplete, false);
        //是否打印debug
        let debug = getDefault(opts.debug, false);

        //服务器端路径
        let _serverPath = getDefault(opts.serverPath, this.serverPath);
        //相对路径
        let _basePath = getDefault(opts.basePath, 'assets/');
        //缓存版本
        let _version = getDefault(opts.version, 'v=0');

        if (_version.indexOf('?') !== 0) _version = '?' + _version;


        let _manifest = comp.lib.properties.manifest;

        let i, _obj, _img, _name, _frames;

        //所有的资源
        let _list = [];
        //需要下载列表
        let _downList = [];
        //已有缓存列表
        let _cacheList = [];
        for (i = 0; i < _manifest.length; i++) {
            _obj = _manifest[i];
            let _src = _obj.src.slice(0, _obj.src.indexOf('?'));
            let _url = _serverPath + _basePath + _src;
            let _data = {
                id: _obj.id,
                url: _url,
                readyPath: _src + _version
            };
            _list.push(_data);


            let _readyPath = fsCacher._getLegalPath(_data.readyPath);
            let _fileInfo = fsCacher.getFileInfo(_readyPath);
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
                    if (debug) console.log('loadAssetsByNet', e);
                    _downList.push(_data);
                    continue;
                }
                _data.file = _fileInfo;
                //记录已有缓存列表
                _cacheList.push(_data);
            }

        }

        if (_cacheList.length >= _list.length) {

            if (debug) console.log('已经有所有缓存，直接进行本地读取处理');
            try {
                this.dealLocalAssetsImagesDc(comp, _list, debug);
            }
            catch (e) {
                if (debug) console.log('dealLocalAssetsImagesDc', e);
            }

            if (success) success(_list, []);

            return true;

        }
        else {

            if (debug) console.log('需要网络加载进行缓存资源， 总数：' + _list.length + ' 需下载数：' + _downList.length + ' 已经缓存数：' + _cacheList.length);


            //需要进行远程加载处理
            this.filesCacheManagerDown(_downList, fsCacher, comp, (list, erroeList) => {

                if (success) success(_list, erroeList);


            }, progress, (error, res, url, obj) => {

                if (fail) fail(obj, error, res, url);

            }, debug, mustComplete);

            return false;

        }

        return comp.lib;

    }

    /**
     * 处理资源列表与动画代码绑定操作
     * @param {object} comp AN导出资源代码对象
     * @param {array} list 加载资源列表
     * @param {boolean} debug 是debug打印测试
     *
     */
    dealLocalAssetsImagesDc(comp, list, debug = false) {

        if (debug) console.log('dealLocalAssetsImagesDc start:', list.length);

        let i, _img, _name, _frames;
        //处理加载资源的绑定
        for (i = 0; i < list.length; i++) {


            // if (debug) console.log('deal local assets images start', i);
            let _obj = list[i];
            let _fsObj = _obj.file;

            if (!_fsObj || !_fsObj.path) {
                console.log('动画图片资源加载失败 readyPath', _obj.readyPath);
                continue;
            }

            let _path = _fsObj.path;

            if (_path.indexOf('.png') !== -1 || _path.indexOf('.jpg') !== -1|| _path.indexOf('.jpeg') !== -1) {
                _img = new Image();
                _img.src = _path;
                comp.img[_obj.id] = _img;
            }else{
                console.log(_path);
            }
        }

        //处理精力图片
        let _ss = comp.ss;
        let _ssMetadata = comp.lib.ssMetadata;

        for (i = 0; i < _ssMetadata.length; i++) {

            _name = _ssMetadata[i].name;
            _frames = _ssMetadata[i].frames;
            _img = comp.img[_name];
            _ss[_name] = new createjs.SpriteSheet({'images': [_img], 'frames': _frames});

        }
    }

    /**
     * 开始处理网络加载后进缓存并绑定
     * @param manifest
     * @param fsCacher
     * @param comp
     * @param success
     * @param progress
     * @param fail
     * @param debug
     * @param mustComplete
     */
    filesCacheManagerDown(manifest, fsCacher, comp, success, progress, fail, debug, mustComplete = false) {

        let i, _img, _name, _frames;
        //开始进行网络或缓存加载
        fsCacher.loadManifest(manifest,
            {
                success: (list, errorList) => {

                    if (debug) console.log('loadAssetsByNet 资源加载完成');

                    if (errorList.length > 0) {
                        if (fail) fail(errorList);
                    }
                    else {
                        this.dealLocalAssetsImagesDc(comp, list);
                        if (success) success(list, errorList);
                    }

                },
                progress: (ps) => {
                    if (debug) console.log('进度：', ps);
                    if (progress) progress(ps);
                },
                fail: (error, res, url, _obj) => {
                    if (mustComplete ) {
                        if (debug) console.log('Error 动画文件加载失败：', _obj);
                        if(fail)fail(error, res, url, _obj);
                    }
                },
                mustComplete: mustComplete
            }
        );
    }

    /**
     * 处理本地加载资源
     * @param comp  资源对象
     * @param opts  配置参数
     * @param opts.basePath='assets/' 本地资源路径
     * @param opts.name=undefined    资源命名空间
     * @example
     * import main from 'resource/main';
     * ds.createjs.LocalAssetsManager.localAssets(main,'main');
     */
    loadAssets(comp, opts) {
        opts = opts || {};

        if (typeof (opts) === 'string') opts = {name: opts};

        if (opts.name !== undefined) root[opts.name] = comp.lib;

        let _basePath = getDefault(opts.basePath, 'assets/');
        let _manifest = comp.lib.properties.manifest;

        let i, _obj, _img, _src, _name, _frames;

        for (i = 0; i < _manifest.length; i++) {
            _obj = _manifest[i];
            _src = _obj.src;
            _src = _src.slice(0, _src.indexOf('?'));
            if (_src.indexOf('.png') !== -1 || _src.indexOf('.jpg') !== -1|| _src.indexOf('.jpeg') !== -1) {
                _img = new Image();
                _img.src = _basePath + _src;
                comp.img[_obj.id] = _img;
            }
        }

        let _ss = comp.ss;
        let _ssMetadata = comp.lib.ssMetadata;

        for (i = 0; i < _ssMetadata.length; i++) {

            _name = _ssMetadata[i].name;
            _frames = _ssMetadata[i].frames;
            _img = comp.img[_name];
            _ss[_name] = new createjs.SpriteSheet({'images': [_img], 'frames': _frames});

        }

        return comp.lib;
    }
}

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.LoadAssetsManager = new LoadAssetsManager();

export default ds.createjs.LoadAssetsManager;


