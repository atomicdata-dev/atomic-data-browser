import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
// import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders resource after clicking on fetch', async () => {
    const { getByText } = render(<App />);
    // fireEvent.click(getByText('List of Classes'));
    // const linkElement = await findByText(/recommends/i);
    // expect(document.body.contains(linkElement));
    // fireEvent.click(getByTitle('Create a new Resource"'));
    // fireEvent.click(getByText('Create a class'));
  });
});
