import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Root } from './index';

describe('<App>', () => {
  it('renders the populate value', async () => {
    const { findByText } = render(<Root />);
    const linkElement = await findByText(/myVal/i);
    expect(document.body.contains(linkElement));
  });
});
