import { handleGraphEvent } from '../components/diagram/layout/yoga';
import { event } from './node.mock';

describe('Yoga layout', () => {
  it('handles add root node event correctly', async () => {
    const e = event(0, 'some shape');
    const changed = handleGraphEvent(e, 'add');
    expect(changed.size).toBe(1);
  });
});
