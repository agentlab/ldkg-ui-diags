// crago.config.js
// see: https://github.com/sharegate/craco

/* eslint-disable @typescript-eslint/no-var-requires */

// see https://ant.design/docs/react/customize-theme
// and https://ant.design/docs/react/use-with-create-react-app
const CracoAntDesignPlugin = require('craco-antd');

const path = require('path');
const fs = require('fs');
const cracoBabelLoader = require('craco-babel-loader');

// Handle relative paths to sibling packages
const appDirectory = fs.realpathSync(process.cwd());
const resolvePackage = (relativePath) => path.resolve(appDirectory, relativePath);

const CracoAlias = require('craco-alias');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin',
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
  },
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
    {
      plugin: CracoAlias,
      options: {
        //source: "options",
        //baseUrl: "./",
        aliases: {
          react: '../node_modules/react',
          'react-dom': '../node_modules/react-dom/profiling',
          'scheduler/tracing': '../node_modules/scheduler/tracing-profiling',
          '@agentlab/ldkg-ui-react': '../node_modules/@agentlab/ldkg-ui-react',
        },
      },
    },
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [
          // No "unexpected token" error importing components from these lerna siblings:
          resolvePackage('../es'),
        ],
      },
    },
  ],
};
