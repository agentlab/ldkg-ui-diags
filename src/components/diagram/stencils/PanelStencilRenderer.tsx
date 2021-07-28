import React, { useEffect } from 'react';
import { stencils } from './';
import { observer } from 'mobx-react-lite';
import { createNewStencilProps, StencilProps } from './StencilEditor';

export const PanelStencilRenderer = ({ options, parent }: any) =>
  observer<any>(({ node, nodeData, ...props }: any) => {
    const Renderer: React.FC<StencilProps> = stencils[options.protoStencil];
    const newProps = createNewStencilProps(options, nodeData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return parent && child ? (
    <div ref={ref}>{children}</div>
  ) : (
    <div style={{ minHeight: height, height: '100%' }}>{children}</div>
  );
};
