const webpack = require('webpack');
const chalk = require('chalk'); //支持日志颜色修改
const prodConfig = require('../config/webpack.config.prod');
const ora = require('ora');

const spinner = ora('building>>>>').start();

const compiler = webpack(prodConfig);
compiler.run((err, stats) => {
  console.log(
    stats.toString({
      colors: true,
      chunks: false,
      assets: true,
    })
  );
  if (err || stats.hasErrors()) {
    console.log(
      chalk.red(
        'build fail:' +
          stats.toString({
            chunks: false, // 使构建过程更静默无输出
            colors: true, // 在控制台展示颜色
          })
      )
    );
    spinner.stop();
    return;
  }
  spinner.stop();
  console.log(chalk.green('build success'));
});
