import { properties, Resource, urls } from '@tomic/lib';
import { useResource, useStore } from '@tomic/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ErrorLook } from '../views/ResourceInline';
import { Button } from './Button';
import { Card } from './Card';
import { CodeBlock } from './CodeBlock';
import InputBoolean from './forms/InputBoolean';
import ResourceField from './forms/ResourceField';

interface InviteFormProps {
  /** The resource that becomes accessible on opening the invite */
  target: Resource;
}

/**
 * Allows the user to create a new Invite for some resource. Outputs the
 * generated Subject after saving.
 */
export function InviteForm({ target }: InviteFormProps) {
  const invite = useResource(null, { newResource: true });
  const store = useStore();
  const [err, setErr] = useState<Error>(null);
  const [createdSubject, setCreatedSubject] = useState<string>(null);

  /** Stores the Invite, sends it to the server, shows the Subject to the User */
  async function createInvite() {
    await invite.set(properties.isA, [urls.classes.invite], store);
    await invite.set(properties.read, [urls.instances.publicAgent], store);
    await invite.set(properties.invite.target, target.getSubject(), store);
    invite.setSubject(store.createSubject('invite'));
    try {
      await invite.set(
        properties.parent,
        `${store.getServerUrl()}/invites`,
        store,
      );
      await invite.save(store);
      navigator.clipboard.writeText(invite.getSubject());
      toast.success('Copied to clipboard');
      setCreatedSubject(invite.getSubject());
    } catch (e) {
      setErr(e);
    }
  }

  if (invite.new) {
    return (
      <Card>
        <ResourceField
          propertyURL={urls.properties.invite.usagesLeft}
          resource={invite}
        />
        <ResourceField
          propertyURL={urls.properties.description}
          resource={invite}
        />
        <ResourceField
          propertyURL={urls.properties.invite.write}
          resource={invite}
        />
        <Button onClick={createInvite}>Create Invite</Button>
        {err && (
          <p>
            <ErrorLook>{err.message}</ErrorLook>
          </p>
        )}
      </Card>
    );
  } else
    return (
      <Card>
        <p>Invite created and copied to clipboard! Send it to your buddy:</p>
        <CodeBlock content={createdSubject} data-test='invite-code' />
      </Card>
    );
}
