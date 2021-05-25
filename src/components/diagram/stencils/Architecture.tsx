import React from 'react';
import Icon from '@ant-design/icons';

import wind from './icons/wind.svg';
import heater from './icons/heater.svg';
import generator from './icons/generator.svg';
import house from './icons/house.svg';
import station from './icons/station.svg';

export const IconStencil = React.memo(
  ({ svgImage, title }: any) => {
    const Img = () => <img src={svgImage} alt='empty' style={{ width: '50px', height: '50px' }} />;

    return (
      <div>
        <Icon component={Img} />
        <div>{title}</div>
      </div>
    );
  },
  (prev: any, next: any) => {
    if (prev.data?.editing !== next.data?.editing) {
      return false;
    }
    return true;
  },
);

export const WindTurbine = ({ nodeData }: any) => {
  const { title } = nodeData?.subject;
  return <IconStencil svgImage={wind} title={title} />;
};

export const Heater = ({ nodeData }: any) => {
  const { title } = nodeData?.subject;
  return <IconStencil svgImage={heater} title={title} />;
};

export const House = ({ nodeData }: any) => {
  const { title } = nodeData?.subject;
  return <IconStencil svgImage={house} title={title} />;
};

export const Generator = ({ nodeData }: any) => {
  const { title } = nodeData?.subject;
  return <IconStencil svgImage={generator} title={title} />;
};

export const Substation = ({ nodeData }: any) => {
  const { title } = nodeData?.subject;
  return <IconStencil svgImage={station} title={title} />;
};
