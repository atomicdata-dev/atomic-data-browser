import { expect } from 'chai';
import { urls } from './urls';
import { Datatype, validate } from './datatypes';

describe('Datatypes', () => {
  it('throws errors when datatypes dont match values', async () => {
    const string = 'valid string';
    const int = 5;
    const float = 1.13;
    const slug = 'sl-ug';
    const atomicUrl = urls.classes.class;
    const resourceArray = [urls.classes.class, urls.classes.property];
    const resourceArrayInvalid = [urls.classes.class, 'urls.classes.property'];
    expect(() => validate(string, Datatype.STRING), 'Valid string').to.not.throw();
    expect(() => validate(int, Datatype.STRING), 'Invalid string, number').to.throw();
    expect(() => validate(float, Datatype.STRING), 'Invalid string, number').to.throw();

    expect(() => validate(atomicUrl, Datatype.ATOMIC_URL), 'Valid AtomicUrl').to.not.throw();
    expect(() => validate(string, Datatype.ATOMIC_URL), 'Invalid AtomicUrl, string').to.throw();

    expect(() => validate(int, Datatype.INTEGER), 'Valid Integer').to.not.throw();
    expect(() => validate(float, Datatype.INTEGER), 'Invalid Integer, string').to.throw();
    expect(() => validate(string, Datatype.INTEGER), 'Invalid Integer, float').to.throw();

    expect(() => validate(slug, Datatype.SLUG), 'Valid slug').to.not.throw();
    expect(() => validate(float, Datatype.SLUG)).to.throw();
    expect(() => validate(string, Datatype.SLUG)).to.throw();
    expect(() => validate(int, Datatype.SLUG)).to.throw();

    expect(() => validate(resourceArray, Datatype.RESOURCEARRAY)).to.not.throw();
    expect(() => validate(resourceArrayInvalid, Datatype.RESOURCEARRAY)).to.throw();
    expect(() => validate(float, Datatype.RESOURCEARRAY)).to.throw();
    expect(() => validate(string, Datatype.RESOURCEARRAY)).to.throw();
    expect(() => validate(int, Datatype.RESOURCEARRAY)).to.throw();
  });
});
