import {getDefault} from 'ds/utils/Mixin';

const global = GameGlobal;
const root = global;
root.ds = root.ds ? root.ds : {};
let files = root.ds.files = root.ds.files ? root.ds.files : {};

//wx文件管理系统
const fs = wx.getFileSystemManager();
//用户缓存目录
const usr = wx.env.USER_DATA_PATH;


/**
 * 下载图片 并读取
 * @param url
 * @param success
 * @param fail
 * @param progress
 */
files.downImg = function (url, success, fail, progress) {
    files.down(url,
        function (data) {
            if (success) success(data);
        },
        function (error, res) {
            if (fail) fail(error, res);
        },
        function (value) {
            if (progress) progress(value);
        },
        'base64');
};
/**
 * 下载读取文件
 * @param url
 * @param success
 * @param fail
 * @param progress
 * @param encoding
 */
files.down = function (url, success, fail, progress, encoding = 'utf8') {
    let _downloadTask = wx.downloadFile({
        url: url,
        success: function (res) {
            if (res.statusCode === 200) {
                //开始读取文件
                files.readFile(res.tempFilePath,
                    function (res) {
                        if (success) success(res.data)
                    },
                    function (error, res) {
                        if (fail) fail(error, res);
                    },
                    encoding
                );
            }
        },
        fail: function (res) {
            console.log(url, 'ds.fileSystem.downImg Error:', res);
            if (fail) fail('下载图片资源失败', res);
        }
    });
    //下载进度
    _downloadTask.onProgressUpdate(function (res) {
        if (progress) progress(res.progress / 100);
    });
};

/**
 * 读取文件
 * @param path 本地路径
 * @param success 成功
 * @param fail  失败
 * @param encoding= 'utf8'  图片可以是 base64 其他：ascii、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
 */
files.readFile = function (path, success, fail, encoding = 'utf8') {
    fs.readFile({
        filePath: path,
        encoding: encoding,
        success: function (res) {
            console.log('readFile data:', res);
            if (success) success(res);
        },
        fail: function (res) {
            console.log('readFile error:', res);
            if (fail) fail('读取文件失败', res);
        }
    });
};

/**
 * 写入文件
 * @param path
 * @param fileData
 * @param success
 * @param fail
 * @param encoding='utf8'
 */
files.writeFile = function (path, fileData, success, fail, encoding = 'utf8') {

    path = getLegalPath(path);
    let _tempPath = path.split(usr + '/');
    // console.log(_tempPath);
    let _temp = _tempPath[1].split("/");
    if (_temp.length > 1) {
        let _wdir = usr;
        for (let i = 0; i < _temp.length - 1; i++) {
            let _dir = _temp[i];
            _wdir = _wdir + '/' + _dir;
            try {
                fs.accessSync(_wdir);
            }
            catch (e) {
                fs.mkdirSync(_wdir);
            }
        }
    }

    fs.writeFile({
        filePath: path,
        data: fileData,
        encoding: encoding,
        success: function (res) {
            console.log('写入文件成功');
            if (success) success(res);
        },
        fail: function (res) {
            console.log('写入文件失败', res);
            if (fail) fail('写入文件失败', res);
        }
    });

};

/**
 * 判断是否文件是否存在
 * @param path
 * @param success
 * @param fail
 */
files.exits = function (path, success, fail) {
    path = getLegalPath(path);
    fs.access({
        path: path,
        success: function (res) {
            console.log('exits success:', res);
            if (success) success(res)
        },
        fail: function (res) {
            console.log('exits fail:', res);
            if (fail) fail('判断文件是否存在', res);
        }
    });
};

/**
 * 创建目录
 * @param path
 * @param success
 * @param fail
 */
files.mkdir = function (path, success, fail) {
    path = getLegalPath(path);
    console.log('FileSystem.mkdir:', path);
    fs.mkdir({
        dirPath: path,
        success: function (res) {
            console.log('mkdir success:', res);
            if (success) success(res)
        },
        fail: function (res) {
            console.log('mkdir fail:', res);
            if (fail) fail(res);
        }
    });
};

/**
 * 获取合法路径
 * @param path
 * @return {string}
 */
function getLegalPath(path) {
    if (!path) return usr;
    if (path.indexOf('wxfile') !== 0 && path.indexOf('http') !== 0) {
        if (path.indexOf('/') !== 0) path = '/' + path;
        path = usr + path;
    }
    return path;
}

export default files;