## WeChatGameByCreatejs

基于 createjs 的小游戏开发。对createjs库做修改兼容微信小游戏。

## 微信小游戏目录介绍 `wxgame`
```
-- assets/              //Animate 发布出来的资源文件.`注意` 需要对发布的JS做 CommonJS 风格的模块 API 修改
-- src/                 //源码目录
  |—app                 //项目代码目录
  |—ds                  //辅助createjs快速开发小游戏类库
  |—libs                //createjs-wx、weapp-adapter 框架代码库
  |—openDataContext     //开发作用域代码

```