module.exports = {
  entry: './src/index.js',
  output: {
    filename: './public/bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [{ loader: 'babel-loader' }]
      }
    ]
  }
}
