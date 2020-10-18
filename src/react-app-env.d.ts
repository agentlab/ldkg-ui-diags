/// <reference types="react-scripts" />

//declare module '*.less';

declare module "*.module.less" {
  const classes: { [className: string]: string };
  export default classes;
}
