//兼容库
import './src/libs/weapp-adapter/index.js';
import './src/libs/symbol.js';
//createjs 框架
import './src/libs/createjs-wx.js';
//createjs 扩展功能
import './src/ds/createjs/index';
//载入Animate 发布的资源
import './assets/index.js';
// 游戏快速框架,
import GameAppByCreateJs from './src/ds/createjs/base/GameAppByCreateJs';

const global = GameGlobal;

//创建游戏框架
global.GameApp = new GameAppByCreateJs({
    background: '#75e3f2',//背景色
    fps: 60,//刷新率
    deviceOrientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',//横屏`landscape` 竖屏`portrait`，
    size: 750,//游戏尺寸， 竖屏下设定固定宽 横屏下设定固定高
    webgl: true, //是否使用到webgl
});

//在框架构建完成后 载入小游戏程序入口（注意：require 在构建global.GameApp 后执行）
require('./src/app/main');

