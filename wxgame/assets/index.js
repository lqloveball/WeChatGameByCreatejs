/**
 * Animate发布资源导入
 * `注意` 需要对发布的做 CommonJS 风格的模块 API 修改
 */
import mainFla from './main.js';

//设置全局动画资源对象
const global = GameGlobal;
global.mainFla = mainFla;

//设置库的快捷访问名
global.main = mainFla.lib;

console.log('Animate 资源载入..');