import { handleGraphEvent } from '../src/components/diagram/layout/yoga';
import { event } from './node.mock';

describe('Yoga layout', () => {
  it('handles add root node event correctly', async () => {
    const e = event(0, 'some shape');
    const changed = handleGraphEvent(e, 'add', {} as any);
    expect(changed.size).toBe(1);
  });
});
