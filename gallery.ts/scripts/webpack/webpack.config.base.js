/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const process = require('process');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const tsImportPluginFactory = require('ts-import-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const rootPath = process.cwd();
const packageName = require(path.resolve(rootPath, 'package.json'));

const buildEnv = {
  rootPath,
  packageName,
  src: path.resolve(rootPath, './src'),
  example: path.resolve(rootPath, './example'),
  public: path.resolve(rootPath, './public'),
  build: path.resolve(rootPath, './build')
};

const moduleCSSLoader = {
  loader: 'css-loader'
  // options: {
  //   modules: {
  //     mode: 'local',
  //     localIdentName: 'rtw_[hash:base64:5]_[local]'
  //   },
  //   sourceMap: false,
  //   importLoaders: 2
  // }
};

const lessLoader = {
  loader: 'less-loader',
  options: {
    modifyVars: {
      'primary-color': '#5d4bff'
    },
    javascriptEnabled: true,
    paths: [path.resolve(rootPath, './node_modules'), path.resolve(rootPath, './src')]
  }
};

const fontsOptions = {
  limit: 8192,
  mimetype: 'application/font-woff',
  name: 'fonts/[name].[ext]'
};

module.exports = {
  context: rootPath,
  entry: {
    index: path.resolve(buildEnv.rootPath, './src/index.tsx')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.less', '.svg'],
    plugins: [new TSConfigPathsPlugin()],
    alias: {
      '@': path.resolve(rootPath, './src/'),
      '~antd': path.resolve(rootPath, './node_modules/antd')
    }
  },
  output: {
    path: buildEnv.build,
    // 设置所有资源的默认公共路径，Webpack 会自动将 import 的资源改写为该路径
    publicPath: '/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    globalObject: 'this' // 避免全局使用 window
  },
  module: {
    rules: [
      {
        test: /.*ts-worker.*/,
        use: ['workerize-loader', 'ts-loader']
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'awesome-typescript-loader',
        options: {
          getCustomTransformers: () => ({
            before: [tsImportPluginFactory(/** options */)]
          })
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: fontsOptions
          }
        ]
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: fontsOptions
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [/node_modules/, buildEnv.src, buildEnv.example]
      },
      {
        test: /\.less$/,
        use: ['style-loader', moduleCSSLoader, lessLoader],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', lessLoader],
        include: /node_modules/
      },
      {
        test: /\.wasm$/,
        loader: 'wasm-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true, eslint: true }),
    new webpack.WatchIgnorePlugin([/less\.d\.ts$/]),
    new webpack.IgnorePlugin(/\.js\.map$/)
  ],

  // 定义非直接引用依赖，使用方式即为 var $ = require("jquery")
  externals: {
    window: 'window',
    jquery: '$'
  },
  extra: {
    moduleCSSLoader,
    lessLoader,
    buildEnv
  }
};
