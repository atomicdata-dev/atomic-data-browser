import { expect } from 'chai';
import { Agent } from './agent';

describe('Agent', () => {
  it('Constructs valid ', async () => {
    const validPrivateKey = 'CapMWIhFUT+w7ANv9oCPqrHrwZpkP2JhzF9JnyT6WcI=';
    const validSubject = 'https://atomicdata.dev/agents/PLwTOXVvQdHYpaLEq5IozLNeUBdXMVchKjFwFfamBlo=';
    const validAgent = () => new Agent(validSubject, validPrivateKey);
    expect(validAgent).not.to.throw();
    // Can't get this to throw yet
    // const invalidAgentSignature = () => new Agent(validSubject, 'ugh');
    // expect(invalidAgentSignature).to.throw();
    const invalidAgentUrl = () => new Agent('not_a_url', validPrivateKey);
    expect(invalidAgentUrl).to.throw();
  });
});
