/**
 * 页面基类
 */
class PageBase extends ds.core.EventDispatcher {

    constructor() {
        super();
        let _self = this;
        this._name = '';
        this._view = null;
    }

    /**
     * 构建UI,请确保这个页面UI资源是在这个UI的相关资源加载完成后进行构建。
     */
    initUI() {

    }

    /**
     * 动画进场
     */
    movieIn() {
        this._movieOuting = false;
        this._movieIning = true;
        this.ds('movieIn');

        let _root = GameApp.root;
        _root.addChildAt(this._view);
        GameApp.createJsModel.update();
        this.ds('addView');

        if (this._view instanceof createjs.MovieClip) {
            this._view.gotoAndStop(0);
            this._view.gotoAndPlay(0);
        }
        else {

            this.movieInEnd();

        }
        GameApp.createJsModel.update();

        this.resize();

    }

    movieInEnd() {
        this._movieIning = false;
        this.ds('movieInEnd');
    }

    /**
     * 动画退场
     */
    movieOut() {
        // console.log(this.name, 'movieOut', this._view.movieOutFrame, this._view.movieOutEndFrame);
        this._movieOuting = true;
        this._movieIning = false;
        this.ds('movieOut');
        if (this._view instanceof createjs.MovieClip) {
            // this._view.mouseEnabled = false;
            if (this._view.movieOutFrame === this._view.movieOutEndFrame) {
                this.movieOutEnd();
            } else {
                this._view.gotoAndPlay(this._view.movieOutFrame);
            }

        } else {
            this.movieOutEnd();
        }

    }

    movieOutEnd() {
        // console.log(this.name, 'movieOutEnd', this._view.movieOutFrame);
        this._movieOuting = false;
        if (this._view.parent) this._view.parent.removeChild(this._view);
        // this._view.mouseEnabled = true;
        this.ds('movieOutEnd');
    }

    set view(value) {

        if (!value) return;
        if (this._view) return;
        this._view = value;

        let _view = this.view;

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

            }

            _view.on('tick', function () {
                if (GameApp.pager.pageLabel !== this.name) return;
                if (!this._movieIning) return;
                if (this._movieOuting) return;
                if (this._view.currentFrame >= this._view.movieInEndFrame) {
                    this.movieInEnd();
                }
            }, this);

            //监听退场
            if (_view.movieOutEndFrame && _view.movieOutFrame) {
                _view.on('tick', function () {
                    if (GameApp.pager.pageLabel !== this.name) return;
                    if (!this._movieOuting) return;
                    if (this._movieIning) return;

                    if (this._view.currentFrame >= this._view.movieOutEndFrame) {
                        this.movieOutEnd();
                    }
                }, this);
            }
        }

    }

    get view() {
        return this._view;
    }

    /**
     * 界面名称
     * @return {string}
     */
    set name(value) {
        if (this._name !== '') return;
        this._name = value;
    }

    get name() {
        return this._name;
    }

    /**
     * 自适应
     */
    resize() {

        if (this.name !== GameApp.pager.pageLabel) return;
        let _width = GameApp.width;
        let _height = GameApp.height;

        this.ds('resize');
    }
}

//获取抓帧数据信息
function getFrameLabelData(value, labels) {
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].label === value) return labels[i];
    }
    return null;
}

export default PageBase;