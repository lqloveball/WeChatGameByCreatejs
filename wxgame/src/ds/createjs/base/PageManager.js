/**
 * 界面切换管理器
 * 为createjs小游戏框架设计
 */
class PageManager extends ds.core.EventDispatcher {

    constructor() {

        super();

        this._pageList = [];
        this._pageDc = {};
        this._pageModel = null;
        this._oldPageModel = null;
        this._pageLabel = '';
        this._oldPageLabel = '';

    }

    /**
     * 界面调整
     * @param {string|number} value
     */
    gotoPage(value) {



        let _page;

        if (typeof value === 'number') {
            _page = this._pageList[value];
            if (!_page) return;
            if (!_page.name) return;
            value = _page.name;
        }
        else if (typeof value === 'object') {
            _page = value;
            if (this._pageList.indexOf(_page) < 0) return;
            if (!_page.name) return;
            value = _page.name;
        }

        // console.log('gotoPage:',this._pageLabel,value);

        if (this._pageLabel === value) return;

        let _temp = this._pageDc[value];

        if (!_temp) return;

        let _oldPageLabel = this._pageLabel;
        let _pageLabel = value;

        let _oldPageModel = this._pageModel;
        let _pageModel = _temp;

        if (_oldPageModel) {

            _oldPageModel.once('movieOutEnd', () => {

                this._oldPageLabel = this._pageLabel;
                this._pageLabel = value;
                this._oldPageModel = _oldPageModel;
                this._pageModel = _pageModel;

                if (this._pageModel.movieIn) this._pageModel.movieIn();

                this.ds({
                    type: 'update',
                    label: this.pageLabel,
                    page: this.pageModel,
                    oldPage: this.oldPageModel,
                    oldLabel: this.oldPageLabel,
                });

            });

            _oldPageModel.movieOut();

        }
        else {

            this._oldPageLabel = this._pageLabel;
            this._pageLabel = value;
            this._oldPageModel = _oldPageModel;
            this._pageModel = _pageModel;

            if (this._pageModel.movieIn) this._pageModel.movieIn();

            this.ds({
                type: 'update',
                label: this.pageLabel,
                page: this.pageModel,
                oldPage: this.oldPageModel,
                oldLabel: this.oldPageLabel,
            });
        }

    }

    /**
     * 添加页面
     * @param page
     */
    add(page) {

        if (this._pageList.indexOf(page) !== -1) return;

        let _name = page.name;
        if (!_name) {
            _name = 'wxGamePage' + this._pageList.length;
            page.name = _name;
        }
        if (this._pageDc[_name]) {
            console.warn('不能添加相同名字的页面：', _name);
            return;
        }
        this._pageDc[page.name] = page;
        this._pageList.push(page);
    }

    /**
     * 获取界面
     * @param value
     * @return {*}
     */
    getPage(value) {
        return this._pageDc[value];
    }

    get pageDc() {
        return this._pageDc;
    }

    get pageList() {
        return this._pageList;
    }

    get pageModel() {
        return this._pageModel;
    }

    get oldPageModel() {
        return this._oldPageModel;
    }

    get pageLabel() {
        return this._pageLabel;
    }

    get oldPageLabel() {
        return this._oldPageLabel;
    }
}

export default PageManager;