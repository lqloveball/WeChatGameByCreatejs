/**
 * @memberof  ds.utils.Triangle
 * @param angle
 * @return {number}
 */
function sinD(angle) {
    return Math.sin(angle * Math.PI / 180);
};

/**
 * @memberof  ds.utils.Triangle
 * @param angle
 * @return {number} 弧度值
 */
function cosD(angle) {
    return Math.cos(angle * Math.PI / 180);
};

/**
 * @memberof  ds.utils.Triangle
 * @param angle
 * @return {number} 弧度值
 */
function tanD(angle) {
    return Math.tan(angle * Math.PI / 180);
};

/**
 * @memberof  ds.utils.Triangle
 * @param ratio
 * @return {number} 角度值
 */
function asinD(ratio) {
    return Math.asin(ratio) * 180 / Math.PI;
};

/**
 * @memberof  ds.utils.Triangle
 * @param ratio
 * @return {number} 角度值
 */
function acosD(ratio) {
    return Math.acos(ratio) * 180 / Math.PI;
}

/**
 * @memberof  ds.utils.Triangle
 * @param ratio
 * @return {number} 角度值
 */
function atanD(ratio) {
    return Math.atan(ratio) * 180 / Math.PI;
}

/**
 * 算角度
 * @memberof  ds.utils.Triangle
 * @param x
 * @param y
 * @return {number}
 */
function atan2D(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * 角度转换为弧度
 * 弧度= 角度 * Math.PI / 180;
 * @memberof  ds.utils.Triangle
 * @param angle
 * @return {number} 弧度
 */
function angleToDeg(angle) {
    return angle * Math.PI / 180;
}

/**
 * 弧度转换为角度
 *
 * 角度 = 弧度 * 180 / Math.PI;
 * @memberof  ds.utils.Triangle
 * @param deg
 * @return {number}
 */
function degToAngle(deg) {
    return deg * 180 / Math.PI;
}

/**
 * 求两点间距离
 * @memberof  ds.utils.Triangle
 * @param {number} x1 点1x
 * @param {number} y1 点1y
 * @param {number} x2 点2x
 * @param {number} y2 点2y
 * @return {number} 距离值
 */
function distance(...args) {

    let x1, y1, x2, y2;
    // console.log(arguments);
    if (args.length === 2) {
        x1 = args[0].x;
        y1 = args[0].y;
        x2 = args[1].x;
        y2 = args[1].y;
    } else {
        x1 = args[0];
        y1 = args[1];
        x2 = args[2];
        y2 = args[3];
    }

    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 任意数转成360角度
 * @memberof  ds.utils.Triangle
 * @param {number} angle 被转换的角度
 * @return {number} 角度
 */
function fixAngle(angle) {
    angle %= 360;
    return angle < 0 ? angle + 360 : angle;
};

/**
 * 计算2个点之间的夹角
 * @memberof  ds.utils.Triangle
 * @param {*} args 参数
 * 1个参数：参数是点对象   第1参数 cpt 对比点，相对与 opt 圆心点{x:0,y:0}
 * 2个参数：参数是数字     第1参数 x  第2参数y 这是 cpt 对比点的坐标 ，相对与 opt 圆心点{x:0,y:0}的角度
 * 2个参数：参数是点对象   第1参数：cpt 对比点  第2个参数 opt 圆心点（圆心）
 * 4个参数：参数是点对象   第1-2参数：cpt 对比点 x y   第2个参数 opt 圆心点{x:0,y:0} （圆心）
 * @return {number} 角度
 */
function pointToAngle(...args) {

    let cpt, opt;

    if (args.length === 4) {
        cpt = {x: args[0], y: args[1]};
        opt = {x: args[2], y: args[3]};
    }
    else if (args.length === 2) {

        if ((typeof(args[0]) === 'number') && (typeof(args[1]) === 'number')) {
            cpt = {x: args[0], y: args[1]};
            opt = {x: 0, y: 0};
        }
        else {
            cpt = args[0];
            opt = args[1];
        }

    }
    else {
        cpt = args[0];
        opt = {x: 0, y: 0};
    }

    let _r = pointToRadian(cpt, opt);
    let _a = _r * 180 / Math.PI;

    return _a;

}

/**
 * 点转弧度
 * @memberof  ds.utils.Triangle
 * @param {Point} cpt 对比点
 * @param {Point} opt 圆心点
 * @return {number}
 */
function pointToRadian(cpt, opt) {

    opt = opt || {x: 0, y: 0};
    let _k = (cpt.y - opt.y) / (cpt.x - opt.x);
    let _r = Math.atan(_k);
    if (_r <= 0) {
        if (cpt.x >= opt.x) _r = _r + Math.PI * 2;
        else _r = _r + Math.PI;
    }
    else {
        if (cpt.x < opt.x) _r = _r + Math.PI;
    }

    return _r;

}


/**
 * 获取对边长度 (已知邻边与夹角)
 * @memberof  ds.utils.Triangle
 * @param {number} angle 夹角
 * @param {number} side  一个邻边长度b
 * @return {number}  0 出现先在坐标线上了
 */
function getOppositeSide(angle, side) {

    angle = ds.utils.Triangle.fixAngle(angle);

    //出现在线上直接是0
    if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180) return 0;
    //tanA＝a/b  ---> a=b*tanA
    return ds.utils.Triangle.tanD(angle) * side;

};

/**
 * 获取邻边 (已知对边与夹角)
 * @memberof  ds.utils.Triangle
 * @param  {number} angle 夹角
 * @param  {number} side  对边长
 * @return {number}       0 出现先在坐标线上了
 */
function getVicinageSide(angle, side) {

    angle = ds.utils.Triangle.fixAngle(angle);
    if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180) return 0;
    //tanA＝a/b  ---> b=a/tanA
    return side / ds.utils.Triangle.tanD(angle);

};

