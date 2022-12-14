const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: path.join('images', '[name].[contenthash][ext]'), //азывает выходной каталог images и шаблон имени [name].[contenthash][ext] для файлов, которые соответствуют правилу type: 'asset/resource'. Если assetModuleFilename не указан, то, по умолчанию, каталогом будет dist, а имя файла будет [contenthash][ext].

  },
  devtool: 'source-map',
  module: {
    rules: [
        {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                    options: {
                     presets: ['@babel/preset-env']
                 },
            },
        },
        {
            test: /\.pug$/,
            loader: 'pug-loader',
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader, 
                'css-loader', 
                'postcss-loader', 
                'sass-loader',
            ],
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.svg$/,
            type: 'asset/resource',
            generator: {
                filename: path.join('images/icons', '[name].[contenthash][ext]'),
            },
        },
        {
            test: /\.(woff2?|eot|ttf|otf|svg)$/i,
            include: /fonts/,
            type: 'asset/resource',
            generator: {
                filename: 'assets/fonts/[name][hash][ext][query]',
              },
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'template.pug'),
        filename: 'index.html',
    }),
    /*new FileManagerPlugin({
        events: {
            onStart: {
                delete: ['./dist/'],
            },
        },
    }),*/
    new CleanWebpackPlugin(),// clean build folder
    
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
    }),
    ],
    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        port: 9000,
    },


    // Optimization images
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    plugins: [
                        ['gifsicle', { interlaced: true }],
                        ['jpegtran', { progressive: true }],
                        ['optipng', { optimizationLevel: 5 }],
                        ['svgo', { name: 'preset-default' }],
                    ],
                },
              },
            }),
        ],
    },
};