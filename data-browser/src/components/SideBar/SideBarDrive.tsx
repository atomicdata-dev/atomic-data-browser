import { urls, useArray, useResource, useTitle } from '@tomic/react';
import React from 'react';
import { FaPlus, FaServer } from 'react-icons/fa';
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
import { shortcuts } from '../HotKeyWrapper';

interface SideBarDriveProps {
  /** Closes the sidebar on small screen devices */
  handleClickItem: () => unknown;
}

/** Shows the current Drive, it's children and an option to change to a different Drive */
export function SideBarDrive({
  handleClickItem,
}: SideBarDriveProps): JSX.Element {
  const { drive, agent } = useSettings();
  const driveResource = useResource(drive);
  const [subResources] = useArray(driveResource, urls.properties.subResources);
  const title = useTitle(driveResource);
  const navigate = useNavigate();

  return (
    <>
      <SideBarHeader>
        <TitleButton
          clean
          title={`Your current baseURL is ${drive}`}
          data-test='sidebar-drive-open'
          onClick={() => {
            handleClickItem();
            navigate(constructOpenURL(drive));
          }}
        >
          <DriveTitle data-test='current-drive-title'>
            {title || drive}{' '}
          </DriveTitle>
        </TitleButton>
        <Button
          onClick={() => navigate(paths.new)}
          icon
          subtle
          title={`Create a new resource in this drive (${shortcuts.new})`}
          data-test='sidebar-new-resource'
        >
          <FaPlus />
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
        {driveResource.isReady() ? (
          subResources.map(child => {
            return (
              <ResourceSideBar
                key={child}
                subject={child}
                handleClose={handleClickItem}
              />
            );
          })
        ) : driveResource.loading ? null : (
          <SideBarErr>
            {driveResource.error ? (
              driveResource.isUnauthorized() ? (
                agent ? (
                  'unauthorized'
                ) : (
                  <SignInButton />
                )
              ) : (
                driveResource.error.message
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

const TitleButton = styled(Button)`
  text-align: left;
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
