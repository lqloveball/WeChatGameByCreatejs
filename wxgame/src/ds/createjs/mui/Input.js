import EventDispatcher from '../../core/EventDispatcher';
import {getDefault} from '../../utils/Mixin';

const global = GameGlobal;

global.AdobeAn = global.AdobeAn || {};
let ds = global.ds = global.ds ? global.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.mui = ds.createjs.mui ? ds.createjs.mui : {};

const _stageMousedown = Symbol('stageMousedown');

/**
 * 输入框
 */
class Input extends EventDispatcher {
    /**
     *
     * @param display
     * @param opts
     */
    constructor(display, opts, defaultText = '') {

        super();
        opts = opts || {};
        this._type = getDefault(opts.type, 'input');
        this._maxLength = getDefault(opts.max, 1E5);
        this._multiple = getDefault(opts.multiple, (this._type === 'input' ? false : true));
        this._confirmHold = getDefault(opts.confirmHold, true);
        //done 完成 next 下一个 search 搜索 go 前往 send 发送
        this._confirmType = getDefault(opts.confirmType, 'done');
        let _value = getDefault(opts.value, null);
        //文本宽度 与 高度
        this._width = getDefault(opts.width, null);
        this._height = getDefault(opts.height, null);
        this._packUp = getDefault(opts.packUp, true);
        this._crop = getDefault(opts.crop, true);
        if (this._multiple) this._type = 'textarea';
        if (this._type === 'textarea') {
            this._crop = false;
        }

        this.name = getDefault(opts.name, '');

        let _view = this._view = display;

        //如果是一个
        if (_view instanceof createjs.Text) {
            this.label = _view;
        }
        else {
            if (_view.label && _view.label instanceof createjs.Text) {
                this.label = _view.label;
                _view.mouseChildren = false;
            }
        }

        this.label.text = '';
        this._value = '';
        this._defaultText = defaultText;
        if (_value) {
            this.value = _value;
        } else {
            this.value = this._defaultText;
        }


        _view.on('mousedown', () => {
            console.log('Input mousedown');
            this.focus();

        }, this);

    }


    /**
     * 重置
     */
    reset() {
        this.value = this._defaultText;
    }


    blur() {

        let _stage;
        if (GameApp && GameApp.createJsModel) _stage = GameApp.stage;

        if (!this.isInput) {

            this.value = this._defaultText;

        }

        // console.log(this.name, '失去焦点隐藏键盘');
        wx.offKeyboardConfirm();
        wx.offKeyboardInput();
        wx.offKeyboardComplete();
        wx.hideKeyboard({
            success: function (res) {
                // console.log('隐藏键盘')
            },
            fail: function (res) {
                // console.log("隐藏键盘出错:" + (res ? res.errMsg : ""));
            }
        });

        if (this[_stageMousedown]) {
            if (_stage) _stage.removeEventListener('mousedown', this[_stageMousedown]);
        }

        if (_stage) _stage.y = 0;

        this.ds('blur');

    }

    focus() {

        if (this.value === this._defaultText && this._defaultText !== '') this.value = '';
        this._showKeyboard();
        this.ds('focus');
    }

    _showKeyboard() {

        let _self = this;
        let _stage;
        if (GameApp && GameApp.createJsModel) _stage = GameApp.stage;


        wx.offKeyboardConfirm();
        wx.offKeyboardInput();
        wx.offKeyboardComplete();
        wx.showKeyboard({
            defaultValue: this.value,
            maxLength: this._maxLength,
            multiple: this._multiple,
            confirmHold: this._confirmHold,
            confirmType: this._confirmType,
            success: () => {
                // console.log(_self.name, 'showKeyboard');
                // if (this._value === this._defaultText && this._defaultText !== '') {
                //     wx.updateKeyboard({
                //         value: '',
                //     });
                // }
            },
            fail: () => {
            }
        });

        wx.onKeyboardInput(function (res) {
            // console.log(_self.name, 'oKeyboardInput', res.value);
            _self._boardInput(res.value);
        });

        wx.onKeyboardConfirm(function (res) {
            // console.log(_self.name, 'onKeyboardConfirm', res.value);
            _self._boardConfirm(res.value);
        });

        wx.onKeyboardComplete(function () {
            _self.blur();
        });

        if (this._stage && this[_stageMousedown]) {

            this._stage.removeEventListener('mousedown', this[_stageMousedown]);

        }

        if (!_stage) return;
        this._stage = _stage;
        this[_stageMousedown] = this._stageMousedown.bind(this);
        this._stage.addEventListener('mousedown', this[_stageMousedown]);

        if (this._packUp) {
            let _pt = this._view.localToGlobal(0, 0);
            let _height = GameApp.height;
            if (_pt.y >= _height / 2) {
                _stage.y = -_pt.y + _height / 2;
            }
        }

    }

    _stageMousedown(e) {

        let _target = e.target;

        if (!this._view.contains(_target)) {

            // console.log('不包含自己');
            this.blur();

        }

    }

    _boardInput(value) {

        if (this._maxLength !== undefined && (this.value.length > this._maxLength)) {
            value = value.slice(0, this._maxLength);
        }

        this.value = value;

    }

    _boardConfirm(value) {

        //判断超出字符串
        if (this._maxLength !== undefined && (this.value.length > this._maxLength)) {
            value = value.slice(0, this._maxLength);
        }

        this.value = value;

    }


    /**
     * 判断是否输入
     * @return {boolean}
     */
    get isInput() {
        if (this._value === this._defaultText) return false;
        if (this._value === '') return false;
        if (this._value.length <= 0) return false;
        let _v = this._value;
        if (_v.replace(/(^s*)|(s*$)/g, "").length === 0) return false;
        return true;

    }

    /**
     * 文本输入框的值
     * @readonly
     */
    get value() {
        if (this._value === this._defaultText && this._defaultText !== '') return '';
        return this._value;
    }

    set value(value) {

        if (this._value === value) return;

        this._value = value;
        if (value === '') this._value = this._defaultText;
        // if (this._value === this._defaultText && this._defaultText !== '') this._value = '';
        if (this.label) {
            if (this._width) {
                ds.createjs.wrapMetrics(this.label, this._value, this._width, this._crop);
            } else {
                // ds.createjs.wrapMetrics(this.label, this._value, this._width, this._crop);
                this.label.text = this._value;
            }
        }
    }


}

ds.createjs.mui.Input = Input;
export default ds.createjs.mui.Input;