import { expect } from 'chai';
import { Store } from './store';

describe('Store', () => {
  it('renders the populate value', async () => {
    const store = new Store('base_url');
    store.populate();
    const resource = await store.getResource('https://atomicdata.dev/test');
    const atomString = resource.get('https://atomicdata.dev/properties/shortname').toString();
    expect(atomString).to.equal('value-from-populate');
  });
});
