module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss',
    'storybook-css-modules-preset',
    {
      name: '@storybook/preset-ant-design',
      options: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1864FB', //'#1DA57A', // primary color for all components  24 100 251
            'font-size-base': '12px', // major text font size
            'link-color': '#1DA57A',
          },
        },
      },
    },
  ],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  //typescript: {
  //  check: true, // type-check stories during Storybook build
  //}
};
