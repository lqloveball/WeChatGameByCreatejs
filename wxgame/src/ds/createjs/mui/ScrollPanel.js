import EventDispatcher from '../../core/EventDispatcher';
import {getDefault} from '../../utils/Mixin';
import {getMCChildrens, getBoundsTempModel} from '../utils/Utils';
import {sHex2Rgb} from '../../utils/Color';
import TouchSlider from '../managers/TouchSlider';

/**
 * 滚动条组件
 * @class
 * @memberof ds.createjs.mui
 */
class ScrollPanel extends EventDispatcher {

    /**
     * @param skin 需要控制皮肤
     * @param opts  滚动的内容高度
     * @param opts.viewW  视图宽
     * @param opts.viewH  视图宽
     * @param opts.width  内容宽
     * @param opts.height  内容高
     * @param opts.vertical=true  是否纵向
     * @param opts.hasMask=false  是否自动创建遮罩
     * @param opts.hasBar=false  是否有滚动bar
     * @param opts.barColor='#fff'  滚动bar颜色
     * @param opts.lock=false  是否锁定
     */
    constructor(skin, opts) {

        super();
        opts = opts || {};
        this._skin = skin;

        if (skin instanceof createjs.MovieClip) {
            skin.timeline = new createjs.Timeline();
        }

        //获取内容容器
        let _target;
        if (skin.content) _target = skin.content;
        else if (skin.box) _target = skin.box;
        else if (skin.info) _target = skin.info;
        else {

            if (skin instanceof createjs.MovieClip) {
                let _childrens = getMCChildrens(skin);
                console.log('自己创建一个容器对象', _childrens);
                _target = new createjs.Container();
                for (let i = 0; i < _childrens.length; i++) {
                    _target.addChild(_childrens[i]);
                }

            }
            else {
                throw "ScrollPanel skin对象格式错误";
                return;
            }
        }


        //视图宽
        this._viewW = getDefault(opts.viewW, 100);

        //视图高
        this._viewH = getDefault(opts.viewH, 100);

        //内容宽
        this._width = opts.width;

        //内容高
        this._height = opts.height;

        //是否纵向
        this._vertical = getDefault(opts.vertical, true);

        //根据内容获取内容宽高
        if ((this._height === void 0 && this.vertical) || (this._width === void 0 && !this.vertical)) {

            let _tempModel = getBoundsTempModel();
            let _tempBox = _tempModel.box;
            let _stage = _tempModel.stage;
            _tempBox.removeAllChildren();
            _tempBox.addChild(_target);
            _stage.update();
            let _rect = _target.getBounds();
            _tempBox.removeAllChildren();
            this._width = _rect.width;
            this._height = _rect.height;
            skin.addChild(_target);

        }

        this._target = _target;
        skin.addChild(this._target);

        this._touchBg = new createjs.Shape();
        this._touchBg.alpha = 0.01;
        this._upTouchBgDarw();
        skin.addChildAt(this._touchBg, 0);

        if (this._height === void 0 && this.vertical) {
            throw "ScrollPanel 纵向需要设置内容的高";
        }
        else if (this._width === void 0 && !this.vertical) {
            throw "ScrollPanel 横向需要设置内容的宽";
        }

        //滚动距离
        this._scrollValue = 0;

        if (this.vertical) {
            if (this._height >= this._viewH) this._scrollValue = this._viewH - this._height;
        }
        else {
            if (this._width >= this._viewW) this._scrollValue = this._viewW - this._width;
        }


        this._mask = new createjs.Shape();
        //是否自动创建遮罩
        this.hasMask = getDefault(opts.hasMask, false);


        let _barColor = getDefault(opts.barColor, '#fff');
        let _bgColor = opts.bgColor;
        if (_bgColor === void 0) {
            let _colors = sHex2Rgb(_barColor);
            _bgColor = "rgba(" + _colors.join(",") + ",0.2)";
            // console.log(_bgColor);
        }

        this._barStyle = {
            width: this.vertical ? 10 : this._viewW,
            height: this.vertical ? this._viewH : 10,
            color: _barColor,
            bgColor: _bgColor,
        };

        this._initBar();
        //是否有Bar
        this.hasBar = getDefault(opts.hasBar, false);


        let _touchSlider = new TouchSlider(_target, {
            touch: skin,
            min: this._scrollValue,
            max: 0,
            deceleration: 0.008,
            property: this.vertical ? 'y' : 'x',
            vertical: this.vertical,
            change: () => {
                this._change();
            }
        });

        this.touchSlider = _touchSlider;

        this.lock = getDefault(opts.lock, false);


    }

