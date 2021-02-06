import { expect } from 'chai';
import { CommitBuilder, serializeDeterministically, signAt, signToBase64 } from './commit';

describe('Commit', () => {
  const privateKey = 'MFMCAQEwBQYDK2VwBCIEIItEZm3wbIpx7qK/+UPT2DqsZWwsD50M3QDLyTwPGVKEoSMDIQAivODlyb+pfdNQGbu7EJ2w3f8+2suBNenGNsE8KsI6pA==';
  const agentSubject = 'http://localhost/agents/Irzg5cm/qX3TUBm7uxCdsN3/PtrLgTXpxjbBPCrCOqQ=';
  const subject = 'https://localhost/new_thing';

  it('signs a commit with the right signature', async () => {
    const createdAt = 0;
    const commitbuilder: CommitBuilder = {
      subject,
      set: {
        'https://atomicdata.dev/properties/description': 'Some value',
        'https://atomicdata.dev/properties/shortname': 'someval',
      },
    };
    const commit = await signAt(commitbuilder, agentSubject, privateKey, createdAt);
    expect(
      serializeDeterministically(commit),
      '"createdAt":0,"set":{"https://atomicdata.dev/properties/description":"Some value","https://atomicdata.dev/properties/shortname":"someval"},"signer":"http://localhost/agents/Irzg5cm/qX3TUBm7uxCdsN3/PtrLgTXpxjbBPCrCOqQ=","subject":"https://localhost/new_thing"}',
    );
    expect(commit.signature).to.equal('Nmyp7gmLhf5GZw2mCOXjXqfsSDeA4GIiYFQh2P/0xsJENwetnzmDDA1lUyzr9mpc32JxIzCVEgTsyi2GzK/ACQ==');
  });

  it('signs any string correctly', async () => {
    // const hexPrivateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    const input = 'val';
    const signature = await signToBase64(input, privateKey);
    expect(signature).to.equal('+RVIN+DVu6khCAo8M+BE2IrS9HT+L89I2b5YDC+AddTwPNiaYX6wQX+ANZVSIblMKYUiy9l0QxS3j7UvlYYRAg==');
  });
});
