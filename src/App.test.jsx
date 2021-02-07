import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders resource after clicking on fetch', async () => {
    const { findByText, getByText } = render(<App />);
    fireEvent.click(getByText('atomicdata.dev'));
    const linkElement = await findByText(/requires/i);
    expect(document.body.contains(linkElement));
  });
});
