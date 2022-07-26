import { expect } from 'chai';
import { Resource, urls, Store } from './index';

describe('Store', () => {
  it('renders the populate value', async () => {
    const store = new Store();
    const subject = 'https://atomicdata.dev/test';
    const testval = 'Hi world';
    const newResource = new Resource(subject);
    newResource.setUnsafe(urls.properties.description, testval);
    store.addResource(newResource);
    const gotResource = store.getResourceLoading(subject);
    const atomString = gotResource.get(urls.properties.description).toString();
    expect(atomString).to.equal(testval);
  });
});
