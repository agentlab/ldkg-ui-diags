import React from 'react';
import Icon from '@ant-design/icons';
import { StencilProps } from './StencilEditor';

export const SvgNode = React.memo<StencilProps>(
  ({ img, title }: any): JSX.Element => {
    const Img = () => <img src={img} alt='empty' style={{ width: '50px', height: '50px' }} />;
    return (
      <div>
        <Icon component={Img} />
        <div>{title}</div>
      </div>
    );
  },
  (prev: any, next: any): boolean => {
    if (prev.data?.editing !== next.data?.editing) {
      return false;
    }
    return true;
  },
);
