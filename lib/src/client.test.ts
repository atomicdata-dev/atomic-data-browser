import { expect } from 'chai';
import { fetchResource } from './client';
import { classes, properties } from './urls';
import 'whatwg-fetch';

describe('Client', () => {
  it('fetches and parses resource', async () => {
    const resource = await fetchResource(classes.property);
    expect(resource.get(properties.description).toString()).to.contain('single field');
  });
});
