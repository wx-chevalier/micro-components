[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/wx-chevalier/mindmap.ts">
    <img src="header.svg" alt="Logo" style="width: 100vw;height: 400px" />
  </a>

  <p align="center">
    <a href="https://github.com/wx-chevalier/mindmap.ts">View Demo</a>
    ·
    <a href="https://github.com/wx-chevalier/mindmap.ts/issues">Report Bug</a>
    ·
    <a href="https://github.com/wx-chevalier/mindmap.ts/issues">Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

# mindmap.ts

在 [Awesome-MindMaps](https://github.com/wx-chevalier/Awesome-MindMaps) 中笔者存放了数十张跨领域思维脑图（从编程语言到服务架构），为了更方便编辑与分享这些思维脑图，笔者创建了该项目，其目标包括：

- 方便地在 VSCode 中编辑思维脑图
- 与其他项目一致能够便捷地共享

> 该项目最初修改自 [blink-mind](https://github.com/awehook/blink-mind)。

## Nav | 导航

- mm-core: 核心模型定义与各种转化、适配器定义
- mm-react-comp: 基于 React 的界面组件
- mm-app: 独立的思维脑图编辑器
- mm-vscode: 以 VSCode 插件形式呈现的思维脑图编辑器

# Getting Started

To get a local copy up and running follow these simple steps.

## Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

```sh
npm install npm@latest -g
```

1. Clone the repo

```sh
git clone https://github.com/wx-chevalier/mindmap.ts.git
```

2. Install NPM packages

```sh
yarn install
```

## mm-app

```sh
$ npm run dev
$ npm run build:umd
```

注意，这里 App 是以 UMD 格式打包发布，在使用的地方需要先引入 React 与 React DOM 的 CDN：

```sh
https://cdn.bootcdn.net/ajax/libs/react/17.0.1/umd/react.production.min.js
https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.1/umd/react-dom.production.min.js
```

然后使用暴露出的渲染方法：

```js
window.mmts.renderMindMap($ele, jsonData);
```

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

# About

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/wx-chevalier/mindmap.ts/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Awesome-Lists](https://github.com/wx-chevalier/Awesome-Lists): 📚 Guide to Galaxy, curated, worthy and up-to-date links/reading list for ITCS-Coding/Algorithm/SoftwareArchitecture/AI. 💫 ITCS-编程/算法/软件架构/人工智能等领域的文章/书籍/资料/项目链接精选。

- [Awesome-CS-Books](https://github.com/wx-chevalier/Awesome-CS-Books): :books: Awesome CS Books/Series(.pdf by git lfs) Warehouse for Geeks, ProgrammingLanguage, SoftwareEngineering, Web, AI, ServerSideApplication, Infrastructure, FE etc. :dizzy: 优秀计算机科学与技术领域相关的书籍归档。

- [mindmapp](https://github.com/Mindmapp)

- mmp

- [text2mindmap](https://github.com/payne/text2mindmap): Online tool for making mindmaps by writing indented lists

- vscode-mindmap

- [blink-mind](https://github.com/awehook/blink-mind): Fully customizable mindmap framework for react.js. 支持插件的，可被完全定制的思维导图库，基于 react.js 和 immutable.js。

## Copyright & More | 延伸阅读

笔者所有文章遵循[知识共享 署名 - 非商业性使用 - 禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。您还可以前往 [NGTE Books](https://ng-tech.icu/books/) 主页浏览包含知识体系、编程语言、软件工程、模式与架构、Web 与大前端、服务端开发实践与工程架构、分布式基础架构、人工智能与深度学习、产品运营与创业等多类目的书籍列表：

[![NGTE Books](https://s2.ax1x.com/2020/01/18/19uXtI.png)](https://ng-tech.icu/books/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/https://github.com/wx-chevalier/mindmap.ts.svg?style=flat-square
[contributors-url]: https://github.com/wx-chevalier/mindmap.ts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/https://github.com/wx-chevalier/mindmap.ts.svg?style=flat-square
[forks-url]: https://github.com/wx-chevalier/mindmap.ts/network/members
[stars-shield]: https://img.shields.io/github/stars/https://github.com/wx-chevalier/mindmap.ts.svg?style=flat-square
[stars-url]: https://github.com/wx-chevalier/mindmap.ts/stargazers
[issues-shield]: https://img.shields.io/github/issues/https://github.com/wx-chevalier/mindmap.ts.svg?style=flat-square
[issues-url]: https://github.com/wx-chevalier/mindmap.ts/issues
[license-shield]: https://img.shields.io/github/license/https://github.com/wx-chevalier/mindmap.ts.svg?style=flat-square
[license-url]: https://github.com/wx-chevalier/mindmap.ts/blob/master/LICENSE.txt
