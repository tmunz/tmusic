const path = require('path');

module.exports = (env) => {
  const isExtension = env.extension === 'true';
  
  return {
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
      path: path.resolve(__dirname, '..', './dist'),
      filename: (pathData) => {
        if (pathData.chunk.name === 'extension') {
          return '[name].js';
        }
        return 'bundle.[name].[contenthash].js';
      },
      publicPath: '/tmusic/',
    },
  };
};
