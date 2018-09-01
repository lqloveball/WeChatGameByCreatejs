
const _canvas = document.createElement("canvas");
const _stage = new createjs.Stage(_canvas);
const _boundsTempBox = new createjs.Container();
_stage.addChild(_boundsTempBox);

/**
 * 获取显示对象的类
 * @memberof ds.createjs.utils.Utils
 * @return {Class}
 */
function getClassByDisplay(display) {

    if (display instanceof createjs.DisplayObject) {
        return display.constructor;
    }
    return null;
}

/**
 * 获取发布资源 一个容器内的子显示对象
 * @memberof ds.createjs.utils.Utils
 * @param mc
 */
function getMCChildrens(mc) {
    let _childrens = [];
    if (mc instanceof createjs.MovieClip) {
        for (let key in mc) {
            let _temp = mc[key];
            if (_temp !== mc.parent && _temp !== mc.stage) {
                if (_temp instanceof createjs.DisplayObject) {
                    // console.log('key',key);
                    _childrens.push(_temp);
                }
            }
        }
    }
    return _childrens;
}

/**
 * 获取一个临时用来计算边界使用的容器对象
 * @memberof ds.createjs.utils.Utils
 * @return {*}
 */
function getBoundsTempModel() {
    return {stage: _stage, box: _boundsTempBox};
}

/**
 * 获取动画标签的开始帧
 * @memberof  ds.createjs.utils.Utils
 * @param {createjs.MovieClip} mc
 * @param {String} label
 */
function getFrameByLabel(mc, label) {
    if (mc instanceof createjs.MovieClip) {
        let _labels = mc.labels;
        for (let i = 0; i < _labels.length; i++) {
            if (_labels[i].label === label) return _labels[i].position;
        }
        return -1;
    }
    return -1;
}

/**
 * 文本裁切
 * @memberof ds.createjs.utils.Utils
 * @param label  createjs.Text
 * @param value  内容
 * @param width  宽
 * @param size   fontSize
 * @param crop   是否裁切补..
 */
function textCrop(label, value, width, size, crop) {

    let _ot = '';
    for (let i = 0; i < value.length; i++) {
        _ot = _ot + value[i];
        label.text = _ot;
        let _w = label.getMetrics().width;
        if (_w > width - size) {
            if (crop) label.text = _ot.split(0, _ot.length - 2) + '..';
            else label.text = _ot.split(0, _ot.length - 1);
            return;
        }
    }
}

/**
 * 文本进行换行处理
 * @memberof ds.createjs.utils.Utils
 * @param {create.Text} label 文本框对象
 * @param {string} info  内容字符串
 * @param {number} width  文本框显示最大宽度（多宽换行）
 * @param {boolean} [crop=false]  是否裁切,设置true,不会做换行，超出部分是裁切
 */
function wrapMetrics(label, info, width, crop) {
    crop = crop === undefined ? false : crop;

    if (info.length <= 0) {

        label.text = '';
        return;

    }

    let _info = '',
        _oinfo;

    for (let i = 0; i < info.length; i++) {

        _oinfo = _info;
        _info = _oinfo + info[i];
        label.text = _info;

        let _w = label.getMetrics().width;

        if (crop && _w > width) {

            label.text = _oinfo.split(0, _oinfo.length - 3) + '...';

            return;

        }

        if (_w > width) {

            label.text = _oinfo + '\n' + info[i];
            _w = label.getMetrics().width;

        }

        _info = label.text;

    }

}


/**
 * 格式化数字显示
 * @memberof ds.createjs.utils.Utils
 * @param  {number|string} value  数字
 * @param  {array} mcList 格式化显示用的影片剪辑列表 [mc0,mc1] ,影片剪辑是0-9的序列帧
 * @param  {boolean} [hitZero=false] 是否隐藏前面的零
 */
function formatNumberShow(value, mcList, hitZero) {
    hitZero = hitZero !== undefined ? hitZero : false;
    if (value <= 0) value = 0;
    let _info = value + '';

    let i;

    if (_info.length < mcList.length) {

        let _l = mcList.length - _info.length;

        for (i = 0; i < _l; i++) _info = '0' + _info;

    }

    let _arr = _info.split('');
    let _starNoZero = false;

    for (i = 0; i < _arr.length; i++) {

        let _mc = mcList[i];
        let _num = Number(_arr[i]);
        _mc.gotoAndStop(_num);
        _mc.visible = true;

        if (hitZero) {

            if (_num !== 0) _starNoZero = true;

            if (!_starNoZero && _num === 0) _mc.visible = false;

        }

    }
}

/**
 * 添加一个用户头像到指定容器
 * @memberof ds.createjs.utils.Utils
 * @param {string} url  头像地址
 * @param {number} size  缩放头像大小
 * @param {createjs.Container} box=undefined 添加到容器
 * @param {function} loadend=undefined 头像加载完成方法  会传2个参数 第一个bmp是createjs.Bitmap对象，第2个代表是获取图片正确还是错误
 * @return {createjs.Bitmap} 一个位图显示对象
 */
function addAvatar(url, size, box, loadend) {
    let _img = new Image();
    // _img.crossOrigin = "Anonymous";
    let _bmp = new createjs.Bitmap();
    _bmp.image = _img;
    _img.onload = function () {
        if (box) box.addChild(_bmp);
        let _s = size / _img.width;
        _bmp.scaleX = _bmp.scaleY = _s;
        if (loadend) loadend(_bmp, true);
    };

    _img.onerror = function () {
        if (loadend) loadend(_bmp, false);
    };
    _img.src = url;
    return _bmp;
}


/**
 * 缓存获取一个现实对象的base64数据截图
 * @memberof ds.createjs.utils.Utils
 * @param {createjs.DisplayObject} display 需要进行缓存获取的显示对象
 * @param {object} opts 截图设置参数
 * @param {string} [opts.type='png'] 截图保存图片格式类型
 * ##### 类型：
 * - png --> 设置png导出
 * - jpg --> 设置jpg时候可以设置质量 opts.encoder
 * @param {number} [opts.encoder=0.8] 保存jpg类型时候base64的图片质量
 * @param {number} opts.width 截图宽
 * @param {number} opts.height 截图高
 * @return {string}  base64数据
 */
function getBase64(display, opts) {

    opts = opts || {};
    let _base64;

    let _rect = new createjs.Rectangle();

    if (opts.width) {

        _rect.width = opts.width;
        _rect.height = opts.height || opts.width;

    }
    else {

        let _temp = display.getBounds();
        _rect.width = _temp.width + _temp.x;
        _rect.height = _temp.height + _temp.y;

    }

    display.cache(_rect.x, _rect.y, _rect.width, _rect.height);

    if (opts.type === 'jpg') _base64 = display.cacheCanvas.toDataURL("image/jpeg", opts.encoder !== undefined ? opts.encoder : 0.8);
    else _base64 = display.cacheCanvas.toDataURL("image/png");

    display.uncache();

    if (opts.debug) {

    }

    return _base64;
}

/**
 * 清空movieClip做容器盒子，需要对原来的timeline做出处理
 * @param mc
 */
function clearMcTimeline(mc) {
    if (mc instanceof createjs.MovieClip) {
        mc.timeline = new createjs.Timeline();
    }
};


export {
    getFrameByLabel,
    textCrop,
    wrapMetrics,
    formatNumberShow,
    addAvatar,
    getBase64,
    getMCChildrens,
    getBoundsTempModel,
    getClassByDisplay,
    clearMcTimeline,
};



