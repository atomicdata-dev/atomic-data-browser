import { expect } from 'chai';
import { urls } from '../helpers/urls';
import { Datatype, validate } from './datatypes';

describe('Datatypes', () => {
  it('throws errors when datatypes dont match values', async () => {
    const string = 'valid string';
    const int = 5;
    const float = 1.13;
    const slug = 'sl-ug';
    const atomicUrl = urls.classes.class;
    expect(() => validate(string, Datatype.STRING), 'Valid string').to.not.throw();
    expect(() => validate(int, Datatype.STRING), 'Invalid string, number').to.throw();
    expect(() => validate(float, Datatype.STRING), 'Invalid string, number').to.throw();

    expect(() => validate(atomicUrl, Datatype.ATOMIC_URL), 'Valid AtomicUrl').to.not.throw();
    expect(() => validate(string, Datatype.ATOMIC_URL)).to.throw();

    expect(() => validate(int, Datatype.INTEGER), 'Valid Integer').to.not.throw();
    expect(() => validate(float, Datatype.ATOMIC_URL)).to.throw();
    expect(() => validate(string, Datatype.ATOMIC_URL)).to.throw();

    expect(() => validate(slug, Datatype.SLUG), 'Valid slug').to.not.throw();
    expect(() => validate(float, Datatype.ATOMIC_URL)).to.throw();
    expect(() => validate(string, Datatype.ATOMIC_URL)).to.throw();
    expect(() => validate(int, Datatype.ATOMIC_URL)).to.throw();
  });
});