    /**
     * 滚动到指定区域
     * @param value
     * @param time
     * @param cb
     */
    scrollTo(value, time, cb) {
        this.touchSlider.to(value, time, cb);
    }

    /**
     * 设置显示区域大小
     * @param w
     * @param h
     * @param updateBar
     */
    setSize(w, h, updateBar = true) {

        //内容宽
        this._viewW = w;
        //内容高
        this._viewH = h;

        //重新计算滚动区域
        if (this.vertical) {

            this._scrollValue = 0;
            if (this._height >= this._viewH) this._scrollValue = this._viewH - this._height;
            this.touchSlider.min = this._scrollValue;

        } else {

            this._scrollValue = 0;
            if (this._width >= this._viewW) this._scrollValue = this._viewW - this._width;
            this.touchSlider.min = this._scrollValue;

        }


        if (this.hasMask) this._upMaskDarw();
        if (this.hasBar) {
            if (updateBar) {
                if (this.vertical) this._barStyle.height = this._viewH;
                else this._barStyle.width = this._viewW;
            }
            this._upBarDarw();
        }

    }

    /**
     * 变化是否
     * @private
     */

    _change() {

        if (this.hasBar) this._upBarDarw();
        this.ds('update');

    }

    /**
     * 初始化bar
     * @private
     */
    _initBar() {

        this._scrollBar = new createjs.Container();
        this._barBg = new createjs.Shape();
        this._scrollBar.addChild(this._barBg);
        this._bar = new createjs.Shape();
        this._scrollBar.addChild(this._bar);

        this._upBarDarw();

    }

    /**
     * 绘制bar
     * @private
     */
    _upBarDarw() {

        let _vertical = this.vertical;
        let _barStyle = this._barStyle;
        let _width = _barStyle.width;
        let _height = _barStyle.height;

        let _bgColor = _barStyle.bgColor;
        let _color = _barStyle.color;
        let _sd = _vertical ? _height - (_height / 4) : _width - (_width / 4);


        let _bar = this._bar;
        let _g = _bar.graphics;


        let _v = _vertical ? this._target.y : this._target.x;
        let _ps = 0;


        if (_v <= 0 && _v >= this._scrollValue) {

            _ps = _v / this._scrollValue;

            if (_vertical) {
                _bar.y = _ps * _sd;
                _g.clear();
                _g.f(_color).rr(0, 0, _width, _height / 4, _width / 2);
            }
            else {
                _bar.x = _ps * _sd;
                _g.clear();
                _g.f(_color).rr(0, 0, _width / 4, _height, _height / 2);
            }


        }
        else {
            if (_v >= 0) {

                let _s = Math.min((1 + _v / this._scrollValue), 1);

                if (this._scrollValue >= 0) _s = 0;

                if (_vertical) {
                    _bar.y = 0;
                    let _h = (_height / 4) * (_s * 0.5 + 0.5);
                    _g.clear();
                    _g.f(_color).rr(0, 0, _width, _h, _width / 2);
                }
                else {
                    _bar.x = 0;
                    let _w = (_width / 4) * (_s * 0.5 + 0.5);
                    _g.clear();
                    _g.f(_color).rr(0, 0, _w, _height, _height / 2);
                }

            }
            else {

                let _s = Math.min(1 - (_v - this._scrollValue) / this._scrollValue, 1);
                if (this._scrollValue >= 0) _s = 0;
                // console.log(((_v - this._scrollValue) / this._scrollValue).toFixed(3),_s);
                if (_vertical) {
                    let _h = (_height / 4) * (_s * 0.5 + 0.5);
                    _g.clear();
                    _g.f(_color).rr(0, 0, _width, _h, _width / 2);
                    _bar.y = _height - _h;
                } else {
                    let _w = (_width / 4) * (_s * 0.5 + 0.5);
                    _g.clear();
                    _g.f(_color).rr(0, 0, _w, _height, _height / 2);
                    _bar.x = _width - _w;
                }

            }
        }


    }


    _upMaskDarw() {
        let _mask = this._mask;
        let _g = _mask.graphics;
        _g.clear();
        _g.beginFill("red");
        _g.drawRect(0, 0, this._viewW, this._viewH);
    }

    _upTouchBgDarw() {
        let _sp = this._touchBg;
        let _g = _sp.graphics;
        _g.clear();
        _g.beginFill("#fff");
        _g.drawRect(0, 0, this._viewW, this._viewH);
    }

