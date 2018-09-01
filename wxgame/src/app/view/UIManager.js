import Main from './Main';

/**
 * UI管理器
 */
class UIManager extends ds.core.EventDispatcher {

    constructor() {
        super();
    }

    //初始化本地资源相关UI
    initMainUI() {

        //首页UI资源初始化
        Main.initUI();

        //设置提示框皮肤  资源的弹出框类， 弹出框宽高, 提示文本换行
        GameApp.setAlertSkinClass(main.Alert,[580,363],464);
    }
}

export default new UIManager();