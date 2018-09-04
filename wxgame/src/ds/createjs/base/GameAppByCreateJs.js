import EventDispatcher from '../../core/EventDispatcher';
import PageManager from './PageManager';
import PanelManager from './PanelManager';
import Alert from '../mui/Alert';
import {getDefault} from '../../utils/Mixin.js';

const systemInfo = wx.getSystemInfoSync();
const global = GameGlobal;
global.AdobeAn = global.AdobeAn || {};
global.ds = global.ds || {};

/**
 * 微信小游戏基础类
 */
class GameAppByCreateJs extends EventDispatcher {

    constructor(opts) {

        super();

        console.log('GameAppByCreateJs');
        if (global.GameApp) return global.GameApp;

        global.GameApp = this;

        opts = opts || {};
        this._createJsModel = ds.createjs.create(opts);

        this._stage = this._createJsModel.stage;
        this._root = this._createJsModel.root;
        this._popLayer = this._createJsModel.popLayer;
        this._topLayer = this._createJsModel.topLayer;

        this._bgBox = new createjs.Container();
        this._bg = new createjs.Shape();
        this._bgBox.addChild(this._bg);
        this._stage.addChildAt(this._bgBox, 0);
        this.background = getDefault(opts.background, '#fff');


        this._language = navigator.language;
        let u = navigator.userAgent;
        let ua = u.toLowerCase();
        this._isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        this._isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

        /**
         * 界面管理器
         */
        this.pager = new PageManager();

        /**
         * 浮动层管理器
         */
        this.paneler = new PanelManager();

        //需要考虑iphonex 类型刘海手机情况
        this._height = this.createJsModel.height;
        this._width = this.createJsModel.width;

        //是否有刘海
        this._hasBang = false;

        global.ds = global.ds || {};
        global.ds.alert = this.alert;

        this.uptSize();

    }


    /**
     * 页面跳转
     * @param value
     */
    gotoPage(value) {
        this.pager.gotoPage(value);
        if (this.pv) this.pv(value);
    }

    /**
     * 获取页面
     * @param value
     */
    getPage(value) {
        return this.pager.getPage(value);
    }

    /**
     * 浮层显示
     * @param value
     * @param opts
     */
    show(value, opts) {
        this.paneler.show(value, opts);
    }

    /**
     * 关闭所有浮层
     */
    hideAll() {
        this.paneler.hideAll();
    }

    /**
     * 设置游戏宽，高会等比换算
     * @param width
     */
    setSize(width) {

        this.createJsModel.upSize(width);
        this.uptSize();
        this.ds('resize');
    }


    /**
     * 渲染
     */
    update() {
        this.createJsModel.update();
    }

    /**
     * alert 提示框
     * @param opts
     * @param okfun
     * @param nofun
     */
    alert(opts, okfun, nofun) {
        if (!Alert.AlertSkinClass) {
            console.log('还未设置过alert skin class');
            return;
        }
        Alert.show(opts, okfun, nofun);
    }

    /**
     * 设置提示框的皮肤 class
     * @param skin
     * @param size
     * @param wrapW
     */
    setAlertSkinClass(skin, size = [400, 400], wrapW = 430) {
        Alert.setSkinClass(skin, size, wrapW);
    }

    /**
     * 更新size大小
     */
    uptSize() {

        //竖屏下刘海手机计算
        if (this.deviceOrientation === 'portrait') {
            let _h = this.createJsModel.height;
            this._height = _h;
            let _scale = 750 / this.createJsModel.width;
            let _maxH = 1600 * _scale, _y = 0;
            if (this._height >= _maxH) {
                this._height = _maxH;
                _y = (_h - _maxH);
                this._hasBang = true;
            } else {
                this._hasBang = false;
            }

            this.root.y = _y;
            this.topLayer.y = _y;
            this.popLayer.y = _y;
        }
        //TODO 横屏下刘海手机计算
        else {
            let _w = this.createJsModel.width;
            // let _scale = 1500 / this.createJsModel.width;
            if (_w >= 1500) this._hasBang = true;
            else this._hasBang = false;
        }

        //背景尺寸刷新
        this._upBackground();

    }

    /**
     * 游戏宽
     */
    get width() {
        if (this.deviceOrientation == 'portrait') return this.createJsModel.width;
        else return this.createJsModel.width;
    }

    /**
     * 游戏高
     */
    get height() {
        if (this.deviceOrientation == 'portrait') return this._height;
        else return this.createJsModel.height;
        // return this.createJsModel.height;
    }

    /**
     * 视图高
     * @return {number}
     */
    get viewHeight() {
        return this.createJsModel.height;
    }

    /**
     * 视图宽
     * @return {number}
     */
    get viewWidth() {
        return this.createJsModel.width;
    }

    /**
     * 是否IOS
     * @return {boolean}
     */
    get isIOS() {
        return this._isIOS;
    }

    /**
     * 是否Android
     * @return {boolean|*}
     */
    get isAndroid() {
        return this._isAndroid;
    }

    /**
     * 语言 zh_CN
     * @return {string}
     */
    get language() {
        return this._language;
    }

    set deviceOrientation(v) {
        if (this.createJsModel.deviceOrientation === v) return;
        this.createJsModel.deviceOrientation = v;
        this.uptSize();
    }

    get deviceOrientation() {
        return this.createJsModel.deviceOrientation;
    }

    /**
     * 实际屏幕宽
     * @return {number}
     */
    get screenWidth() {
        return systemInfo.screenWidth * systemInfo.devicePixelRatio;
    }

    /**
     * 实际屏幕高
     * @return {number}
     */
    get screenHeight() {
        return systemInfo.screenHeight * systemInfo.devicePixelRatio;
    }

    /**
     * 屏幕分辨率比例
     * @return {*}
     */
    get devicePixelRatio() {
        return systemInfo.devicePixelRatio;
    }


    /**
     * createjs模块
     * @return {*}
     */
    get createJsModel() {
        return this._createJsModel;
    }

    /**
     * 舞台
     * @return {createjs.Stage}
     */
    get stage() {
        return this._stage;
    }

    /**
     * 主容器
     * @return {createjs.Container}
     */
    get root() {
        return this._root;
    }

    get stage3d() {
        return this._createJsModel.stage3d;
    }

    get root3d() {
        return this._createJsModel.root3d;
    }
    /**
     * 弹出框层
     * @return {*|createjs.Container}
     */
    get popLayer() {
        return this._popLayer;
    }


    get topLayer() {
        return this._topLayer;
    }

    /**
     * 设置背景颜色
     * @param v
     */
    set background(v) {
        if (this._background === v) return;
        // console.log('background:', this.width, this.height);
        this._background = v;
        this._upBackground();
    }

    get background() {
        return this._background;
    }

    /**
     * 是否有手机刘海
     * @return {boolean}
     */
    get hasBang() {
        return this._hasBang;
    }

    /**
     * 更新背景色
     * @private
     */
    _upBackground() {
        this._bgBox.uncache();
        let _bg = this._bg;
        let _g = _bg.graphics;
        _g.clear();
        _g.beginFill(this._background);
        _g.drawRect(0, 0, this.createJsModel.width, this.createJsModel.height);
        _g.endFill();
        this.update();
        this._bgBox.cache(0, 0, this.createJsModel.width, this.createJsModel.height);
        // this._bgBox.x=300
    }


}


export default GameAppByCreateJs;