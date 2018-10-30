module.exports = (config) => {
  config.set({

    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],

    files: [
      { pattern: 'test/**/*.spec.js', watched: false },
    ],

    preprocessors: {
      'test/**/*.spec.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      mode: 'development',
      devtool: "inline-source-map",
      module: {
        noParse: /ffmpeg/,
        rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|ffmpeg)/,
              use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                      "@babel/plugin-syntax-dynamic-import",
                      "@babel/plugin-proposal-class-properties"]
                  }
              }
            }
        ]
      }
    },

    browsers: ['ChromeHeadless'],
    
    webpackMiddleware: {
      stats: 'errors-only'
    }

  })
}