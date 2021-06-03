import { act, render } from '@testing-library/react';

import { Compartment } from '../components/diagram/stencils/Compartment';
import { NodeField } from '../components/diagram/stencils/NodeField';
import { NodeShape } from '../components/diagram/stencils/NodeShape';
import { Default } from '../components/diagram/stencils/Default';
import { Card } from '../components/diagram/stencils/Card';

describe('Stencils', () => {
  it('renders Compartment without crashing', async () => {
    await act(async () => {
      render(<Compartment text='Test' />);
    });
  });

  it('renders Compartment with empty title without crashing', async () => {
    await act(async () => {
      render(<Compartment text='' />);
    });
  });

  it('renders NodeField without crashing', async () => {
    await act(async () => {
      render(<NodeField data={{ label: 'Test' }} />);
    });
  });

  it('renders NodeShape without crashing', async () => {
    await act(async () => {
      render(<NodeShape data={{ label: 'Test' }} />);
    });
  });

  it('renders Default without crashing', async () => {
    await act(async () => {
      render(<Default data={{ label: 'Test' }} />);
    });
  });

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
  });
});
