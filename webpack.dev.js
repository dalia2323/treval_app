const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development', // وضع التطوير
  devtool: 'source-map', // توليد خرائط المصدر لمساعدة في التصحيح
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // تحديد مكان الملفات المخدمة
    hot: true, // تمكين Hot Module Replacement
    port: 3000, // المنفذ الذي سيعمل عليه السيرفر
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'], // إعدادات sass لتطوير
      },
    ],
  },
  output: {
    filename: 'bundle.js', // اسم ملف الخرج في بيئة التطوير
  },
});
