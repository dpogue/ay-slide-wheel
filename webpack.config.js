module.exports = {
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json']
  },
  entry: './demo/app.ts',
  output: {
    path: __dirname + '/demo/generated',
    filename: 'app.js',
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
      { test: /\.ts$/, loader: 'ts-loader', options: { compilerOptions: { declaration: false }}, include: [/src/, /demo/] },
      { test: /\.m?js?$/, loader: 'source-maps-loader', include: /node_modules/ }
    ]
  }
};
