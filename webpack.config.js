const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const internalIp = require('internal-ip')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('snapsvg'),
        loader: 'imports-loader?this=>window,fix=>module.exports=0'
      },
      {
        test: /\.(txt|frag|vert|glsl|svg|fs|vs)$/,
        exclude: /node_modules/,
        use: 'raw-loader'
      },
      {
        test: /\.(glsl|frag|vert|fs|vs)$/,
        exclude: /node_modules/,
        use: 'glslify'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'eslint-loader'
            /* options: {
              fix: true
            } */
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
      objects: path.resolve(__dirname, 'src/webgl/objects'),
      snapsvg: path.resolve(__dirname, 'node_modules/snapsvg/dist/snap.svg.js')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ],
  devServer: {
    host: internalIp.v4.sync(),
    open: true
  }
}
