import { expect } from 'chai';
import { Datatype } from './datatypes';
import { Value } from './value';

describe('Value', () => {
  it('to native ', async () => {
    const resourceArray = new Value([
      'https://example.com/test',
      'https://example.com/test',
    ]);
    const native = resourceArray.toNative(Datatype.RESOURCEARRAY) as [];
    expect(native.length).to.equal(2);
  });
});
