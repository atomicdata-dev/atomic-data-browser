import { expect } from 'chai'
import { Store } from './store'

describe('<App>', () => {
  it('renders the populate value', () => {
    const store = new Store('base_url')
    store.populate()
    let resource = store.getResource('mySubject')
    expect(resource.get('myProp').toString() == 'myVal')
  })
})
