const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
// const nodeExternals = require('webpack-node-externals');

module.exports = {
  //模式： development production
  mode: "development",
  entry: {
    app: path.join(__dirname, "src/index.js"),
  },
  output: {
    filename: "shwave.boundle.js",
    path: path.join(__dirname, "build"),
    // libraryTarget: "commonjs2",
  },
  devServer: {
    //热打包
    hot: true,
    //0.0.0.0本地host通用 ， http://localhost:2021/
    host: "localhost",
    port: "2021",
    //在出错误时 全屏显示错误
    overlay: true,
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".json"],
    enforceExtension: false,
  },
  module: {
    rules: [
      {
        //以.js或.jsx结尾的文件
        test: /\.(js|jsx)$/,
        //排除node_modules文件夹 不打包它
        exclude: path.join(__dirname, "node_modules"),
        //使用babel-loader转译react的jsx代码 为es5
        use: ["babel-loader"],
      },
      {
        //以.css结尾的文件
        test: /\.css$/,
        //排除node_modules文件夹 不打包它
        exclude: path.join(__dirname, "node_modules"),
        //从右到左执行 对css文件先用cssloader 然后用styleloader
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(htm|html)$/,
        use: ["html-loader"],
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      filename: "index.html",
      //指出要打包的路径
      template: path.join(__dirname, "src/index.html"),
    }),
  ],
  //插件 忽略node_modules
  // externals: [nodeExternals()],
};
