import * as React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import App from './App'

describe('<App>', () => {
  it('renders the populate value', () => {
    const { getByText } = render(<App />)
    const linkElement = getByText(/myVal/i)
    expect(document.body.contains(linkElement))
  })
})
