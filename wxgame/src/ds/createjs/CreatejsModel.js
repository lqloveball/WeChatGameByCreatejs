import {getDefault} from '../utils/Mixin.js';

class CreatejsModel {

    /**
     * 构造函数，初始化创建一个快速使用createjs模块
     * @param {CanvasElement} [canvas = undefined] 一个canvas对象
     */
    constructor(canvas, opts) {

        opts = opts || {};

        this.pause = false;

        //是否使用webgl
        let _hasWebgl = getDefault(opts.webgl, false);
        console.log('hasWebgl', _hasWebgl);


        //设备尺寸
        this._deviceSize = getDefault(opts.size, 750);
        //设备方向
        this._deviceOrientation = getDefault(opts.deviceOrientation, 'portrait');


        this.stage = new createjs.Stage(canvas);

        if (_hasWebgl) {

            let _canvas = document.createElement("canvas");

            let _innerWidth = window.innerWidth;
            let _innerHeight = window.innerHeight;

            if (this.deviceOrientation === 'portrait') {
                let _scale = _innerWidth / this._deviceSize;
                _canvas.width = this._deviceSize;
                _canvas.height = _innerHeight / _scale;
            }
            else {
                let _scale = _innerHeight / this._deviceSize;
                _canvas.width = _innerWidth / _scale;
                _canvas.height = this._deviceSize;
            }

            this.stage3d = new createjs.StageGL(_canvas);
            this.stage3d.enableMouseOver(false);
            this.stage.nextStage = this.stage3d;

            this.root3d = new createjs.Container();
            this.stage3d.addChild(this.root3d);

            this.stage3dBMP = new createjs.Bitmap(_canvas);
            this.stage.addChild(this.stage3dBMP);

        }


        this.root = new createjs.Container();
        this.stage.addChild(this.root);

        this.popLayer = new createjs.Container();
        this.stage.addChild(this.popLayer);

        this.topLayer = new createjs.Container();
        this.stage.addChild(this.topLayer);

        this.stage.mouseMoveOutside = true;
        this.stage.mouseInBounds = true;
        this.stage.update();

        createjs.MotionGuidePlugin.install();

        this._addTick();

        this.stage.enableMouseOver(60);

        createjs.Touch.enable(this.stage);

        this.upSize();

    }

    _addTick() {
        createjs.Ticker.on('tick', this._tickEvent, this);
    }

    _removeTick() {
        createjs.Ticker.off('tick', this._tickEvent);
    }

    _tickEvent() {
        this.update();
    }

    /**
     * 设置fps帧数
     * @param {number} value 一般会设置30帧每秒
     */
    setFPS(value) {

        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = value;
        wx.setPreferredFramesPerSecond(value);

    }

    update() {
        if (this.pause) return;
        this.stage.update();
        if (this.stage3d) this.stage3d.update();
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    /**
     * 更新尺寸大小
     */
    upSize() {

        let _innerWidth = window.innerWidth;
        let _innerHeight = window.innerHeight;

        //竖屏模式下
        if (this.deviceOrientation === 'portrait') {

            this._width = this._deviceSize;
            let _scale = _innerWidth / this._width;

            this._height = _innerHeight / _scale;
            this.stage.canvas.width = this._width;
            this.stage.canvas.height = this._height;

        }
        //横屏模式下
        else {

            this._height = this._deviceSize;
            let _scale = _innerHeight / this._height;
            this._width = _innerWidth / _scale;

            this.stage.canvas.width = this._width;
            this.stage.canvas.height = this._height;

        }

        // console.log('upSize', this.deviceOrientation, _innerWidth, _innerHeight, this._width, this._height);

    }

    /**
     * 横竖屏幕
     * @param v  portrait  landscape
     */
    set deviceOrientation(v) {
        if (this._deviceOrientation === v) return;
        this._deviceOrientation = v;
        this.upSize();
        // console.log('deviceOrientation update');
    }

    get deviceOrientation() {
        return this._deviceOrientation;
    }

}

const global = GameGlobal;
global.AdobeAn = global.AdobeAn || {};
let ds = global.ds = global.ds ? global.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.CreatejsModel = CreatejsModel;

export default CreatejsModel;

