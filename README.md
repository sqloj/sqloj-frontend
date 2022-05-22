# sqloj frontend

sqloj 的前端部分，由 [Vue 3](https://v3.cn.vuejs.org/) 、[Typescript](https://www.typescriptlang.org/) 和 [Vite](https://cn.vitejs.dev/) 构建而成。

组件库：[Naive UI](https://www.naiveui.com/zh-CN/os-theme)

## Vscode 插件推荐 

全能 Vue 插件：[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

格式化工具：[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## yarn 安装依赖

使用的是 [nodejs v17](https://nodejs.org/en/blog/release/v17.0.0/) 和 [yarn](https://www.yarnpkg.cn/) 作为包管理工具

```shell
$ yarn
```

## Vite 运行

在运行前，请确保依赖已经安装完成

```shell
$ yarn dev 
```

## build 构建

```shell
# mock 模拟
$ yarn build --mode mock
# 生产版本
$ yarn build
```

## 格式化与代码检测

使用 prettier 进行格式化

```shell
$ yarn fmt
```

[ESLint](https://eslint.org/) 代码检测

```shell
$ yarn lint
```

## mockjs

可使用 [mockjs](http://mockjs.com/) 模拟后端，由于 API 变动暂未完成 mock 文件的更新