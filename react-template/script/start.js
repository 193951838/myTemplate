//start.js
const WebpackServer = require('webpack-dev-server');
const baseConfig = require('../config/webpack.config.base');
const webpack = require('webpack');
const chalk = require('chalk'); //支持日志颜色修改
const net = require('net');
const address = require('address'); //用来获取当前计算机的IP，MAC和DNS服务器。
const compiler = webpack({
  ...baseConfig,
  mode: 'development',
  devtool: 'eval-source-map',
});

let port = 8081;

function listenPort() {
  const server = net.createServer().listen(port);

  server.on('listening', () => {
    server.close();
    startDevServer();
  });
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      ++port;
      console.log(
        chalk.yellow('the port is already used,modify the port to' + port)
      );
      listenPort();
    }
  });
}

function startDevServer() {
  const devServer = new WebpackServer(compiler, {
    host: address.ip(),
    compress: true, //启用 gzip 压缩。
    index: 'index.html', //启动索引html文件,默认index.html
    hot: true, //是否启用热替换
    clientLogLevel: 'none', //启用内联模式(inline mode)，会在控制台打印消息，用none阻止。
    inline: true, //dev-server 的两种不同模式之间切换：true内联模式(inline mode)、 false: iframe 模式，默认true。
    open: true, //自动打开浏览器
  });
  devServer.listen(port);
}

listenPort();
