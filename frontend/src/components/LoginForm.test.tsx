import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

function setup() {
  const route = '/some-route';
  const utils = render(
    <MemoryRouter initialEntries={[route]}>
      <LoginForm />
    </MemoryRouter>,
  );
  const user = { username: 'michelle', password: 'smith' };
  const changeUsernameInput = (value) => userEvent.type(utils.getByLabelText(/username/i), value);
  const changePasswordInput = (value) => userEvent.type(utils.getByLabelText(/password/i), value);
  const clickSubmit = () => userEvent.click(utils.getByText(/submit/i));
  return {
    ...utils,
    user,
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
  };
}

it('should render a sign in button', () => {
  const { getByRole } = setup();
  expect(getByRole('button')).toHaveTextContent(/Sign In/i);
});
