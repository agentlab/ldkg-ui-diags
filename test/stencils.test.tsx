/* eslint-disable jest/expect-expect */
import React from 'react';
import { act, render } from '@testing-library/react';

import { Compartment } from '../src/components/diagram/stencils/Compartment';
import { NodeField } from '../src/components/diagram/stencils/NodeField';
import { NodeShape } from '../src/components/diagram/stencils/NodeShape';
import { Default } from '../src/components/diagram/stencils/Default';
import { Card } from '../src/components/diagram/stencils/Card';

describe('Stencils', () => {
  it('renders Compartment without crashing', async () => {
    await act(async () => {
      render(<Compartment text='Test' />);
    });
  }, 500);

  it('renders Compartment with empty title without crashing', async () => {
    await act(async () => {
      render(<Compartment text='' />);
    });
  }, 500);

  it('renders NodeField without crashing', async () => {
    await act(async () => {
      render(<NodeField data={{ label: 'Test' }} />);
    });
  }, 500);

  it('renders NodeShape without crashing', async () => {
    await act(async () => {
      render(<NodeShape data={{ label: 'Test' }} />);
    });
  }, 500);

  it('renders Default without crashing', async () => {
    await act(async () => {
      render(<Default data={{ label: 'Test' }} />);
    });
  }, 500);

  it('renders Card without crashing', async () => {
    await act(async () => {
      render(
        <Card
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
