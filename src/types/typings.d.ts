declare module '*.less' {
  const content: any;
  export default content;
}

declare module '*.module.less' {
  const classes: { [className: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
