import React from 'react';
import { render } from '@testing-library/react';
import HelloWorld from './index';

test('renders HelloWorld component', () => {
  const { getByText } = render(<HelloWorld />);
  expect(getByText('Hello from Open-Socket React SDK!')).toBeInTheDocument();
});
