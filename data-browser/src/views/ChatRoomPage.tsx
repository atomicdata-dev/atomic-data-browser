import {
  classes,
  getTimestampNow,
  properties,
  Resource,
  useArray,
  useDate,
  useResource,
  useStore,
  useString,
  useTitle,
} from '@tomic/react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Button } from '../components/Button';
import DateTime from '../components/datatypes/DateTime';
import Parent from '../components/Parent';
import { ErrorLook } from './ResourceInline';
import { ResourcePageProps } from './ResourcePage';

/** Full page ChatRoom that shows a message list and a form to add Messages. */
export function ChatRoomPage({ resource }: ResourcePageProps) {
  const title = useTitle(resource);
  const [messages] = useArray(resource, properties.chatRoom.messages);
  const [newMessageVal, setNewMessage] = useState('');
  const store = useStore();
  const ref = useRef(null);

  useEffect(scrollToBottom, [messages.length, resource]);

  function scrollToBottom() {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }

  const disableSend = newMessageVal.length === 0;

  /** Creates a message using the internal state */
  async function addMessage(e) {
    try {
      e.preventDefault();
      if (!disableSend) {
        const subject = store.createSubject('messages');
        const msgResource = new Resource(subject, true);
        await msgResource.set(
          properties.parent,
          resource.getSubject(),
          store,
          false,
        );
        await msgResource.set(properties.isA, [classes.message], store, false);
        await msgResource.set(
          properties.description,
          newMessageVal,
          store,
          false,
        );
        await msgResource.set(
          properties.commit.createdAt,
          getTimestampNow(),
          store,
          false,
        );
        await msgResource.save(store);
        setNewMessage('');
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <FullPageWrapper about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      {store.webSocket.readyState == WebSocket.CLOSED && (
        <ErrorLook>Closed websocket!</ErrorLook>
      )}
      <ScrollingContent ref={ref}>
        <MessagesPage subject={resource.getSubject()} />
      </ScrollingContent>
      <MessageForm onSubmit={addMessage}>
        <MessageInput
          autoFocus
          value={newMessageVal}
          onChange={e => setNewMessage(e.target.value)}
          placeholder={'type a message'}
        />
        <SendButton
          title='Send message [enter]'
          disabled={disableSend}
          clean
          onClick={addMessage}
        >
          Send
        </SendButton>
      </MessageForm>
    </FullPageWrapper>
  );
}

interface MessageProps {
  subject: string;
}

/** Single message shown in a ChatRoom */
function Message({ subject }: MessageProps) {
  const resource = useResource(subject);
  const [description] = useString(resource, properties.description);
  const createdAt = useDate(resource, properties.commit.createdAt);

  return (
    <MessageComponent>
      <MessageHeader>
        {'Creator - '}
        <DateTime date={createdAt} />
      </MessageHeader>
      {description}
    </MessageComponent>
  );
}

const MessageComponent = styled.p`
  min-height: 1.5rem;
`;

/** Small row on top of Message for details such as date and creator */
const MessageHeader = styled.div`
  font-size: 0.7rem;
  margin-bottom: 0;
  opacity: 0.4;
`;

const SendButton = styled(Button)`
  padding-left: 1rem;
  padding-right: 1rem;
  color: ${p => p.theme.colors.bg};
  background: ${p => p.theme.colors.main};

  &:disabled {
    cursor: default;
    display: auto;
    opacity: 0.5;
  }
`;

const MessageInput = styled.input`
  color: ${p => p.theme.colors.text};
  background: none;
  flex: 1;
  padding: 0.5rem 1rem;
  border: ${p => p.theme.colors.bg2} solid 1px;
  border-right: none;
`;

/** Wrapper for the new message form */
const MessageForm = styled.form`
  display: flex;
  flex-basis: 3rem;
  flex-direction: row;
  border-radius: ${p => p.theme.radius};
  background: ${p => p.theme.colors.bg};

  > :first-child {
    border-top-left-radius: ${p => p.theme.radius};
    border-bottom-left-radius: ${p => p.theme.radius};
  }
  > :last-child {
    border-top-right-radius: ${p => p.theme.radius};
    border-bottom-right-radius: ${p => p.theme.radius};
  }
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

interface MessagesPageProps {
  subject: string;
  noChilds?: boolean;
}

/** Shows only Messages for the Next Page */
function MessagesPage({ subject, noChilds }: MessagesPageProps) {
  const resource = useResource(subject);
  const [messages] = useArray(resource, properties.chatRoom.messages);
  const [nextPage] = useString(resource, properties.chatRoom.nextPage);

  return (
    <>
      {!noChilds && nextPage && <MessagesPage subject={nextPage} />}
      {messages.map(message => (
        <Message key={'message' + message} subject={message} />
      ))}
    </>
  );
}
