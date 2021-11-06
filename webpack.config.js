module.exports = {
    output: {
        filename: 'script.min.js',
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
    
}