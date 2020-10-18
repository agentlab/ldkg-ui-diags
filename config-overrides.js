/* eslint-disable @typescript-eslint/no-var-requires */

// see https://next.ant.design/docs/react/customize-theme
// and https://next.ant.design/docs/react/use-with-create-react-app
const path = require('path');
const fs = require('fs');

const {
  override,
  fixBabelImports,
  addLessLoader,
  //addDecoratorsLegacy,
  //babelInclude,
  //disableEsLint,
} = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      //see https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
      modifyVars: {
        '@primary-color': '#1864FB', //'#1DA57A', // primary color for all components  24 100 251
        //'@font-size-base': '12px', // major text font size
      },
    },
  }),
  //disableEsLint(),
  //addDecoratorsLegacy(),
  /*Make sure Babel compiles the stuff in the common folder*/
  //babelInclude([
  //  path.resolve('src'), // don't forget this
  //  path.resolve('node_modules/expert-system-views/src')
  //]),
);
