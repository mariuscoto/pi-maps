module.exports = {
  entry: './components/maps.jsx',
  output: {
    filename: './public/bundle.js'
  },
  module: {
    loaders: [{
      test    : /\.jsx$/,
      loader  : 'jsx-loader',
      exclude : /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