    /**
     * 获取当前滚动进度
     */
    get progress() {
        let _v = this.vertical ? this._target.y : this._target.x;
        let _ps = 0;

        if (_v >= 0) _ps = 0;
        else if (_v >= this._scrollValue) _ps = 1;
        else _ps = _v / this._scrollValue;

        this._progress = _ps;
    }

    /**
     * 是否拥有bar
     * @param v
     */
    set hasBar(v) {
        if (this._hasBar === v) return;
        this._hasBar = v;
        if (this._hasBar) {

            let _vertical = this.vertical;
            let _barStyle = this._barStyle;
            let _width = _barStyle.width;
            let _height = _barStyle.height;
            let _bgColor = _barStyle.bgColor;

            let _bg = this._barBg;
            let _g = _bg.graphics;

            if (_vertical) {

                this._scrollBar.x = this._viewW - _barStyle.width;
                this._scrollBar.y = _barStyle.y ? _barStyle.y : 0;
                _g.clear();
                _g.f(_bgColor).rr(0, 0, _width, _height, _width / 2);

            }
            else {

                this._scrollBar.y = this._viewH - _barStyle.height;
                this._scrollBar.x = _barStyle.x ? _barStyle.x : 0;
                _g.clear();
                _g.f(_bgColor).rr(0, 0, _width, _height, _height / 2);

            }


            this._skin.addChild(this._scrollBar);
            this._upBarDarw();

        }
        else {
            if (this._scrollBar.parent) this._scrollBar.parent.removeChild(this._scrollBar);
        }
    }

    get hasBar() {
        return this._hasBar;
    }

    /**
     * 实在是否有遮罩
     * @param v
     */
    set hasMask(v) {
        if (this._hasMask === v) return;
        this._hasMask = v;

        if (this._hasMask) {
            this._upMaskDarw();
            this._target.mask = this._mask;
        } else {
            this._target.mask = null;
        }

    }

    get hasMask() {
        return this._hasMask;
    }

    set viewW(v) {
        if (this._viewW === v) return;
        this._viewW = v;
        if (!this._vertical) {
            if (this._width >= this._viewW) this._scrollValue = this._viewW - this._width;
            this.touchSlider.min = this._scrollValue;
        }
        if (this._vertical) {
            if (this._height >= this._viewH) this._scrollValue = this._viewH - this._height;
            this.touchSlider.min = this._scrollValue;
        }
        this._upMaskDarw();
        this._upBarDarw();
        this._upTouchBgDarw();
    }

    get viewW() {
        return this._viewW;
    }

    set viewH(v) {
        if (this._viewH === v) return;
        this._viewH = v;
        if (!this._vertical) {
            if (this._width >= this._viewW) this._scrollValue = this._viewW - this._width;
            this.touchSlider.min = this._scrollValue;
        }
        if (this._vertical) {
            if (this._height >= this._viewH) this._scrollValue = this._viewH - this._height;
            this.touchSlider.min = this._scrollValue;
        }
        this._upMaskDarw();
        this._upBarDarw();
        this._upTouchBgDarw();
    }

    get viewH() {
        return this._viewH;

    }

    /**
     * 设置内容宽
     * @param v
     */
    set width(v) {
        if (this.vertical) return;
        if (this._width === v) return;
        this._width = v;

        this._scrollValue = 0;
        if (!this._vertical) {
            if (this._width >= this._viewW) this._scrollValue = this._viewW - this._width;
            this.touchSlider.min = this._scrollValue;
        }
    }

    get width() {
        return this._width;
    }

    /**
     * 设置内容高
     * @param v
     */
    set height(v) {
        if (!this.vertical) return;
        if (this._height === v) return;
        this._height = v;

        this._scrollValue = 0;
        if (this._vertical) {
            if (this._height >= this._viewH) this._scrollValue = this._viewH - this._height;
            this.touchSlider.min = this._scrollValue;
        }

    }

    get height() {
        return this._height;
    }

    /**
     * 方向
     * @return {*}
     */
    get vertical() {
        return this._vertical;
    }


    /**
     * 设置锁定
     * @param value
     */
    set lock(value) {
        this.touchSlider.lock = value;
    }

    get lock() {
        return this.touchSlider.lock;
    }


}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.mui = ds.createjs.mui ? ds.createjs.mui : {};
ds.createjs.mui.ScrollPanel = ScrollPanel;

export default ScrollPanel;