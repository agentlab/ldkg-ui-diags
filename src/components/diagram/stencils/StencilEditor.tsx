import React from 'react';
import { stencils } from './';
import { observer } from 'mobx-react-lite';
import get from 'lodash-es/get';

export interface StencilProps {
  nodeData: any;
  style?: React.CSSProperties;
  setEditing: (state: boolean) => void;
  onSave: (data: any) => void;
  [key: string]: any;
}
export const StencilEditor = ({ options }: any) =>
  observer<any>(({ nodeData, ...props }: any) => {
    const Renderer: React.FC<StencilProps> = stencils[options.protoStencil];
    const newProps = createNewStencilProps(options, nodeData);
    return <Renderer nodeData={nodeData} {...props} {...newProps}></Renderer>;
  });

export const createNewStencilProps = (options, nodeData) => {
  const newProps = {};
  for (const key in options) {
    if (key === 'style') {
      newProps[key] = { ...options.style, ...nodeData.style };
    } else {
      const val = options[key];
      if (val !== undefined) {
        if (typeof val === 'string') {
          newProps[key] = val;
        } else if (val.scope) {
          const uri = options[key].scope.split('/').join('.');
          newProps[key] = get(nodeData, uri) || options[key].default;
        }
      }
      //newProps[key] = get(data, options[key].scope);
    }
  }
  return newProps;
};
