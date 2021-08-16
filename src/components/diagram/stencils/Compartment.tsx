import React from 'react';
import { StencilProps } from './StencilEditor';

export const Compartment = ({ /*node,*/ text }: StencilProps): JSX.Element => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',

        backgroundColor: 'white',
      }}>
      <div
        style={{
          backgroundColor: '#ab80ff',
          paddingLeft: 5,
          height: 20,

          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
        {text}
      </div>
    </div>
  );
};
