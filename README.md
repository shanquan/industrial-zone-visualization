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

##### keep resolve directory in outputDir

open ./frontend/node_modules/@vue/cli-service/lib/commands/build/index.js, edit & save as below from line 178:
```js
  if (args.clean) {
    if (fs.existsSync(targetDir)) {
      let files = [];
      files = fs.readdirSync(targetDir);
      files.forEach(async (file, index) => {
        if (!(fs.statSync(targetDir+'/'+file).isDirectory()&&file=='upload')){
          await fs.remove(targetDir + '/' + file)
        }
      })
    }
    // await fs.remove(targetDir)
  }
```
then in frontend running `npm run build` won't clear directory `upload`(ie `../backend/.tmp/public/upload` in this project)

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

sails默认static路径为.tmp/public，上传图片url时需要将图片放入其中，但是前端执行vue-cli-service build命令时会自动清空public目录或不清空，需要设置[保留其中的upload文件夹](#keep-resolve-directory-in-outputdir)

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

### docker

```bash
## 修改image中的配置文件，修复production环境下sails error
docker build -t app:v0.1 .
docker images
# 运行容器，进入terminal
docker container run -it app:v0.1
cd backend/config/env
# 替换253至257行内容，建议先不用-i参数预览文件内容，确认无误后加-i参数保存文件
sed -i '253,257c onlyAllowOrigins:['http://localhost']' production.js
# 重新进入容器bash并运行npm start
# docker ps
# docker exec -it ${NAMES} /bin/bash
# npm run start
# 提交容器至镜像image
docker ps
docker commit ${CONTAINER ID} app:v0.1
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
