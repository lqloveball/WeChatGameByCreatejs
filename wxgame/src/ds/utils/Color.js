/**
 * rgb字符颜色转换rgb数组
 * @memberof ds.utils.Color
 * rgb(255,0,100)--> [255,0,100]
 * @param {String} rgb
 * @return {Array} [r,g,b]
 */
function sRgb2Rgb(rgb) {
    let _rgbs = rgb.slice(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(',');
    let _arr = [];
    for (let i = 0; i < _rgbs.length; i++) {
        let _tp = Number(_rgbs[i]);
        _arr.push(_tp);
    }
    return _arr;
}

/**
 * rgb字符颜色转换hex字符颜色
 * @memberof ds.utils.Color
 * rgb(24, 245, 56) --> #18f538
 * @param {string} rgb
 * @return {string}
 */
function sRgb2Hex(rgb) {
    let _color = rgb;
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(_color)) {
        let aColor = _color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _color;
        }
        return strHex;
    } else if (reg.test(_color)) {
        let aNum = _color.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return _color;
        } else if (aNum.length === 3) {
            let numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return _color;
}

/**
 * hex字符颜色 转换 rgb字符颜色
 * @memberof ds.utils.Color
 * #18f538 --> rgb(24, 245, 56)
 * @param {string} hex
 * @return {string}
 */
function sHex2Srgb(hex) {
    let _colors = sHex2Rgb(hex);
    return "rgb(" + _colors.join(",") + ")";
}

/**
 * hex字符颜色 转换 [r,g,b]
 * #18f538 --> [24, 245, 56]
 * @memberof ds.utils.Color
 * @param {string} hex
 * @return {Array} [r,g,b]
 */
function sHex2Rgb(hex) {
    let _color = hex.toLowerCase();
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let _colors = [];
    // 如果是16进制颜色
    if (_color && reg.test(_color)) {
        if (_color.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += _color.slice(i, i + 1).concat(_color.slice(i, i + 1));
            }
            _color = sColorNew;
        }
        //处理六位的颜色值
        for (let i = 1; i < 7; i += 2) {
            _colors.push(parseInt("0x" + _color.slice(i, i + 2)));
        }
        return _colors;
    }
}

/**
 * hex字符颜色 转换 颜色。0x00ff00
 * @memberof ds.utils.Color
 * @param hex
 * @return {number}
 */
function sHex2Color(hex) {
    let _arr = sHex2Rgb(hex);
    let _color = (_arr[0] << 16) | (_arr[1] << 8) | _arr[2];
    return _color;
}

/**
 * 字符串rgb 转 色彩数字
 * rgb(255,255,0)-->  16776960 =0xffff00;
 * @memberof ds.utils.Color
 * @param rgb
 * @return {Number}
 */
