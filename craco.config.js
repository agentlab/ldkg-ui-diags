/* eslint-disable @typescript-eslint/no-var-requires */

// see https://ant.design/docs/react/customize-theme
// and https://ant.design/docs/react/use-with-create-react-app
const CracoAntDesignPlugin = require('craco-antd');
//const path = require('path');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#1864FB', //'#1DA57A', // primary color for all components  24 100 251
          '@font-size-base': '12px', // major text font size
          '@link-color': '#1DA57A',
        },
      },
    },
  ],
};
