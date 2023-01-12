import React, { useRef } from 'react';
import styled from 'styled-components';
import { DropdownPortalContext } from './dropdownContext';

export const DropdownContainer: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const portalRef = useRef<HTMLDivElement>(null);

  return (
    <DropdownPortalContext.Provider value={portalRef}>
      {children}
      <StyledDiv ref={portalRef}></StyledDiv>
    </DropdownPortalContext.Provider>
  );
};

const StyledDiv = styled.div`
  display: contents;
`;
