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
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../components/Button';
import Parent from '../components/Parent';
import { ResourcePageProps } from './ResourcePage';

/** Full page ChatRoom that shows a message list and a form to add Messages. */
export function ChatRoomPage({ resource }: ResourcePageProps) {
  const title = useTitle(resource);
  const [messages] = useArray(resource, properties.chatRoom.messages);
  const [newMessageVal, setNewMessage] = useState('');
  const store = useStore();
  const ref = useRef(null);

  useEffect(scrollToBottom, [messages.length]);

  function scrollToBottom() {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }

  /** Creates a message using the internal state */
  async function addMessage(e) {
    e.preventDefault();
    const subject = store.createSubject('messages');
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
  }

  return (
    <FullPageWrapper about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <ScrollingContent ref={ref}>
        {messages &&
          messages.map(message => (
            <Message key={'message' + message} subject={message} />
          ))}
      </ScrollingContent>
      <form onSubmit={addMessage}>
        <MessageInput
          autoFocus
          value={newMessageVal}
          onChange={e => setNewMessage(e.target.value)}
          placeholder={'type a message'}
        />
        <Button onClick={addMessage}>Send</Button>
      </form>
    </FullPageWrapper>
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

const MessageInput = styled.input`
  height: 2rem;
`;

const FullPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* I think this warrants a prettier solution */
  height: calc(100vh - 4rem);
  padding: 1rem;
  flex: 1;
`;

const ScrollingContent = styled.div`
  overflow-y: scroll;
  flex: 1;
`;
