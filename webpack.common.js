const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src/client/index.js"), // تأكد من أن هذا الملف موجود
    output: {
        path: path.resolve(__dirname, "dist"), // مجلد الخرج
        filename: "bundle.js"
    },
    mode: "production", // تأكد من ضبط الوضع
    module: {
        rules: [
            {
                test: /\.js$/, // تمت إزالة علامات الاقتباس
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    optimization: {
        minimizer: [
            "...", // يحتفظ بالمصغرات الافتراضية مثل Terser
            new CssMinimizerPlugin()
        ],
        minimize: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src/client/views/index.html"), // تأكد من وجوده
            filename: "index.html"
        }),
        new CleanWebpackPlugin({
            dry: false, // قم بتغيير هذا إلى false ليتم الحذف الفعلي
            verbose: true, // لتظهر السجلات في الكونسول
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
    ],
    devServer: {
        static: path.resolve(__dirname, "dist"),
        hot: true,
        open: true
    }
};
