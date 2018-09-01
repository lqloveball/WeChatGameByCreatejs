import {getDefault} from '../../utils/Mixin';

const global = GameGlobal;

/**
 * 浮层基础类
 */
class PanelBase extends ds.core.EventDispatcher {

    constructor(opts) {

        super();
        opts = opts || {};

        this._name = '';

        this._config = opts;

        this._view = undefined;
        this._showBool = false;
        this._showRoot = getDefault(opts.root, PanelBase.showRoot);

        if (opts.ok) opts.ok = opts.ok.bind(this);
        if (opts.no) opts.no = opts.no.bind(this);
        if (opts.show) opts.show = opts.show.bind(this);
        if (opts.hide) opts.hide = opts.hide.bind(this);
        if (opts.movieInEnd) opts.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOutEnd) opts.movieOutEnd = opts.movieOutEnd.bind(this);

        this.initResize();

    }

    /**
     * 构建UI,请确保这个页面UI资源是在这个UI的相关资源加载完成后进行构建。
     */
    initUI() {

    }

    /**
     * 显示
     * @param opts
     * @param opts.cb 调用命令要做回调
     * @param opts.ok 用户点击ok时候调用
     * @param opts.no 用户点击no时候调用
     * @param opts.show  调用show命令要做回调
     * @param opts.hide  调用hide命令要做回调
     * @param opts.movieInEnd  进入完成调用
     * @param opts.movieOutEnd  退场时候调用
     * @param opts.root 显示容器  这个浮动层view需要显示到容器位置
     */
    show(opts) {

        if (this._showBool) return;

        opts = opts || {};

        let _config = this._config;

        if (opts.ok) _config.ok = opts.ok.bind(this);
        if (opts.no) _config.no = opts.no.bind(this);
        if (opts.show) _config.show = opts.show.bind(this);
        if (opts.hide) _config.hide = opts.hide.bind(this);
        if (opts.movieInEnd) _config.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOutEnd) _config.movieOutEnd = opts.movieOutEnd.bind(this);
        if (opts.root) this._showRoot = opts.root;

        this._showBool = true;

        if (GameApp  && !PanelBase.showRoot) {

            if(GameApp.popLayer)PanelBase.showRoot = GameApp.popLayer;
            else PanelBase.showRoot = GameApp.stage;

        }

        if (!this._showRoot) this._showRoot = PanelBase.showRoot;
        let _showRoot = this._showRoot;

        if (!this.initResizeBool) this.initResize();

        _showRoot.addChild(this.view);

        GameApp.createJsModel.update();

        if (this.view instanceof createjs.MovieClip) {
            this.view.gotoAndStop(0);
            this.view.gotoAndPlay(0);
        }
        else {

            this.movieInEnd();

        }

        this.ds('show');

        this.resize();

        if (_config.show) _config.show();

        if (opts.cb) opts.cb();

    }


    /**
     * 隐藏
     * @param opts
     * @param opts.yes
     * @param opts.cb
     * @param opts.ok
     * @param opts.no
     * @param opts.hide
     * @param opts.movieOutEnd
     */
    hide(opts) {


        if (!this._showBool) return;

        opts = opts || {};

        let _config = this._config;

        if (opts.ok) _config.ok = opts.ok.bind(this);
        if (opts.no) _config.no = opts.no.bind(this);
        if (opts.hide) _config.hide = opts.hide.bind(this);
        if (opts.movieInEnd) _config.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOutEnd) _config.movieOutEnd = opts.movieOutEnd.bind(this);

        this._showBool = false;

        if (this._view instanceof createjs.MovieClip) {
            if (this._view.movieOutEndFrame && this._view.movieOutFrame) {
                this._view.mouseEnabled = false;
                this._view.gotoAndPlay(this._view.movieOutFrame);
            } else {
                this.movieOutEnd();
            }
        }
        else {
            this.movieOutEnd();
        }

        // console.log('hide',opts.yes,_config.ok);
        if (opts.yes !== undefined) {

            if (typeof(opts.yes) === 'function') {
                opts.yes();
                this.ds('yesEvent');
            }
            else if (opts.yes) {
                if (_config.ok) _config.ok();
                this.ds('yesEvent');
            }
            else {
                if (_config.no) _config.no();
                this.ds('noEvent');
            }
        }
        else {
            this.ds('closeEvent');
        }

        this.ds('hide');

        if (_config.hide) _config.hide();
        if (opts.cb) opts.cb();
    }


    /**
     * 显示完成
     */
    movieInEnd() {

        if (this._config.movieInEnd) this._config.movieInEnd();
        this.ds('movieInEnd');
    }

    /**
     * 隐藏完成
     */
    movieOutEnd() {

        if (this._config.movieOutEnd) this._config.movieOutEnd();
        if (this._view.parent) this._view.parent.removeChild(this._view);
        this._view.mouseEnabled = true;
        this.ds('movieOutEnd');

    }

    /**
     * 初始化自适应
     */
    initResize() {

        if (!global['GameApp']) return;
        if (this.initResizeBool) return;
        this.initResizeBool = true;
        GameApp.on('resize', (e) => {
            this.resize();
        });

    }

    /**
     * 设置浮层显示对象
     * @param value
     */
    set view(value) {

        if (!value) return;
        if (this._view) return;

        this._view = value;

        let _view = this.view;

        let _bg = _view.bg;
        //防点穿
        if (_bg) _bg.on('click', function () {
        });

        let _closeBtn = _view.closeBtn;
        // console.log('_closeBtn', _closeBtn);
        if (_closeBtn) {
            _closeBtn.on('click', () => {
                this.hide();
            });
        }

        let _btn = _view.btn;
        if (_btn) {
            _btn.on('click', () => {
                this.hide({yes: true});
            });
        }

        let _btn_ok = _view.btn_ok || _view.okBtn;
        if (_btn_ok) {
            _btn_ok.on('click', () => {
                this.hide({yes: true});
            });
        }

        let _btn_no = _view.btn_no || _view.noBtn;
        if (_btn_no) {
            _btn_no.on('click', () => {
                this.hide({yes: false});
            });
        }


        //如果是影片剪辑
        if (this._view instanceof createjs.MovieClip) {

            //进出场动画逻辑控制
            _view.movieInEndFrame = _view.totalFrames - 1;
            _view.movieOutFrame = null;
            _view.movieOutEndFrame = null;

            if (_view.labels) {

                let _labels = _view.labels;
                let _movieInEnd = getFrameLabelData('movieInEnd', _labels);
                let _movieOut = getFrameLabelData('movieOut', _labels);
                let _movieOutEnd = getFrameLabelData('movieOutEnd', _labels);
                if (_movieOut) {
                    _view.movieOutFrame = _movieOut.position;
                    _view.movieInEndFrame = _view.movieOutFrame = _view.movieOutFrame - 1;
                }
                if (_movieInEnd) _view.movieInEndFrame = _movieInEnd.position;
                if (_view.movieInEndFrame !== _view.totalFrames - 1) {
                    if (_movieOut) _view.movieOutFrame = _movieOut.position;
                    else _view.movieOutFrame = _view.movieInEndFrame + 1;
                    if (_movieOutEnd) _view.movieOutEndFrame = _movieOutEnd.position;
                    else _view.movieOutEndFrame = _view.totalFrames - 1;
                }

                // console.log(_view.labels,_movieInEnd,_movieOut,_movieOutEnd);
            }

            //自动测试是否时间轴播放完成
            //监听进场
            _view.on('tick', function () {
                if (!this.showBool) return;
                if (_view.currentFrame >= _view.movieInEndFrame) {
                    this.movieInEnd();
                }
            }, this);
            //监听退场
            if (_view.movieOutEndFrame && _view.movieOutFrame) {
                _view.on('tick', function () {
                    if (this.showBool) return;
                    if (_view.currentFrame >= _view.movieOutEndFrame) {
                        this.movieOutEnd();
                    }
                }, this);
            }

        }


    }

    /**
     * 浮动层显示对象
     * @return {*}
     */
    get view() {
        return this._view;
    }

    /**
     * 是否浮层显示状态
     * @return {boolean}
     */
    get showBool() {
        return this._showBool;
    }

    /**
     * 浮动层名称（全站唯一）
     * @param value
     */
    set name(value) {
        if (this._name !== '') return;
        this._name = value;
    }

    get name() {
        return this._name;
    }

    /**
     * 配置
     * @return {*|{}}
     */
    get config() {
        return this._config;
    }

    /**
     * 自适应
     */
    resize() {

        if (!this._showBool) return;
        let _width = GameApp.width;
        let _height = GameApp.height;

        this.ds('resize');
    }
}

/**
 * 浮动层默认承载容器
 */
PanelBase.showRoot = null;

/**
 * 获取抓帧数据信息
 * @param value
 * @param labels
 * @return {*}
 */
function getFrameLabelData(value, labels) {
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].label === value) return labels[i];
    }
    return null;
}

export default PanelBase;