function sRgb2Color(rgb) {
    let _rgbs = rgb.slice(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(',');
    let _arr = [];
    for (let i = 0; i < _rgbs.length; i++) {
        let _tp = Number(_rgbs[i]);
        _arr.push(_tp);
    }
    let _color = (_arr[0] << 16) | (_arr[1] << 8) | _arr[2];
    return _color;
}


/**
 * 颜色亮度调节
 * @memberof ds.utils.Color
 * @param hex  #000000
 * @param brite -1 到 1
 * @return {string}
 */
function sHexBrightness(hex, brite) {

    let _hex = '#';
    let _colors = sHex2Rgb(hex);
    let r = Number(_colors[0]);
    let g = Number(_colors[1]);
    let b = Number(_colors[2]);

    r = (Math.max(Math.min((r & 0xFF) + 255 * brite, 255), 0) >> 0).toString(16);
    g = (Math.max(Math.min((g & 0xFF) + 255 * brite, 255), 0) >> 0).toString(16);
    b = (Math.max(Math.min((b & 0xFF) + 255 * brite, 255), 0) >> 0).toString(16);

    _hex = _hex + (r === '0' ? '00' : r) + (g === '0' ? '00' : g) + (b === '0' ? '00' : b);

    return _hex;

}

/**
 * rgb 转 颜色值
 * @memberof ds.utils.Color
 * @param r
 * @param g
 * @param b
 * @return {number}
 */
function rgb2Color(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

/**
 * 颜色转 rgb 组
 * @memberof ds.utils.Color
 * @param color
 * @return {Array} [null,null,null]
 */
function color2Rgb(color) {
    return [((color >> 16) & 0xFF), ((color >> 8) & 0xFF), ((color) & 0xFF)];
}

/**
 * HSL颜色值转换为RGB.
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 * @memberof ds.utils.Color
 * @param   {number}  h       色相
 * @param   {number}  s       饱和度
 * @param   {number}  l       亮度
 * @return  Array           RGB色值数值
 */
function hsl2Rgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 * @memberof ds.utils.Color
 * @param   {number}  r       红色色值
 * @param   {number}  g       绿色色值
 * @param   {number}  b       蓝色色值
 * @return  {Array}           HSL各值数组
 */
function rgb2Hsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * HSB颜色 转 rgb色
 * HSB色彩模式,把颜色分为色相、饱和度、明度三个因素。
 * @memberof ds.utils.Color
 * h 在 0-360
 * s 在 0-100
 * b 在 0-100
 * http://baike.baidu.com/view/587127.htm
 * @param   {number}  h        0-360
 * @param   {number}  s       0-100
 * @param   {number}  b       0-100
 * @return  {Array}           HSB各值数组
 */
function hsb2Rgb(h, s, b) {
    let _r = 0, _g = 0, _b = 0;
    let hsb = {
        h: h,
        s: s,
        b: b
    };
    hsb.s *= 2.55;
    hsb.b *= 2.55;
    if (!hsb.h && !hsb.s) {
        _r = _g = _b = hsb.b;
    }
    else {
        let diff = (hsb.b * hsb.s) / 255;
        let low = hsb.b - diff;
        if (hsb.h > 300 || hsb.h <= 60) {
            _r = hsb.b;
            if (hsb.h > 300) {
                _g = Math.round(low);
                hsb.h = (hsb.h - 360) / 60;
                _b = -Math.round(hsb.h * diff - low);
            } else {
                _b = Math.round(low);
                hsb.h = hsb.h / 60;
                _g = Math.round(hsb.h * diff + low);
            }
        } else if (hsb.h > 60 && hsb.h < 180) {
            _g = hsb.b;
            if (hsb.h < 120) {
                _b = Math.round(low);
                hsb.h = (hsb.h / 60 - 2) * diff;
                _r = Math.round(low - hsb.h);
            } else {
                _r = Math.round(low);
                hsb.h = (hsb.h / 60 - 2) * diff;
                _b = Math.round(low + hsb.h);
            }
        } else {
            _b = hsb.b;
            if (hsb.h < 240) {
                _r = Math.round(low);
                hsb.h = (hsb.h / 60 - 4) * diff;
                _g = Math.round(low - hsb.h);
            } else {
                _g = Math.round(low);
                hsb.h = (hsb.h / 60 - 4) * diff;
                _r = Math.round(low + hsb.h);
            }
        }
    }
    return [_r, _g, _b];
}

/**
 * rgb转hsb
 * @memberof ds.utils.Color
 * @param r
 * @param g
 * @param b
 * @return {Array}
 */
function rgb2hsb(r, g, b) {
    let hsb = {};
    let low = Math.min(r, Math.min(g, b));
    let high = Math.max(r, Math.max(g, b));
    hsb.b = high * 100 / 255;
    let diff = high - low;
    if (diff) {
        hsb.s = Math.round(100 * (diff / high));
        if (r === high) {
            hsb.h = Math.round(((g - b) / diff) * 60);
        } else if (g === high) {
            hsb.h = Math.round((2 + (b - r) / diff) * 60);
        } else {
            hsb.h = Math.round((4 + (r - g) / diff) * 60);
        }
        if (hsb.h > 360) {
            hsb.h -= 360;
        } else if (hsb.h < 0) {
            hsb.h += 360;
        }
    } else {
        hsb.h = hsb.s = 0;
    }
    return [hsb.h, hsb.s, hsb.b];
}


/**
 * 两种颜色相乘
 * @memberof ds.utils.Color
 * @param color1
 * @param color2
 * @return {number}
 */
function multiplyColor(color1, color2) {
    let r1 = (color1 >> 16) & 0xFF;
    let g1 = (color1 >> 8) & 0xFF;
    let b1 = color1 & 0xFF;

    let r2 = (color2 >> 16) & 0xFF;
    let g2 = (color2 >> 8) & 0xFF;
    let b2 = color2 & 0xFF;

    return ((r1 * r2 / 255) << 16) |
        ((g1 * g2 / 255) << 8) |
        (b1 * b2 / 255);
}

/**
 * 随机颜色
 * @memberof ds.utils.Color
 * @return {Number} 颜色
 */
function randomColor() {
    return (Math.random() * 0xffffff) >> 0;
}

/**
 * 随机hex颜色
 * @memberof ds.utils.Color
 *  @return {string} Hex颜色
 */
function randomHex() {
    let _color = (Math.random() * 0xffffff) >> 0;
    let r = ((color >> 16) & 0xFF).toString(16);
    let g = ((color >> 8) & 0xFF).toString(16);
    let b = ((color) & 0xFF).toString(16);
    let _hex = '#';
    _hex = _hex + (r === '0' ? '00' : r) + (g === '0' ? '00' : g) + (b === '0' ? '00' : b);
    return _hex;
}

/**
 * 颜色处理
 * @namespace  ds.utils.Color
 */

export {
    sHexBrightness,
    multiplyColor,
    randomColor,
    randomHex,
    rgb2Color,
    color2Rgb,
    hsl2Rgb,
    rgb2Hsl,
    hsb2Rgb,
    rgb2hsb,
    sRgb2Color,
    sRgb2Rgb,
    sRgb2Hex,
    sHex2Srgb,
    sHex2Rgb,
    sHex2Color,
};