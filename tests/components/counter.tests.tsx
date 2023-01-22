import { getByTestId, render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import { Counter } from '#client/components/counter';

describe('Counter', () => {
  // it('increments value', async () => {
  //   const { queryByRole, unmount } = render(() => <Counter />);
  //   const button = (await queryByRole('button')) as HTMLButtonElement;
  //   // expect(button).toBeInTheDocument();
  //   // expect(button).toHaveTextContent(/Clicks: 0/);
  //   // fireEvent.click(button);
  //   // expect(button).toHaveTextContent(/Clicks: 1/);
  //   unmount();
  // });
  it('should render', () => {
    const { container, unmount } = render(() => <Counter />);
    expect(container).toMatchSnapshot();
    expect(getByTestId(container, 'counter')).toHaveTextContent('Counter');
    //expect(container).toHaveBeenCalled()
    unmount();
  });
});