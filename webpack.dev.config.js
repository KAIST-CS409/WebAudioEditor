var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: {
        index: ['./src/index.js', 'webpack/hot/only-dev-server', 'webpack-dev-server/client?http://0.0.0.0:4000'],
        signin: ['./src/signin.js', 'webpack/hot/only-dev-server', 'webpack-dev-server/client?http://0.0.0.0:4000'],
        signup: ['./src/signup.js', 'webpack/hot/only-dev-server', 'webpack-dev-server/client?http://0.0.0.0:4000'],
        library: ['./src/library.js', 'webpack/hot/only-dev-server', 'webpack-dev-server/client?http://0.0.0.0:4000'],
        library_workspace: ['./src/library_workspace.js', 'webpack/hot/only-dev-server', 'webpack-dev-server/client?http://0.0.0.0:4000']
    },

    output: {
        path: '/build',
        filename: '[name].bundle.js',
        /* For this refer http://tomasalabes.me/blog/_site/web-development/2016/12/10/Webpack-and-the-public-path.html */
        publicPath: '/build/',
    },

    devServer: {
        hot: true,
        filename: '[name].bundle.js',
        /* This modified bundle is served from memory at the relative path specified in publicPath (see API).
        * It will not be written to your configured output directory.
        * Where a bundle already exists at the same URL path, the bundle in memory takes precedence (by default).
        * It also gives the static files of the project. (contentBase is for dynamic routed files.)
        * Recommend to make it same as the relative path of output file.
        * Don't put comma in front of '/build'. './build' doesn't work.
        * Refer https://webpack.github.io/docs/webpack-dev-server.html for detailed info.
        */
        publicPath: '/build',
        historyApiFallback: true,
        /* contentBase denotes the place where the routing starts. If there is no entry, then it routes to 3000 server.*/
        contentBase: '/public',
        proxy: {
            "*": "http://localhost:3000"
        },

        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
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
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },

    resolve: {
        modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './public'), 'node_modules'],
        extensions: [".js", ".css"],
    },

    devtool: 'cheap-module-eval-source-map',
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
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]

};
