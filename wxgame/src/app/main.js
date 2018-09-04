//加载管理类
import LoadManager from './models/LoadManager';
//UI管理器
import UIManager from './view/UIManager';


class GameMain {
    constructor() {

        //初始化本地资源
        LoadManager.initlocalUIAssets();
        //初始化本地初步UI构建
        UIManager.initMainUI();

        //跳转到第一个页面
        GameApp.gotoPage('Main');

        //TODO 开始加载网络资源
        // this.initLoadNetAssets();

        //测试
        GameApp.getPage('Main').showBtnPanel();

    }

    /**
     * 开始加载网络资源
     */
    initLoadNetAssets() {

        //加载开始
        LoadManager.on('assetsLoadStart', () => {

        });

        //加载进度
        LoadManager.on('assetsLoadProgress', (e) => {

        });

        //加载完成
        LoadManager.on('assetsLoadEnd', () => {

            // GameApp.firstPage = 'SelectPage';
            // 获取首页 './view/Main.js'，设置显示首页按钮界面
            GameApp.getPage('Main').showBtnPanel();


        });

        //加载失败
        LoadManager.on('assetsLoadFail', () => {

        });

        //开始加载网络资源
        LoadManager.initNetToLocalAssets();

    }
}

const gameMain = new GameMain();
GameApp.gameMain = gameMain;