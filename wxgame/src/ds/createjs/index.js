import {getDefault} from '../utils/Mixin.js';
import CreatejsModel from './CreatejsModel.js';
import Input from './mui/Input.js';
import LoadAssetsManager from './managers/LoadAssetsManager.js';
import {
    getFrameByLabel,
    wrapMetrics,
    addAvatar,
    formatNumberShow,
    clearMcTimeline,
    getBase64,
    textCrop
} from './utils/Utils.js';

const global = GameGlobal;
const root = global;
let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};

console.log('createjs-extend');

/**
 * 处理网络缓存资源加载
 * @param comp 资源对象
 * @param {ds.files.FilesCacheManager} fsCacher 资源缓存管理对象
 * @param opts 配置参数
 */
ds.createjs.loadAssetsByNet = function (comp, fsCacher, opts) {
    return LoadAssetsManager.loadAssetsByNet(comp, fsCacher, opts);
};

/**
 * 处理本地加载资源
 * @param comp  资源对象
 * @param opts  配置参数
 * @param opts.basePath='assets/' 本地资源路径
 * @param opts.name=undefined    资源命名空间
 * @example
 * import main from 'resource/main';
 * ds.createjs.localAssets(main,'main');
 */
ds.createjs.loadAssets = function (comp, opts) {

    return LoadAssetsManager.loadAssets(comp, opts);

};

/**
 * 添加输入框
 * @param display 显示对象 或者 文本
 * @param opts
 * @param defaultText 输入默认字体
 * @return {ds.createjs.ui.Input}
 */
ds.createjs.addInput = function (display, opts, defaultText) {
    let _input = new Input(display, opts, defaultText);
    return _input;
};

/**
 * 文本进行换行处理
 */
ds.createjs.wrapMetrics = function (label, info, width, crop) {
    wrapMetrics(label, info, width, crop);
};

/**
 * 文本显示裁切
 * @param label
 * @param value
 * @param width
 * @param size
 * @param crop
 */
ds.createjs.textCrop = function (label, value, width, size, crop) {
    textCrop(label, value, width, size, crop);
};

/**
 * 添加一个用户头像到指定容器
 */
ds.createjs.addAvatar = function (url, size, box, loadend) {

    return addAvatar(url, size, box, loadend);

};

/**
 * 格式化数字显示
 */
ds.createjs.formatNumberShow = function (value, mcList, hitZero) {

    formatNumberShow(value, mcList, hitZero);

};

/**
 * 获取动画标签的开始帧
 */
ds.createjs.getFrameByLabel = function (mc, label) {
    return getFrameByLabel(mc, label);
};

/**
 * 缓存获取一个现实对象的base64数据截图
 */
ds.createjs.getBase64 = function (display, opts) {
    return getBase64(display, opts);
};
/**
 * 清空mc时间轴
 * @param mc
 */
ds.createjs.clearMcTimeline = function (mc) {
    clearMcTimeline(mc);
};


/**
 * 创建createjs框架模板
 * @return {CreatejsModel}
 */
ds.createjs.create = function (opts) {

    opts = opts || {};

    let _canvas = getDefault(opts.canvas, window.canvas);

    let _cjsModel = new CreatejsModel(_canvas, opts);

    let _fps = getDefault(opts.fps, 30);
    ds.createjs.setFPS(_fps);

    return _cjsModel;
};

/**
 * 设置FPS
 * @param value
 */
ds.createjs.setFPS = function (value) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = value;
};

export default ds.createjs;