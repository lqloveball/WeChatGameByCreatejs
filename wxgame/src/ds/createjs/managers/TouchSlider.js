import {getDefault} from 'ds/utils/Mixin';

/**
 * 平滑滚动
 * 参考AlloyTouch
 * https://github.com/AlloyTeam/AlloyTouch
 */
class TouchSlider {

    /**
     *
     * @param target 滑动对象
     * @param opts  配置参数
     * @param opts.touch = target.parent
     * @param opts.vertical=true
     * @param opts.property='y'
     * @param opts.initValue=null
     * @param opts.sensitivity=1 灵敏度
     * @param opts.moveFactor=1 运动属性映射关系
     * @param opts.factor=1 触摸位移运动位移与被运动属性映射关系
     * @param opts.outFactor=1 超出部分映射因子
     * @param opts.min=undefined  最小值 空是无限
     * @param opts.max=undefined  最大值 空是无限
     * @param opts.deceleration=0.0006  减速度因子，衰竭值
     * @param opts.maxRegion=600
     * @param opts.springMaxRegion=60
     * @param opts.maxSpeed=undefined
     * @param opts.lockDirection=true
     * @param opts.step  划分区块值
     * @param opts.inertia=true 惯性动画
     * @param opts.isOutside=true 是否允许超出最大与最小编辑
     * @param opts.lock=false 锁定
     * @param {function} opts.change 位置改变
     * @param {function} opts.touchEnd touch完成
     * @param {function} opts.touchStart touch开始
     * @param {function} opts.touchMove touch开始移动
     * @param {function} opts.touchCancel touch变化
     * @param {function} opts.reboundEnd 回弹完成
     * @param {function} opts.animationEnd 动画完成完成
     * @param {function} opts.correctionEnd 修正完成
     * @param {function} opts.tap tap事件
     * @param {function} opts.pressMove pressMove事件
     */
    constructor(target, opts) {

        opts = opts || {};


        //需要运动的目标
        this.target = target;
        //响应touch对象目标，一般是父级元素
        this.touch = getDefault(opts.touch, target.parent);

        if (!this.touch) {
            throw "TouchSlider no has touch Element";
        }

        //是否纵向
        this.vertical = getDefault(opts.vertical, true);

        //变化取值
        this.property = getDefault(opts.property, 'y');
        //初始化参数值
        this.initValue = getDefault(opts.initValue, this.target[this.property]);
        this.target[this.property] = this.initValue;


        //灵敏度
        this.sensitivity = getDefault(opts.sensitivity, 1);
        //运动属性映射关系
        this.moveFactor = getDefault(opts.moveFactor, 1);
        //触摸位移运动位移与被运动属性映射关系
        this.factor = getDefault(opts.factor, 1);
        //退出因子
        this.outFactor = getDefault(opts.outFactor, 0.3);

        //最小值
        this.min = opts.min;
        //最大值
        this.max = opts.max;

        //减速因子
        this.deceleration = getDefault(opts.deceleration, 0.0006);

        //最大超出区域
        this.maxRegion = getDefault(opts.maxRegion, 600);

        this.springMaxRegion = getDefault(opts.springMaxRegion, 60);

        this.maxSpeed = opts.maxSpeed;
        this.hasMaxSpeed = !(this.maxSpeed === void 0);

        this.lockDirection = getDefault(opts.lockDirection, true);

        this.hasMin = !(this.min === void 0);
        this.hasMax = !(this.max === void 0);
        if (this.hasMin && this.hasMax && this.min > this.max) {
            throw "TouchSlider the min value can't be greater than the max value.";
        }

        //是否点击开始
        this.isTouchStart = false;

        this.step = opts.step;

        //是否拥有惯性
        this.inertia = getDefault(opts.inertia, true);

        //是否可超出边界
        this.isOutside = getDefault(opts.isOutside, true);


        this.touch.on('mousedown', (e) => {
            this._mousedown(e);
        });

        this.touch.on('pressmove', (e) => {
            this._pressmove(e);
        });

        this.touch.on('pressup', (e) => {
            this._pressup(e);
        });

        this.x1 = this.x2 = this.y1 = this.y2 = null;

        this._lock = getDefault(opts.lock, false);


        let noop = function () {
        };
        this.change = opts.change || noop;
        this.touchEnd = opts.touchEnd || noop;
        this.touchStart = opts.touchStart || noop;
        this.touchMove = opts.touchMove || noop;
        this.touchCancel = opts.touchCancel || noop;
        this.reboundEnd = opts.reboundEnd || noop;
        this.animationEnd = opts.animationEnd || noop;
        this.correctionEnd = opts.correctionEnd || noop;
        this.tap = opts.tap || noop;
        this.pressMove = opts.pressMove || noop;
    }

