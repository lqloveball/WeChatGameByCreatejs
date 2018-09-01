import PanelBase from '../base/PanelBase';
import {getDefault} from '../../utils/Mixin';

/**
 * Alert 提示框
 **/
class Alert extends PanelBase {

    constructor(opts) {

        opts = opts || {};
        // console.log('opts.ok',opts.ok);
        super(opts);


        let _skinClas = opts.skinClas;
        if (!_skinClas) _skinClas = mainUI.AlertSkin;

        this.name = getDefault(opts.id, 'alert' + new Date().getTime());

        this.view = new _skinClas();

        let _btns = opts.btns = getDefault(opts.btns, ['确定']);


        opts.title = getDefault(opts.title, '提示');
        opts.info = getDefault(opts.info, '');

        let _panel = this.view.panel;

        if (_panel) {

            if (_panel.closeBtn) {
                _panel.closeBtn.on('click', () => {
                    this.hide();
                });
            }

            if (_panel.btn0) {
                _panel.btn0.on('click', () => {
                    this.hide({yes: true});
                });
            }

            if (_panel.btn1) {
                _panel.btn1.on('click', () => {
                    this.hide({yes: false});
                });
            }

            if (_btns.length === 1) {
                if (_panel.btn1) _panel.btn1.visible = false;
                if (_panel.btn0) {
                    _panel.btn0.x = Alert.skinSize[0] / 2;
                    _panel.btn0.label.text = _btns[0];
                }
            } else {
                if (_panel.btn0) _panel.btn0.label.text = _btns[0];
                if (_panel.btn1) _panel.btn1.label.text = _btns[1];
            }

            if (_panel.title) {
                ds.createjs.wrapMetrics(_panel.title, opts.title, Alert.skinWrapW);
            }
            if (_panel.info) {
                ds.createjs.wrapMetrics(_panel.info, opts.info, Alert.skinWrapW);
            }

        }


    }


    show(opts) {
        super.show(opts);
    }

    hide(opts) {
        super.hide(opts);
        if (ds.clickSound) ds.clickSound();
    }

    resize() {

        if (!this._showBool) return;
        let _width = GameApp.width;
        let _height = GameApp.height;
        let _panel = this.view.panel;


        if (_panel) {
            if (GameApp.deviceOrientation == 'portrait') {
                _panel.y = (_height - Alert.skinSize[1]) / 2;
            } else {
                _panel.x = (_width - Alert.skinSize[0]) / 2;
            }

        }


    }
}

let _alertIndex = 0;
/**
 * 快速呈现alert
 * @param opts
 * @param okfun
 * @param nofun
 */
Alert.show = function (opts, okfun, nofun) {
    _alertIndex += 1;

    opts = opts || {};

    if (typeof(opts) === 'string') {
        opts = {
            title: '提示',
            info: opts,
        };
    }


    if (okfun & nofun) {
        opts.btns = getDefault(opts.btns, ['确定', '取消']);
    }
    else {
        opts.btns = getDefault(opts.btns, ['确定']);
    }

    // console.log(okfun);
    if (okfun) opts.ok = okfun;
    if (nofun) opts.no = nofun;


    opts.id = 'alert_' + _alertIndex;
    if (!opts.skinClas) opts.skinClas = Alert.AlertSkinClass;

    let _alert = new Alert(opts);
    GameApp.paneler.add(_alert);

    _alert.show();

};
/**
 * 设置Alert 的皮肤
 * @param skin
 * @param size
 * @param wrapW
 */
Alert.setSkinClass = function (skin, size = [400, 400], wrapW = 430) {
    Alert.AlertSkinClass = skin;
    Alert.skinSize = size;
    Alert.skinWrapW = wrapW;
};


export default Alert;