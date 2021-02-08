import { expect } from 'chai';
import { urls } from '../helpers/urls';
import { Resource } from './resource';
import { Store } from './store';
import { Value } from './value';

describe('Store', () => {
  it('renders the populate value', async () => {
    const store = new Store('base_url');
    const subject = 'https://atomicdata.dev/test';
    const testval = 'Hi world';
    const newResource = new Resource(subject);
    newResource.setUnsafe(urls.properties.description, new Value(testval));
    store.addResource(newResource);
    const gotResource = store.getResource(subject);
    const atomString = gotResource.get(urls.properties.description).toString();
    expect(atomString).to.equal(testval);
  });
});
