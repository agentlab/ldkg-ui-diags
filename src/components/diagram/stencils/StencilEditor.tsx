import React from 'react';
import { stencils } from './';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';

export const StencilEditor = ({ options }: any) =>
  observer<any>(({ nodeData, ...props }: any) => {
    const Renderer = stencils[options.protoStencil];
    const newProps = createNewStencilProps(options, nodeData);
    return <Renderer nodeData={nodeData} {...props} {...newProps}></Renderer>;
  });

export const createNewStencilProps = (options, nodeData) => {
  const newProps = {};
  for (let key in options) {
    if (key == 'style') {
      newProps[key] = options.style;
    } else {
      if (options[key].scope) {
        const uri = options[key].scope.split('/').join('.');
        newProps[key] = get(nodeData, uri) || options[key].default || options[key].fallback;
      }
      //newProps[key] = get(data, options[key].scope);
    }
  }
  return newProps;
};
