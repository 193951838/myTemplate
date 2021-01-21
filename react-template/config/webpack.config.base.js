const path = require('path'); //内置模块，可以将相对路径解析成绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离样式插件link引入
const TerserPlugin = require('terser-webpack-plugin');

const srcRoot = path.resolve(__dirname, '../src');
module.exports = {
  entry: srcRoot + '/index.js', //入口文件
  output: {
    path: path.resolve(__dirname, '../build'), //打包出的文件所放位置，路径必须是绝对路径,（__dirname:以当前目录下产出一个build目录）
    filename: 'index.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    //多个loader需要[],loader还可以写成对象{loader:""},执行顺序从右向左执行,从下到上执行   //
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/, //不包含node_modules目录下的js文件
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], //规则 css-loader 解析@import这种语法、style-loader 他是把css插入到head标签中
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        include: [/src/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[path]_[local]_[hash:base64:6]', //给css类名添加哈希值，避免组件中命名重复而导致样式混合
              },
            },
          },
          // 'postcss-loader', //考虑浏览器的兼容性，添加浏览器前缀
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/images/[name]_[hash:base64:6].[ext]',
          },
        },
      },
      {
        test: /\.(ttf|otf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/fonts/[name]_[hash:base64:6].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'], // 可省略引入时的后缀
    alias: {
      // 快捷引入，可直接以当前目录下查找
      // 'react-dom': '@hot-loader/react-dom',
      pages: srcRoot + '/pages',
      components: srcRoot + '/components',
      common: srcRoot + '/common',
      api: srcRoot + '/api',
      assets: srcRoot + '/assets',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'react-app',
      template: path.resolve(__dirname, '../public/index.html'), //本地模板文件的位置
      filename: 'index.html',
      minify: false,
      inject: true, // 1、true或者body：所有JavaScript资源插入到body元素的底部;head: 所有JavaScript资源插入到head元素中;false：所有静态资源css和JavaScript都不会注入到模板文件中
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'css/[name].css',
    }),
  ],
};