    /**
     * 运动到距离
     * @param {number} value
     * @param {number} time=0.6
     * @param {function} cb 执行完成回调
     */
    to(value, time = 0.6, cb) {

        this._to(value, time * 1000, ease, this.change, function (value) {
            this._calculateIndex();
            this.reboundEnd.call(this, value);
            this.animationEnd.call(this, value);
            if (cb) cb();
        }.bind(this));

    }

    _cancel(e) {
        var current = this.target[this.property];
        this.touchCancel.call(this, e, current);
        this._end(e);
    }

    _mousedown(e) {

        let _target = this.target;
        let _touch = this.touch;
        let _stage = _touch.stage;

        if (!_stage) return;
        if (this.lock) return;
        // if (this.isTouchStart) return;

        this.isTouchStart = true;

        this.touchStart.call(this, e, this.target[this.property]);

        this.startTime = new Date().getTime();

        let _spt = _touch.globalToLocal(_stage.mouseX, _stage.mouseY);

        this.x1 = this.preX = _spt.x;
        this.y1 = this.preY = _spt.y;

        // JT.kill(_target);
        this.start = this.vertical ? this.preY : this.preX;

        this._firstTouchMove = true;

        this._preventMove = false;

    }

    _pressmove(e) {


        let _target = this.target;
        let _touch = this.touch;
        let _stage = _touch.stage;

        if (this.lock) return;
        if (!_stage) return;
        if (!this.isTouchStart) return;

        let _spt = _touch.globalToLocal(_stage.mouseX, _stage.mouseY);
        let len = 1;
        if (e.nativeEvent.touches) len = e.nativeEvent.touches.length;
        let currentX = _spt.x,
            currentY = _spt.y;

        if (this._firstTouchMove && this.lockDirection) {
            let dDis = Math.abs(currentX - this.x1) - Math.abs(currentY - this.y1);

            if (dDis > 0 && this.vertical) {
                this._preventMove = true;
            }
            else if (dDis < 0 && !this.vertical) {
                this._preventMove = true;
            }
            this._firstTouchMove = false;
        }

        if (!this._preventMove) {

            let d = (this.vertical ? currentY - this.preY : currentX - this.preX) * this.sensitivity;

            let f = this.moveFactor;
            if (this.hasMax && this.target[this.property] > this.max && d > 0) {
                f = this.outFactor;
            } else if (this.hasMin && this.target[this.property] < this.min && d < 0) {
                f = this.outFactor;
            }
            d *= f;

            this.preX = currentX;
            this.preY = currentY;

            if (!this._lock) {

                let _num = this.target[this.property] + d;
                if (!this.isOutside) _num = Math.min(this.max, Math.max(_num, this.min));
                this.target[this.property] = _num;
            }

            this.change.call(this, this.target[this.property]);

            let timestamp = new Date().getTime();
            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.start = this.vertical ? this.preY : this.preX;
            }

            this.touchMove.call(this, e, this.target[this.property]);
        }

        // if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {
        //     evt.preventDefault();
        // }

        if (len === 1) {

            if (this.x2 !== null) {
                e.deltaX = currentX - this.x2;
                e.deltaY = currentY - this.y2;

            } else {
                e.deltaX = 0;
                e.deltaY = 0;
            }

            this.pressMove.call(this, e, this.target[this.property]);

        }

