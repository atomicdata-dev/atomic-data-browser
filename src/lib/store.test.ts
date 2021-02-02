import { expect } from 'chai';
import { Store } from './store';

describe('<App>', () => {
  it('renders the populate value', () => {
    const store = new Store('base_url');
    store.populate();
    const resource = store.getResource('mySubject');
    const atomString = resource.get('myProp').toString();
    expect(atomString).to.equal('myVal');
  });
});
