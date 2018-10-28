module.exports = {
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json']
  },
  entry: {
    angular: './demo/app-angular.ts',
    web: './demo/app-web.ts'
  },
  output: {
    path: __dirname + '/demo/generated',
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
