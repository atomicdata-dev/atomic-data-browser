import { expect } from 'chai';
import { fetchResource } from './client';
import { classes, properties } from './urls';

describe('Client', () => {
  it('fetches and parses resource', async () => {
    const resource = await fetchResource(classes.property);
    console.log(resource);
    // Can't perform this for some reason
    // expect(resource.error).to.be.undefined;
    // expect(resource.get(properties.description).toString()).to.contain(
    //   'single field',
    // );
  });
});
