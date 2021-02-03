import { expect } from 'chai';
import { fetchResource } from './client';

describe('Client', () => {
  it('fetches and parses resource', async () => {
    const resource = await fetchResource('https://atomicdata.dev/classes/Property');
    expect(resource.get('https://atomicdata.dev/properties/description').toString()).to.contain('description of something.');
  });
});
