import React, { useEffect } from 'react';
import { stencils } from './';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';

export const PanelStencilRenderer = ({ options, parent }: any) =>
  observer<any>(({ node, nodeData, ...props }: any) => {
    const Renderer = stencils[options.protoStencil];
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
    const createChildren = (children: any) => {
      return children.map((child: any) => {
        const Renderer = PanelStencilRenderer({ options: child });
        return <Renderer key={child.id} nodeData={{}} />;
      });
    };
    return (
      <SizeOperator node={node} parent={parent} height={options.height} child={options.elements}>
        <Renderer
          nodeData={nodeData}
          {...props}
          {...newProps}
          children={options.elements ? () => createChildren(options.elements) : () => {}}
        />
      </SizeOperator>
    );
  });

const SizeOperator = ({ node, children, height, parent, child }: any) => {
  const ref = React.useRef<any>();
  useEffect(() => {
    if (parent && child) {
      if (ref.current.clientHeight > node.store.data.size.height) {
        node.resize(node.store.data.size.width, ref.current.clientHeight, {
          ignore: true,
        });
        node.store.data.resizeGraph();
      }
    }
  }, []);
  return parent && child ? (
    <div ref={ref}>{children}</div>
  ) : (
    <div style={{ minHeight: height, height: '100%' }}>{children}</div>
  );
};
