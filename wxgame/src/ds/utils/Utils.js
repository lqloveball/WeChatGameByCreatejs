
/**
 * 判断邮箱
 * @memberof  ds.utils.Utils
 * @param  {string} value [判断字符串]
 * @return {boolean}       [判断结果]
 */
function isEmail(value) {

    let pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return pattern.test(value);

};

/**
 * 是否是一个空字符串
 * @memberof  ds.utils.Utils
 * @param  {string} value [判断字符串]
 * @return {boolean}     [判断结果]
 */
function isEmptyString(value) {

    if (value === "") return true;
    let regu = "^[ ]+$";
    let re = new RegExp(regu);
    return re.test(value);

};

/**
 * 判断是否手机号码
 * @memberof  ds.utils.Utils
 * @param  {string} value [判断字符串]
 * @return {boolean}     [判断结果]
 */
function isPhone(value) {

    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(value)) {
        return false;
    } else {
        return true;
    }

};

/**
 * 判断是否电话号码
 * @memberof  ds.utils.Utils
 * @param {string} value [判断字符串]
 * @return {boolean}
 */
function isTel(tel) {
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!myreg.test(tel)) {
        return false;
    } else {
        return true;
    }
};

/**
 * 验证是否用户身份证号
 * @memberof  ds.utils.Utils
 * @param  {string} card [判断字符串]
 * @return {boolean}     [判断结果]
 */
function IsUserCard(card) {

    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) return false;
    return true;

};

/**
 * 完整验证身份证的方式
 * @memberof  ds.utils.Utils
 * @param  {string} code [判断字符串]
 * @return {boolean|string}     [判断结果]
 */
function isUserCardAll(code) {

    let city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    let tip = "";
    let pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {

        tip = "身份证号格式错误";
        pass = false;

    }

    else if (!city[code.substr(0, 2)]) {

        tip = "地址编码错误";
        pass = false;

    }
    else {

        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {

            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];

            if (parity[sum % 11] != code[17]) {

                tip = "校验位错误";
                pass = false;

            }

        }

    }

    if (!pass) return tip;

    return pass;

}

/**
 * 时间格式化
 * @param date
 * @param fmt
 * @return {*}
 * @constructor
 */
function dateFormat(date,fmt) {
    let o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}


export {
    isEmail,
    isEmptyString,
    isPhone,
    isTel,
    IsUserCard,
    isUserCardAll,
    dateFormat,
};

