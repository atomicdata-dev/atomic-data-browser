import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders the populate value', async () => {
    const { findByText } = render(<App />);
    const linkElement = await findByText(/myVal/i);
    expect(document.body.contains(linkElement));
  });
});
