import PageBase from "../../ds/createjs/base/PageBase";
import LoadManager from '../models/LoadManager';


class Main extends PageBase {
    constructor() {
        super();
        this.name = 'Main';
        this.view;
    }

    initUI() {

        this.view = new main.Main();
        this.bg = this.view.bg;

        //加载进度条
        this.loadPanel = this.view.loadPanel;
        this.loadPanel.visible = false;

        //加载进度状态监听

        //开始加载
        LoadManager.on('assetsLoadStart', () => {
            this.loadPanel.visible = true;
        });

        //加载进度
        LoadManager.on('assetsLoadProgress', (e) => {
            let _loadPanel = this.loadPanel;
            let _ps = (e.progress * 100) >> 0;
            _loadPanel.label.text = _ps + '%';
            if (_ps >= 99) _ps = 99;
            _loadPanel.gotoAndStop(_ps);
        });

        //加载完成
        LoadManager.on('assetsLoadEnd', () => {
            this.loadPanel.gotoAndStop(100);
        });

        //加载失败
        LoadManager.on('assetsLoadFail', () => {

        });

        //按钮
        this.btnPanel = this.view.btnPanel;
        this.btnPanel.visible = false;

        this.btnPanel.btn0.on('click', () => {
            GameApp.alert('游戏还未编写');
        });

        this.btnPanel.btn1.on('click', () => {
            GameApp.alert({
                info: 'About还未编写',
                btns: ['取消', '继续']
            });
        });

    }

    movieIn() {

        // super.movieIn();

        //使用 webgl 进行渲染
        GameApp.root3d.addChild(this.view);
        this.resize();

    }

    /**
     * 资源加载完毕，显示首页按钮
     */
    showBtnPanel() {
        this.btnPanel.visible = true;
    }

    resize() {

        if (GameApp.pager.pageLabel != this.name) return;
        let _width = GameApp.width;
        let _height = GameApp.height;

        this.view.x = (_width - 1500) / 2;

        let _s = _width / 1500;
        this.bg.scaleX = this.bg.scaleY = _s;


    }
}

let pageModel = new Main();
GameApp.pager.add(pageModel);
export default pageModel;