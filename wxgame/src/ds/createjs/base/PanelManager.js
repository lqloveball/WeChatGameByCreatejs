import PanelBase from './PanelBase';

/**
 * 浮层管理器
 */
class PanelManager extends ds.core.EventDispatcher {

    constructor() {
        super();

        this._panelList = [];
        this._panelDc = {};

        this.root = null;
    }

    /**
     * 设置默认互动层承载的容器
     * @param root
     */
    setRoot(root) {
        PanelBase.showRoot = root;
    }

    /**
     * 显示浮层
     * @param label
     * @param opts
     */
    show(label, opts) {
        opts = opts || {};
        let _pl = this.getPanel(label);

        if (_pl) _pl.show(opts);
    }

    /**
     * 隐藏浮层
     * @param label
     * @param opts
     */
    hide(label, opts) {
        opts = opts || {};
        let _pl = this.getPanel(label);
        if (_pl) _pl.hide(opts);
    }

    /**
     * 隐藏所有浮层
     * @param {function} cb 执行隐藏后回调
     */
    hideAll(cb) {
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _pl = _panelList[i];
            _pl.hide();
        }
        if (cb) cb();
    }

    /**
     * 添加一个浮层
     * @param panel
     */
    add(panel) {

        if (this._panelList.indexOf(panel) !== -1) return;

        let _name = panel.name;

        if (!_name) {
            panel.name = 'wxGamePanel' + this._panelList.length;
        }
        if (this._panelDc[_name]) {
            console.warn('不能添加相同名字的浮动层：', _name);
            return;
        }
        this._panelDc[_name] = panel;
        this._panelList.push(panel);
    }

    /**
     * 删除一个浮层
     * @param panel
     */
    remove(panel) {

        if (this._panelList.indexOf(panel) <= 0) return;
        let _name = panel.name;
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _temp = _panelList[i];
            _panelList.splice(i, 1);
        }
        this._panelDc[_name] = undefined;

    }

    /**
     * 是否有显示浮动层
     * @return {boolean}
     */
    hasShowPanel() {

        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _panel = _panelList[i];
            if (_panel.showBool) return true;
        }
        return false;
    }

    /**
     * 显示浮动层列表
     * @return {Array}
     */
    showPanelList() {
        let _list = [];
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _panel = _panelList[i];
            if (_panel.showBool) _list.push(_panel);
        }
        return _list;
    }

    /**
     * 获取浮层
     * @param label
     * @return {*}
     */
    getPanel(label) {
        return this._panelDc[label];
    }

    /**
     * 浮层字典
     * @return {{}|*}
     */
    get panelDc() {
        return this._panelDc;
    }

    /**
     * 浮层列表
     * @return {Array}
     */
    get panelList() {
        return this._panelList;
    }

}

export default PanelManager;