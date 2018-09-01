import EventDispatcher from '../../core/EventDispatcher';
import {getDefault} from '../../utils/Mixin';
import {textParsing} from '../utils/TextParsing';


/**
 *  BitmapText处理器
 *  @memberof ds.createjs.managers
 *  @example
 *  //可以使用AN进行资源素材的导出
   let _bitmapTexter = new BitmapTexter(null, {
        textDc: '0123456789步',
        spriteSheet: {
            images: ["images/fontDc.png"],
            frames: [[0, 0, 64, 85, 0, 0, 0], [64, 0, 43, 85, 0, 0, 0], [107, 0, 71, 85, 0, 0, 0], [178, 0, 59, 85, 0, 0, 0], [0, 85, 61, 85, 0, 0, 0], [61, 85, 57, 85, 0, 0, 0], [118, 85, 62, 85, 0, 0, 0], [180, 85, 59, 85, 0, 0, 0], [0, 170, 61, 85, 0, 0, 0], [61, 170, 61, 85, 0, 0, 0], [122, 170, 46, 85, 0, 0, 0]]
        }
    });
    let _bitmapText = _bitmapTexter.createBitmapText();
    GameApp.stage.addChild(_bitmapText);
    _bitmapText.text =  '102步';
 *  TODO textParsing方式目前无法正常使用
 */
class BitmapTexter extends EventDispatcher {
    constructor(skin, opts) {
        super();

        opts = opts || {};

        this._text0 = '0123456789';
        this._text1 = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        this._text2 = 'qwertyuiopasdfghjklzxcvbnm';
        this._text3 = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
        this._text4 = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789';

        //显示对象对应的文本字典
        let _type = getDefault(opts.type, '0-9');

        if (opts.textDc === undefined) {
            _type = opts.type;
            if (_type === '0-9') this._textDc = getDefault(opts.textDc, this._text0);
            else if (_type === 'A-Z') this._textDc = getDefault(opts.textDc, this._text1);
            else if (_type === 'a-z') this._textDc = getDefault(opts.textDc, this._text2);
            else if (_type === 'A-z') this._textDc = getDefault(opts.textDc, this._text3);
            else if (_type === 'all') this._textDc = getDefault(opts.textDc, this._text4);
            else {
                this._textDc = getDefault(opts.textDc, this._text0);
            }
        }
        else {
            this._textDc = opts.textDc;
            _type = 'custom';
        }

        this._type = _type;

        let _spriteSheet = getDefault(opts.spriteSheet, null);

        this._skin = skin;

        if (_spriteSheet) {
            this.setSpriteSheet(_spriteSheet);
        } else {
            this.parsing();
        }


    }

    setSpriteSheet(spriteSheet) {
        console.log('setSpriteSheet');
        let _ss = spriteSheet;
        if (_ss.frames.length === this._textDc.length) {
            _ss.animations = {};
            let _text = this._textDc;
            for (let i = 0; i < _text.length; i++) {
                let _t = _text[i];
                _ss.animations[_t] = [i];
            }
            let _spriteSheet = new createjs.SpriteSheet(_ss);
            this._spriteSheet = _spriteSheet;
            // let _sprite = new createjs.Sprite(_spriteSheet);
            // GameApp.root.addChild(_sprite);
            // _sprite.play();
        }
        else {

            console.error('图片与文本字典不匹配，请检查', this._type, _ss, _ss._frames.length, this._textDc.length);
            let _spriteSheet = new createjs.SpriteSheet(_ss);
            this._spriteSheet = _spriteSheet;
            // let _sprite = new createjs.Sprite(_spriteSheet);
            // return _sprite;
        }
    }

    parsing() {
        let _ss = textParsing(this._skin, 0.09, true);
        if (_ss._frames.length === this._textDc.length) {

            let _data = {
                images: _ss.images,
                frames: [],
                animations: {}
            };

            let _text = this._textDc;
            let _animations = _data.animations;
            let _frames = _data.frames;

            for (let i = 0; i < _text.length; i++) {

                let _t = _text[i];
                let _rect = _ss._frames[i].rect;

                _frames.push([
                    _rect.x, _rect.y, _rect.width, _rect.height
                ]);

                _animations[_t] = {"frames": [i]};

            }

            let _spriteSheet = new createjs.SpriteSheet(_data);
            this._spriteSheet = _spriteSheet;


        }
        else {


            console.error('图片与文本字典不匹配，请检查', this._type, _ss, _ss._frames.length, this._textDc.length);
            let _spriteSheet = new createjs.SpriteSheet(_ss);
            this._spriteSheet = _spriteSheet;
            // let _sprite = new createjs.Sprite(_spriteSheet);
            // return _sprite;
        }
    }

    /**
     * 创建一个BitmapText
     * @param opts
     * @return {*}
     */
    createBitmapText(opts) {
        // console.log(this._spriteSheet);
        let _btext = new createjs.BitmapText('', this._spriteSheet);
        return _btext;
    }


    /**
     * 获取这个精灵图测试对象
     * @return {*}
     */
    getTestSprite() {
        let _spriteText = new createjs.Sprite(this._spriteSheet);
        _spriteText.gotoAndStop(0);
        // SiteModel.createJsModel.root.addChild(_spriteText);
        return _spriteText;
    }

    get spriteSheet() {
        return this._spriteSheet;
    }
}

export default BitmapTexter;