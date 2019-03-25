## Installation

### Prerequisites

#### Get Node.js

```bash
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

#### Get Sails.js (optional)

```bash
$ sudo npm install sails -g
```

#### Install modules

```bash
$ cd frontend && npm install
$ cd ../backend && npm install
```

## Usage

### Development

`cd backend && sails lift` and then `cd ../frontend && npm run serve`. After that, open
[localhost:8080](http://localhost:8080) in your browser. Make sure that you start both servers simultaneously.

### Production

First, you have to build up your Vue.js components and merge them with Sails.js. This can be done with
`cd frontend && npm run build`. Now do `cd ../backend && npm run start` and then open your browser and go to
[localhost:1337](http://localhost:1337).or simply run:

```bash
$ npm run start
```

## Commands

### Backend

For a complete list see `package.json`.

| Command             | Description                                                                                      |
|---------------------|--------------------------------------------------------------------------------------------------|
| `npm run dev`       | Start Sails.js if you didn't install it globally                                                 |
| `npm run start` | Start Sails.js                                 |

### Frontend

For a complete list see `package.json`.

| Command                   | Description                                                                              |
|---------------------------|------------------------------------------------------------------------------------------|
| `npm run serve`           | Start the development server at [localhost:8080](http://localhost:8080)                  |
| `npm run build`           | Minfiy, uglify and merge the application with Sails.js                                   |

The following components are used in this project. There are plenty more, though, check the package.json files.

### [Sails.js](https://github.com/balderdashy/sails)

This is the backend and data provider.

### [Vue.js](https://github.com/vuejs/vue)

Handle frontend data with a [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel).

## Thanks

This project could not have been made possible without the great work of [Julian Claus](https://github.com/ndabAP) and his repo [vue-sails-example](https://github.com/ndabAP/vue-sails-example)

## integrate fix

sails model自动生成的API 与 前端路由重合，所以前端页面统一添加v前缀；（或者配置sails后端API统一增加path: api/, 但是目前只发现重写每个route的办法，不知道如何配置blueprint action自动增加访问路径前缀）

`area`标签的href链接会触发页面自动刷新，sails后端路由需要针对前端路由页面增加跳转至index.html:

```js
// backend/config/routes.js
'/v*': {
  controller: 'App',
  action: 'serve',
  skipAssets: true,
  skipRegex: /^\/api\/.*$/
}
```

sails文件默认上传至.tmp/uploads目录，可通过[static middleware](https://www.npmjs.com/package/serve-static)设置uploads目录可公开访问，[See ref](https://sailsjs.com/documentation/concepts/middleware/conventional-defaults)，可参考`${sails.config.appPath}\node_modules\sails\lib\hooks\http\get-configured-http-middleware-fns.js#line54`中的`www`中间件在`sails.config.http`中添加自定义`middleware uploads`:
```js
uploads: (function () {
  var path = require('path');
  var flatFileMiddleware = require('serve-static')(path.resolve(__dirname, '../.tmp/uploads'), {
    maxAge: '1h'
  });

  return flatFileMiddleware;
})(),
```

或者添加`action image`和`route`实现显示图片,`sails.config.routes`:
```js
'GET /imgUpload/:name': {
  skipAssets: false, // default true, [See ref](https://sailsjs.com/documentation/concepts/routes/custom-routes#?route-target-options)
  action: 'image'
}
```

### docker

```bash
## 生成镜像
docker build -t app:v0.1 .
docker images
# 运行镜像容器 or 使用docker扩展images下选中app:v0.1右键，选择run interactive
docker run --rm -it -p 80:80/tcp app:v0.1
# 开发模式：运行docker-compose.debug.yml
docker-compose -f docker-compose.debug.yml up
```

### data generate
```bash
# 添加user
curl -d "workid=12345&name=admin&type=0" http://localhost:1337/user
```
