import { useStore } from '@tomic/react';
import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaSignal } from 'react-icons/fa';
import styled from 'styled-components';
import { useSettings } from '../../helpers/AppSettings';

export function WSIndicator() {
  const store = useStore();
  const { drive } = useSettings();

  const [websocketConnected, setWebsocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const ws = store.getDefaultWebSocket();
    setWebsocketConnected(ws?.readyState === WebSocket.OPEN);

    const listener = (socket: WebSocket) => {
      setWebsocketConnected(socket.readyState === WebSocket.OPEN);
    };

    ws?.addEventListener('open', listener as any);

    return () => {
      ws?.removeEventListener('open', listener as any);
    };
  }, [drive]);

  return (
    <>
      <IconWrapper connected={websocketConnected}>
        {websocketConnected ? (
          <FaSignal title='Websocket connected' />
        ) : (
          <FaExclamationTriangle title='Websocket disconnected' />
        )}
      </IconWrapper>
      {!websocketConnected && <Warning>Websocket Disconnected</Warning>}
    </>
  );
}

interface IconWrapperProps {
  connected: boolean;
}

const IconWrapper = styled.div<IconWrapperProps>`
  display: contents;
  color: ${p => (p.connected ? '#62ad62' : 'orange')};
  font-size: 1.3rem;
`;

const Warning = styled.span`
  color: orange;
`;
