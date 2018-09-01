import {getMCChildrens, getBoundsTempModel} from 'ds/createjs/utils/Utils';

/**
 * 解析一个显示对象拆分成文字
 * @memberof ds.createjs.utils.TextParsing
 * @param container  显示对象
 * @param tAlpha=0.09  拆分时候使用透明度计算参考值
 * @param getSpriteSheet=false  只获取SpriteSheet
 * @return {Object} 返回一个解析的对象{wordMap: Array, textList: Array}
 * wordMap 按行切分的字符列表
 * textList 所有字符列表
 */
function textParsing(container, tAlpha = 0.09, getSpriteSheet = false) {


    // let _view=new createjs.Container();

    let _tempModel = getBoundsTempModel();
    let _tempBox = _tempModel.box;
    let _stage = _tempModel.stage;

    let _box = container;
    let _oparent = _box.parent;

    _tempBox.addChild(_box);
    _stage.update();

    let _rect = _box.getBounds();

    //缓存显示对象
    _box.cache(_rect.x, _rect.y, _rect.width + 15, _rect.height + 15);
    let _cacheCanvas = _box.cacheCanvas;
    _stage.update();

    let _width = _cacheCanvas.width;
    let _height = _cacheCanvas.height;


    let _canvas = document.createElement("canvas");
    _canvas.width = _width;
    _canvas.height = _height;
    let _context = _canvas.getContext('2d');
    _context.drawImage(_cacheCanvas, 0, 0);

    // 获取到图片上每个点的像素值
    let _data = _context.getImageData(0, 0, _width, _height).data;
    console.log( _width, _height,_data.length);

    //获取到图片上每个点的像素值的alpha值
    let _alphaArr = [];
    for (let i = 3; i < _data.length; i += 4) {
        _alphaArr.push(_data[i]);

    }

    // 透明度不为0的行数
    let _notAlpha0rows = [];
    // 遍历每一列
    for (let i = 0; i < _height; i++) {
        //遍历每一行  只要每一行中像素的alpha>40 那么就认为这一行是不透明的
        for (let k = 0; k < _width; k++) {
            if (_alphaArr[k + _width * i] > 20) {
                _notAlpha0rows.push(i);
                break;
            }
        }
    }
    // console.log(_notAlpha0rows);

    // 每一行文字的其实位置
    let _lineStart = [];
    // 每一行文字的结束位置
    let _lineEnd = [];
    // 两者相减 得到每一行文字的高度；
    let _lineHeight = [];
    // 通过遍历像素 找到起始位置和结束位置
    for (let i = 0; i < _notAlpha0rows.length; i++) {
        if ((i < _notAlpha0rows.length - 1) && (_notAlpha0rows[i + 1] - _notAlpha0rows[i] !== 1)) {
            _lineStart.push(_notAlpha0rows[i + 1]);
            _lineEnd.push(_notAlpha0rows[i]);
        }
    }
    _lineStart.unshift(_notAlpha0rows[0]);
    _lineEnd.push(_notAlpha0rows[_notAlpha0rows.length - 1]);

    // 计算行高
    for (let i = 0; i < _lineEnd.length; i++) {
        _lineHeight.push(_lineEnd[i] - _lineStart[i]);
    }
    // 几排文字
    let _rows = _lineHeight.length;
    //------------------- 以上部分 将每行文字的位置 行高 行数 等遍历出来------------
    // 透明度不为0的列  一个二维数组：多少组和每组里alpha不为0的列
    let _notAlpha0Lines = [];
    for (let i = 0; i < _lineHeight.length; i++) {
        let tempArr = [];
        _notAlpha0Lines.push(tempArr);

        for (let k = 0; k < _width; k++) {

            for (let j = 0; j < _lineHeight[i]; j++) {

                if (_alphaArr[_lineStart[i] * _width + k + _width * j] > tAlpha) {
                    _notAlpha0Lines[i].push(k);
                    break;
                }

            }

        }

    }
    // 得到alpha 不为0的列
    // console.log(_notAlpha0Lines);

    // 计算每一列里每个被切分出来的文字（并不是最终的文字）的起始位置 结束位置 以及宽度
    // 每个文字的起始位置  二维数组
    let _wordStartLineArr = [];
    // 每个文字的结束位置  二维数组
    let _wordEndLineArr = [];
    // 两者相减得到宽度    二维数组
    let _wordWidthArr = [];

    for (let i = 0; i < _lineHeight.length; i++) {
        let tempStartLine = [];
        let tempEndLine = [];
        _wordStartLineArr.push(tempStartLine);
        _wordEndLineArr.push(tempEndLine);
        for (let k = 0; k < _notAlpha0Lines[i].length; k++) {
            if ((k < _notAlpha0Lines[i].length - 1) && (_notAlpha0Lines[i][k + 1] - _notAlpha0Lines[i][k] !== 1)) {
                _wordStartLineArr[i].push(_notAlpha0Lines[i][k + 1]);
                _wordEndLineArr[i].push(_notAlpha0Lines[i][k]);
            }
        }
        _wordStartLineArr[i].unshift(_notAlpha0Lines[i][0]);
        _wordEndLineArr[i].push(_notAlpha0Lines[i][_notAlpha0Lines[i].length - 1]);
    }
    // 得到了每一行中 每个被切割出来的文字的起始位置
    // console.log(_wordStartLineArr);
    // 得到了每一行中 每个被切割出来的文字的结束位置
    // console.log(_wordEndLineArr);

    // 计算取得所有的宽度
    for (let i = 0; i < _lineHeight.length; i++) {
        let tempArr = [];
        _wordWidthArr.push(tempArr);
        for (let k = 0; k < _wordEndLineArr[i].length; k++) {
            _wordWidthArr[i].push(_wordEndLineArr[i][k] - _wordStartLineArr[i][k]);
        }
    }
    // 得到了每一行中 每个被切割出来的文字的宽度
    // console.log(_wordWidthArr);

    // 误差范围的设置   根据每行中的文字的宽度作为参考的文字的宽度
    // 设置每行中最小的宽度
    let _minWidthArr = [];
    // 设置每行中最大的宽度
    let _maxWidthArr = [];
    for (let i = 0; i < _lineHeight.length; i++) {
        // 取所有字体宽度的最大值作为参考
        let _wordWidth = parseInt(Math.max.apply(null, _wordWidthArr[i]));
        // 误差范围
        let _minWidth = parseInt(_wordWidth * 0.8);
        let _maxWidth = parseInt(_wordWidth * 1.25);

        _minWidthArr.push(_minWidth);
        _maxWidthArr.push(_maxWidth);

    }

    console.log('minWidth' + _minWidthArr);
    console.log('maxWidth' + _maxWidthArr);

    // ----------------------------------------------------
    // 对每行中被切割出来的文字进行计算和合并  得出最终的文字的位置和宽度
    // 最终的文字的起始位置  二维数组
    let _cutXLine = [];
    // 最终的文字的结束位置  二维数组
    let _cutWLine = [];
    // 合并之后文字的个数
    let _num = 0;

    for (let i = 0; i < _lineHeight.length; i++) {
        let tempStart = [];
        let tempEnd = [];
        _cutXLine.push(tempStart);
        _cutWLine.push(tempEnd);
        _num = 0;
        for (let k = 0; k < _wordStartLineArr[i].length; k++) {

            if ((_wordEndLineArr[i][k] - _wordStartLineArr[i][_num]) > _minWidthArr[i]) {

                if ((_wordEndLineArr[i][k] - _wordStartLineArr[i][_num]) > _maxWidthArr[i]) {

                    _cutXLine[i].push(_wordStartLineArr[i][_num]);
                    _cutWLine[i].push(_wordEndLineArr[i][_num]);
                    k = _num + 1;
                    _num = k;
                } else {
                    _cutXLine[i].push(_wordStartLineArr[i][_num]);
                    _cutWLine[i].push(_wordEndLineArr[i][k]);
                    _num = k + 1;
                }
            } else {
                _cutXLine[i].push(_wordStartLineArr[i][_num]);
                _cutWLine[i].push(_wordEndLineArr[i][k]);
                _num = k + 1;
            }

        }
        // _finalStartLine[i].push(_wordStartLineArr[i][_wordStartLineArr[i].length - 1]);
        // _finalEndLine[i].push(_wordEndLineArr[i][_wordStartLineArr[i].length - 1]);
    }


    // console.log('_cutXLine:',_cutXLine);
    // console.log(_cutWLine);

    //--------------切割线已经完成----------

    let _ssData = {
        images: [_canvas],
        frames: []
    };
    let _frames = _ssData.frames;


    //开始创建单个字显示对象
    let index = 0;
    // let domNum = 0;
    for (let i = 0; i < _lineHeight.length; i++) {
        if (i < 1) {
            index = 0;
        } else {
            index += _cutWLine[i - 1].length;
        }
        // domNum += _finalEndLine[i].length;
        for (let k = 0; k < _cutWLine[i].length; k++) {
            let _num = index + k;
            // console.log(_lineHeight[i]);
            let _data = [
                _cutXLine[i][k],
                _lineStart[i],
                _cutWLine[i][k] - _cutXLine[i][k] + 1,
                parseInt(_lineHeight[i]) + 1
            ];
            _frames[_num] = _data;
            // console.log('num:',_num,_data);
        }
    }

    // console.log('_frames',_frames.length);

    //根据行来切分
    let _wordMap = [];
    let _index = 0;
    //当前行
    let _lineC = 0;
    //临时缓存行
    let _tempLineArr = [];
    //切换下一行
    let _currentLineLenght = _cutXLine[_lineC].length;

    let _spriteSheet = new createjs.SpriteSheet(_ssData);

    if (getSpriteSheet) return _spriteSheet;

    let _textList = [];
    for (let i = 0; i < _frames.length; i++) {
        let _temp = _frames[i];
        let _sprite = new createjs.Sprite(_spriteSheet);
        _sprite.gotoAndStop(i);
        let _srect = new createjs.Rectangle(_temp[0], _temp[1], _temp[2], _temp[3] + 2);
        _sprite._rect = _srect;
        _sprite.x = _temp[0];
        _sprite.y = _temp[1];
        // console.log(_rect);
        // _view.addChild(_sprite);
        _textList.push(_sprite);

        //获取当前行
        if (!_wordMap[_lineC]) _wordMap[_lineC] = [];
        _tempLineArr = _wordMap[_lineC];
        _tempLineArr.push(_sprite);
        _index++;
        if (_index >= _currentLineLenght) {
            _lineC++;
            if (_cutXLine[_lineC]) {
                _currentLineLenght = _index + _cutXLine[_lineC].length;
            }
        }

    }

    //释放缓存
    _box.uncache();

    //判断原来父亲是否是影片剪辑，如果不是就必须自己添加回原来位置
    if (_oparent && _oparent instanceof createjs.MovieClip) {

    } else {
        _oparent.addChild(_box);
    }

    return {
        wordMap: _wordMap,
        textList: _textList,
        // view:_view,
    };

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.utils = ds.createjs.utils || {};

/**
 * createjs 解析字体文本
 * @namespace ds.createjs.utils.TextParsing
 *
 */

ds.createjs.utils.TextParsing = {textParsing: textParsing};

export {
    textParsing
};