/**
 * 将极坐标系转化为笛卡尔坐标系
 * @memberof  ds.utils.Triangle
 * @param {object} px
 * @param {object} py
 * @return {object} {x:0,y:0}
 */
function cartesianToPolar(px, py) {

    let rt = {x: 0, y: 0};
    let radius = Math.sqrt(px * px + py * py);//半径
    let theta = ds.utils.Triangle.atan2D(py, px);//角度
    rt.x = radius;
    rt.y = theta;

    return rt;

};

/**
 * 角度，圆心点x,y，X方向轴长，Y方轴长，计算椭圆形 上的点
 * @memberof  ds.utils.Triangle
 * @param angle 角度
 * @param {number} x
 * @param {number} y
 * @param {number} sideA  X方向轴长
 * @param {number} sideB  Y方轴长 为空就是园形
 * @return {object} {x: *, y: *}
 */
function getPoint(angle, x, y, sideA, sideB) {

    angle = fixAngle(angle);
    angle = angle * Math.PI / 180;
    if (sideA == undefined) sideA = 100;
    if (sideB == undefined) sideB = sideA;
    // console.log(angle,sideB);
    let point = {x: Math.cos(angle) * sideA + x, y: Math.sin(angle) * sideB + y};
    return point;

};

/**
 * 360角换象限
 * @memberof  ds.utils.Triangle
 * @param {number} angle  角度
 * @return {number} 1 2 3 4
 */
function angleToQuadrant(angle) {

    angle = fixAngle(angle);
    if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180) return 0;
    else {

        if (angle > 90 && angle <= 180) return 2;
        else if (angle > 180 && angle <= 270) return 3;
        else if (angle > 270 && angle <= 360) return 4;
        else return 1;

    }

}

/**
 * 获取2个点中心点
 * @memberof  ds.utils.Triangle
 * @param pt1
 * @param pt2
 */
function getCenterPt(pt1, pt2) {
    let _x = pt1.x > pt2.x ? pt2.x + (pt1.x - pt2.x) / 2 : pt1.x + (pt2.x - pt1.x) / 2;
    let _y = pt1.y > pt2.y ? pt2.y + (pt1.y - pt2.y) / 2 : pt1.y + (pt2.y - pt1.y) / 2;
    return {x: _x, y: _y};
}

export {
    sinD,
    cosD,
    tanD,
    asinD,
    acosD,
    atanD,
    atan2D,
    angleToDeg,
    degToAngle,
    distance,
    fixAngle,
    pointToAngle,
    pointToRadian,
    getOppositeSide,
    getVicinageSide,
    cartesianToPolar,
    getPoint,
    angleToQuadrant,
    getCenterPt
};

const Triangle = {
    sinD,
    cosD,
    tanD,
    asinD,
    acosD,
    atanD,
    atan2D,
    angleToDeg,
    degToAngle,
    distance,
    fixAngle,
    pointToAngle,
    pointToRadian,
    getOppositeSide,
    getVicinageSide,
    cartesianToPolar,
    getPoint,
    angleToQuadrant,
    getCenterPt
};

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.utils = ds.utils || {};
/**
 * 三角函数相关计算
 *
 * ```js
 * 三角函数相关公式
 *  A
 *  |\
 *  | \
 *  |  \
 * b|   \c
 *  |    \
 *  |     \
 * C|______\B
 *     a
 * 正弦：锐角的对边与斜边的比。sinA＝a/c
 * 余弦：锐角的邻边与斜边的比。cosA＝b/c
 * 正切：锐角的对边与邻边的比。tanA＝a/b
 * 余切：锐角的邻边与对边的比。cotA＝b/a
 * 勾股定理：直角三角形中，两直角边的平方和等于斜边的平方。a^2＋b^2＝c^2
 * cosA=（b²+c²-a²）/2bc
 * cosB=(a²+c²-b²)/2ac
 * cosC=(a²+b²-c²)/2ab
 *
 * 弧度= 角度 * Math.PI / 180;
 * 角度 = 弧度 * 180 / Math.PI;
 * ```
 *
 * @memberof ds.utils
 * @class
 */
ds.utils.Triangle = Triangle;


