const path = require('path');

module.exports = {
  entry: './src/client/index.js', // نقطة الدخول
  output: {
    filename: '[name].[contenthash].js', // اسم الملف مع [contenthash] لضمان تجنب الكاش
    path: path.resolve(__dirname, 'dist'), // مسار الخرج
    libraryTarget: 'var', // تعيين نمط المكتبة
    library: 'Client', // اسم المكتبة
    clean: true, // تنظيف مجلد dist عند كل بناء
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'], // استخدام loaders لملفات sass
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.scss'], // إضافة الامتدادات التي سيتم حلها
  },
};
