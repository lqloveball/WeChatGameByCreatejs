/**
 * 返回默认值方法
 * @memberof module:ds/utils/mixin
 * @param  {*} obj  一个对象
 * @param  {*} defaultValue 转换后默认值
 * @return {*}
 */
function getDefault(obj, defaultValue) {
    if (obj === undefined || obj === null) return defaultValue;
    if (obj === 'true') return true;
    else if (obj === 'false') return false;
    return obj;
}

/**
 * 获取layout布局
 * @memberof module:ds/utils/mixin
 * @param w
 * @param h
 * @param tw
 * @param th
 * @param type='inSide' 默认缩放在宽内，其他就撑满 'outSide'
 */

function getLayout(w, h, tw, th, type = 'inSide') {
    let _s = 1;
    let _sw = w / tw, _sh = h / th;
    if (type === 'inSide') _s = Math.min(_sw, _sh);
    else _s = Math.max(_sw, _sh);

    let _w = tw * _s;
    let _h = th * _s;

    let _layoutDate = {
        scale: _s,
        x: (w - _w) / 2,
        y: (h - _h) / 2
    };
    return _layoutDate;
}

/**
 * 数组对象排序
 * @param arr 数组
 * @param key 排序关键值
 * @param bool 升序
 */
function arraySort(arr, key, bool = true) {

    //升序
    function compare1(obj1, obj2) {
        let val1 = obj1[key];
        let val2 = obj2[key];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }

    //降序
    function compare2(obj1, obj2) {
        let val1 = obj1[key];
        let val2 = obj2[key];
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }
    }

    if (bool) {
        arr.sort(compare1);
    } else {
        arr.sort(compare2);
    }

}

export {
    getDefault,
    getLayout,
    arraySort,
};


