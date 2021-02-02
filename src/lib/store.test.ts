import { expect } from 'chai';
import { Store } from './store';

describe('Store', () => {
  it('renders the populate value', async () => {
    const store = new Store('base_url');
    store.populate();
    const resource = await store.getResource('mySubject');
    const atomString = resource.get('myProp').toString();
    expect(atomString).to.equal('myVal');
  });
});
