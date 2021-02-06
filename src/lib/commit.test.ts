import { expect } from 'chai';
import { CommitBuilder, serializeDeterministically, signAt } from './commit';

describe('Commit', () => {
  it('signs a commit with the right signature', async () => {
    const privateKey =
      'MFMCAQEwBQYDK2VwBCIEIItEZm3wbIpx7qK/+UPT2DqsZWwsD50M3QDLyTwPGVKEoSMDIQAivODlyb+pfdNQGbu7EJ2w3f8+2suBNenGNsE8KsI6pA==';
    const agentSubject = 'http://localhost/agents/Irzg5cm/qX3TUBm7uxCdsN3/PtrLgTXpxjbBPCrCOqQ=';
    const subject = 'https://localhost/new_thing';
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
});
