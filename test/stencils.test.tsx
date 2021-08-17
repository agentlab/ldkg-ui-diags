/* eslint-disable jest/expect-expect */
import React from 'react';
import { act, render } from '@testing-library/react';

import { RectWithTextNode } from '../src/components/diagram/stencils/RectWithTextNode';
import { TitledRectNode } from '../src/components/diagram/stencils/TitledRectNode';
import { DefaultNode } from '../src/components/diagram/stencils/DefaultNode';
import { CardNode } from '../src/components/diagram/stencils/CardNode';

describe('Stencils', () => {
  it('renders NodeField without crashing', async () => {
    await act(async () => {
      render(<RectWithTextNode data={{ label: 'Test' }} />);
    });
  }, 500);

  it('renders NodeShape without crashing', async () => {
    await act(async () => {
      render(<TitledRectNode data={{ label: 'Test' }} />);
    });
  }, 500);

  it('renders Default without crashing', async () => {
    await act(async () => {
      render(<DefaultNode data={{ label: 'Test' }} />);
    });
  }, 500);

  it('renders Card without crashing', async () => {
    await act(async () => {
      render(
        <CardNode
          nodeData={{
            subject: {
              imageUrl: null,
              title: 'Test',
              description: 'test description',
            },
          }}
        />,
      );
    });
  }, 500);
});
