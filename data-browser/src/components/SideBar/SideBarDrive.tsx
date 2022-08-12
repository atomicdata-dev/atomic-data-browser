import { useResource, useTitle } from '@tomic/react';
import React from 'react';
import { FaServer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSettings } from '../../helpers/AppSettings';
import { constructOpenURL } from '../../helpers/navigation';
import { paths } from '../../routes/paths';
import { ErrorLook } from '../../views/ResourceInline';
import { Button } from '../Button';
import { ResourceSideBar } from './ResourceSideBar/ResourceSideBar';
import { SignInButton } from '../SignInButton';
import { SideBarHeader } from './SideBarHeader';
import { useChildren } from '../../hooks/useChildren';

interface SideBarDriveProps {
  /** Closes the sidebar on small screen devices */
  handleClickItem: () => unknown;
}

/** Shows the current Drive, it's children and an option to change to a different Drive */
export function SideBarDrive({
  handleClickItem,
}: SideBarDriveProps): JSX.Element {
  const { baseURL } = useSettings();
  const { agent } = useSettings();
  const drive = useResource(baseURL);
  const children = useChildren(baseURL);
  const title = useTitle(drive);
  const navigate = useNavigate();

  return (
    <>
      <SideBarHeader>
        <Button
          clean
          title={`Your current baseURL is ${baseURL}`}
          data-test='sidebar-drive-open'
          onClick={() => {
            handleClickItem();
            navigate(constructOpenURL(baseURL));
          }}
          style={{ flex: 1, textAlign: 'left' }}
        >
          <DriveTitle data-test='current-drive-title'>
            {title || baseURL}{' '}
          </DriveTitle>
        </Button>
        <Button
          onClick={() => navigate(paths.serverSettings)}
          icon
          subtle
          title={'Set a different Server'}
          data-test='sidebar-drive-edit'
        >
          <FaServer />
        </Button>
      </SideBarHeader>
      <ListWrapper>
        {drive.isReady() ? (
          children.map(child => {
            return (
              <ResourceSideBar
                key={child}
                subject={child}
                handleClose={handleClickItem}
              />
            );
          })
        ) : drive.loading ? null : (
          <SideBarErr>
            {drive.error ? (
              drive.isUnauthorized() ? (
                agent ? (
                  'unauthorized'
                ) : (
                  <SignInButton />
                )
              ) : (
                drive.error.message
              )
            ) : (
              'this should not happen'
            )}
          </SideBarErr>
        )}
      </ListWrapper>
    </>
  );
}

const DriveTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 1.4rem;
  flex: 1;
`;

const SideBarErr = styled(ErrorLook)`
  padding-left: ${props => props.theme.margin}rem;
`;

const ListWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 0.5rem;
`;
