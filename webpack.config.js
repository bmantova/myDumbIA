const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const internalIp = require('internal-ip')

module.exports = {
  module: {
    rules: [
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
            loader: 'eslint-loader',
            /* options: {
              fix: true
            } */
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
      objects: path.resolve(__dirname, 'src/webgl/objects')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: './index.html'
    })
  ],
  devServer: {
    host: internalIp.v4.sync(),
    open: true
  }
}
