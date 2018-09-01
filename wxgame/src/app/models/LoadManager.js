import FilesCacheManager from '../../ds/files/FilesCacheManager';

/**
 * 加载管理器
 */
class LoadManager extends ds.core.EventDispatcher {
    constructor() {
        super();

        //缓存加载网络文件版本（修改强制刷新大版本）
        let _version = '0.0.1';
        //游戏资源缓存管理器
        this.gameFiles = new FilesCacheManager('gameFiles', _version, false);


    }

    /**
     * 初始化本地打包Animate的资源文件
     */
    initlocalUIAssets() {

        //在 `assets/index.js` 内定义的。
        ds.createjs.loadAssets(mainFla, 'main');

    }

    /**
     * TODO 加载网络资源到本地
     */
    initNetToLocalAssets() {

    }
}

export default new LoadManager();