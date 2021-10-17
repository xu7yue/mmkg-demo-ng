const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': 'rgb(246, 220, 150)' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
