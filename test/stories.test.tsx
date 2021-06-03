import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// import { Cards } from '../stories/Cards.stories';

describe('Cards.stories', () => {
  // DOES NOT WORK (jsdom doesn't support some svg apis)
  // it('renders without crashing', async () => {
  //   await act(async () => {
  //     render(
  //         <Cards {...Cards.args} />
  //     );
  //   });
  // });
  it('does nothing', async () => {
    await act(async () => {
      render(<div />);
    });
  });
});
