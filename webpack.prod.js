const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production', // وضع الإنتاج
  devtool: 'hidden-source-map', // خريطة مصدر مخفية للإنتاج
  optimization: {
    minimize: true, // تمكين تصغير الملفات
    minimizer: [
      new TerserPlugin(), // تصغير ملفات JavaScript
      new CssMinimizerPlugin(), // تصغير ملفات CSS
    ],
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // استخراج CSS إلى ملفات منفصلة
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js', // تضمين [contenthash] لضمان عدم وجود مشاكل مع الكاش
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // استخراج CSS إلى ملف منفصل
    }),
  ],
});
