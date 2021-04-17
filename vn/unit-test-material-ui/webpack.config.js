const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
    module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, 
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, 
      {
        test: /\.(gif|ttf|eot|svg|woff2?)$/,
        use: 'url-loader?name=[name].[ext]' 
      },
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};