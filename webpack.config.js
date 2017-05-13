var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: [
        './src/index.js',
    ],

    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader?' + JSON.stringify({
                    cacheDirectory: true,
                    plugins: ["transform-class-properties", "add-module-exports"],
                    presets: [
                        'es2015',
                        'stage-0'
                    ],
                })],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },

    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        extensions: [".js", ".css"],
    },

    devtool: 'source-map',
    plugins:[
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress:{
            warnings: true
          }
        })
    ]

};
