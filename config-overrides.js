const {
  override,
  fixBabelImports,
  addWebpackAlias,
  addWebpackPlugin
} = require('customize-cra');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css'
  }),
  // 配置路径别名
  addWebpackAlias({
    '@': path.resolve(__dirname, './src')
  }),
  addWebpackPlugin(
    new FileManagerPlugin({
      events: {
        //初始化 filemanager-webpack-plugin 插件实例
        onEnd: {
          delete: [
            //首先需要删除项目根目录下已存在的zip文件
            './build.zip'
          ],
          archive: [
            //选择根目录下build文件夹将之打包成zip文件并放在根目录
            { source: './build', destination: './build.zip' }
          ]
        }
      }
    })
  )
);