        this.x2 = currentX;
        this.y2 = currentY;
    }

    _pressup(e) {

        let current = this.target[this.property];
        this.touchCancel.call(this, e, current);
        this._end(e);
    }

    _end(e) {

        let _target = this.target;
        let _touch = this.touch;
        let _stage = _touch.stage;
        let _self = this;

        if (!this.isTouchStart) return;
        this.isTouchStart = false;

        if (!_stage) return;
        if (this.lock) return;

        let _spt = _touch.globalToLocal(_stage.mouseX, _stage.mouseY);

        let current = this.target[this.property],
            triggerTap = (Math.abs(_spt.x - this.x1) < 30 && Math.abs(_spt.y - this.y1) < 30);

        if (triggerTap) this.tap.call(this, e, current);

        if (this.touchEnd.call(this, e, current, this.currentPage) === false) return;

        // JT.kill(_target);

        if (this.hasMax && current > this.max) {

            this._to(this.max, 200, ease, this.change, function (value) {
                this.reboundEnd.call(this, value);
                this.animationEnd.call(this, value);
            }.bind(this));

            // console.log('最大');
            // let _ms = {ease: ease};
            // _ms[this.property] = this.max;
            // _ms.onEnd = () => {
            //     this.reboundEnd.call(this, _ms[this.property]);
            //     this.animationEnd.call(this, _ms[this.property]);
            // };
            // JT.to(_target, 0.2, _ms);

        }
        else if (this.hasMin && current < this.min) {

            this._to(this.min, 200, ease, this.change, function (value) {
                this.reboundEnd.call(this, value);
                this.animationEnd.call(this, value);
            }.bind(this));


            // let _ms = {ease: ease};
            // _ms[this.property] = this.min;
            // _ms.onEnd = () => {
            //     this.reboundEnd.call(this, _ms[this.property]);
            //     this.animationEnd.call(this, _ms[this.property]);
            // };
            // JT.to(_target, 0.2, _ms);

        }
        else if (this.inertia && !triggerTap && !this._preventMove) {


            let dt = new Date().getTime() - this.startTime;

            if (dt < 300) {
                // console.log('惯性');

                let distance = ((this.vertical ? _spt.y : _spt.x) - this.start) * this.sensitivity,
                    speed = Math.abs(distance) / dt,
                    speed2 = this.factor * speed;

                if (this.hasMaxSpeed && speed2 > this.maxSpeed) speed2 = this.maxSpeed;

                let destination = current + (speed2 * speed2) / (2 * this.deceleration) * (distance < 0 ? -1 : 1);

                let tRatio = 1;

                if (destination < this.min) {

                    if (destination < this.min - this.maxRegion) {

                        tRatio = reverseEase((current - this.min + this.springMaxRegion) / (current - destination));
                        destination = this.min - this.springMaxRegion;

                    } else {

                        tRatio = reverseEase((current - this.min + this.springMaxRegion * (this.min - destination) / this.maxRegion) / (current - destination));
                        destination = this.min - this.springMaxRegion * (this.min - destination) / this.maxRegion;

                    }

                } else if (destination > this.max) {

                    if (destination > this.max + this.maxRegion) {
                        tRatio = reverseEase((this.max + this.springMaxRegion - current) / (destination - current));
                        destination = this.max + this.springMaxRegion;
                    } else {
                        tRatio = reverseEase((this.max + this.springMaxRegion * (destination - this.max) / this.maxRegion - current) / (destination - current));
                        destination = this.max + this.springMaxRegion * (destination - this.max) / this.maxRegion;

                    }

                }

                let duration = Math.round(speed / _self.deceleration) * tRatio;


                let _num = Math.round(destination);
                if (!this.isOutside) _num = Math.min(this.max, Math.max(_num, this.min));

                _self._to(_num, duration, ease, _self.change, function (value) {
                    if (_self.hasMax && _self.target[_self.property] > _self.max) {

                        cancelAnimationFrame(_self.tickID);
                        _self._to(_self.max, 600, ease, _self.change, _self.animationEnd);

                    } else if (_self.hasMin && _self.target[_self.property] < _self.min) {

                        cancelAnimationFrame(_self.tickID);
                        _self._to(_self.min, 600, ease, _self.change, _self.animationEnd);

                    } else {
                        if (_self.step) {
                            _self._correction();
                        } else {
                            _self.animationEnd.call(_self, value);
                        }
                    }

                    _self.change.call(_self, value);
                });

                // let _ms = {ease: ease};
                // _ms[this.property] = _num;
                // _ms.onEnd = () => {
                //
                //     if (_self.hasMax && _self.target[_self.property] > _self.max) {
                //         let _ms = {ease: ease};
                //         _ms[this.property] = this.max;
                //         _ms.onEnd = () => {
                //             _self.animationEnd.call(_self, _ms[this.property]);
                //         };
                //         JT.to(_target, 0.6, _ms);
                //     }
                //     else if (_self.hasMin && _self.target[_self.property] < _self.min) {
                //
                //         let _ms = {ease: ease};
                //         _ms[this.property] = this.min;
                //         _ms.onEnd = () => {
                //             _self.animationEnd.call(_self, _ms[this.property]);
                //         };
                //         JT.to(_target, 0.6, _ms);
                //     } else {
                //         if (_self.step) {
                //             _self._correction();
                //         } else {
                //             _self.animationEnd.call(_self, _ms[this.property]);
                //         }
                //     }
                //
                //     _self.change.call(_self, _ms[this.property]);
                // };
                //
                // JT.to(_target, (duration / 1000), _ms);


            }
            else {
                _self._correction();
            }
        }
        else {
            _self._correction();
        }

        this.x1 = this.x2 = this.y1 = this.y2 = null;

    }

    /**
     * 锁定
     * @param v
     */
    set lock(v) {

        if (this._lock === v) return;
        this._lock = v;
        JT.kill(this.target);
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.start = null;
        this.isTouchStart = false;
    }

    get lock() {
        return this._lock;
    }

    _correction() {

        if (this.step === void 0) return;

        let _target = this.target;
        let _touch = this.touch;
        let _stage = _touch.stage;
        let _self = this;

        let el = this.target,
            property = this.property;
        let value = el[property];
        let rpt = Math.floor(Math.abs(value / this.step));
        let dy = value % this.step;
        if (Math.abs(dy) > this.step / 2) {


            this._to((value < 0 ? -1 : 1) * (rpt + 1) * this.step, 400, ease, this.change, function (value) {
                this._calculateIndex();
                this.correctionEnd.call(this, value);
                this.animationEnd.call(this, value);
            }.bind(this));


            // let _ms = {ease: ease};
            // _ms[this.property] = (value < 0 ? -1 : 1) * (rpt + 1) * this.step;
            // _ms.onEnd = () => {
            //     _self._calculateIndex();
            //     _self.correctionEnd.call(_self, value);
            //     _self.animationEnd.call(_self, value);
            // };
            //
            // JT.kill(_target);
            // JT.to(_target, 0.4, _ms);


        } else {

            this._to((value < 0 ? -1 : 1) * rpt * this.step, 400, ease, this.change, function (value) {
                this._calculateIndex();
                this.correctionEnd.call(this, value);
                this.animationEnd.call(this, value);
            }.bind(this));

            //
            // let _ms = {ease: ease};
            // _ms[this.property] = (value < 0 ? -1 : 1) * rpt * this.step;
            // _ms.onEnd = () => {
            //     _self._calculateIndex();
            //     _self.correctionEnd.call(_self, value);
            //     _self.animationEnd.call(_self, value);
            // };
            // JT.kill(_target);
            // JT.to(_target, 0.4, _ms);

        }
    }


    //计算指数
    _calculateIndex() {

        if (this.hasMax && this.hasMin) {
            this.currentPage = Math.round((this.max - this.target[this.property]) / this.step);
        }

    }

    _to(value, time, ease, onChange, onEnd) {
        if (this.fixed) return;
        let el = this.target,
            property = this.property;
        let current = el[property];
        let dv = value - current;
        let beginTime = new Date();
        let self = this;
        let toTick = function () {

            var dt = new Date() - beginTime;
            if (dt >= time) {
                el[property] = value;
                onChange && onChange.call(self, value);
                onEnd && onEnd.call(self, value);
                return;
            }
            el[property] = dv * ease(dt / time) + current;
            self.tickID = requestAnimationFrame(toTick);
            //cancelAnimationFrame必须在 tickID = requestAnimationFrame(toTick);的后面
            onChange && onChange.call(self, el[property]);
        };
        toTick();
    }

}

function reverseEase(y) {
    return 1 - Math.sqrt(1 - y * y);
}

function ease(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export default TouchSlider;