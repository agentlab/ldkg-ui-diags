import React from 'react';
import { stencils } from './';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';

export const StencilEditor = ({ options }: any) =>
  observer<any>(({ data, ...props }: any) => {
    const Renderer = stencils[options.protoStencil];
    const newProps = {};
    for (let key in options) {
      if (key == 'style') {
        newProps[key] = options.style;
      } else {
        if (options[key].scope) {
          const uri = options[key].scope.split('/').join('.');
          newProps[key] = get(data, uri) || options[key].default || options[key].fallback;
        }
        newProps[key] = get(data, options[key].scope);
      }
    }
    return <Renderer data={data} {...newProps} {...props} />;
  });
