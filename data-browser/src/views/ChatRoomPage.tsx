import {
  classes,
  getTimestampNow,
  properties,
  Resource,
  useArray,
  useResource,
  useStore,
  useString,
  useTitle,
} from '@tomic/react';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ContainerNarrow } from '../components/Containers';
import Parent from '../components/Parent';
import { ResourcePageProps } from './ResourcePage';

/** Full page ChatRoom that shows a message list and a form to add Messages. */
export function ChatRoomPage({ resource }: ResourcePageProps) {
  const title = useTitle(resource);
  const [messages] = useArray(resource, properties.chatRoom.messages);
  const [newMessageVal, setNewMessage] = useState('');
  const store = useStore();

  async function addMessage() {
    const subject = store.createSubject(classes.message);
    const msgResource = new Resource(subject, true);
    await msgResource.set(
      properties.parent,
      resource.getSubject(),
      store,
      false,
    );
    await msgResource.set(properties.isA, [classes.message], store, false);
    await msgResource.set(properties.description, newMessageVal, store, false);
    await msgResource.set(
      properties.commit.createdAt,
      getTimestampNow(),
      store,
      false,
    );
    await msgResource.save(store);
    setNewMessage('');
    store.fetchResource(resource.getSubject());
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <p>Messages:</p>
      {messages &&
        messages.map(message => <Message key={message} subject={message} />)}
      <form onSubmit={addMessage}>
        <input
          value={newMessageVal}
          onChange={e => setNewMessage(e.target.value)}
        />
        <Button onClick={addMessage}>Send</Button>
      </form>
    </ContainerNarrow>
  );
}

interface MessageProps {
  subject: string;
}

/** Single message shown in a ChatRoom */
function Message({ subject }: MessageProps) {
  const resource = useResource(subject);
  const description = useString(resource, properties.description);

  return <p>{description}</p>;
}
