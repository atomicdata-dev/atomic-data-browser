import {
  Resource,
  urls,
  useArray,
  useResource,
  useResources,
} from '@tomic/react';
import { useSettings } from '../helpers/AppSettings';

export function useUserDrives(): Map<string, Resource> {
  const { agent } = useSettings();
  const agentResource = useResource(agent?.subject);
  const [driveSubjects] = useArray(agentResource, urls.properties.drives);
  const drives = useResources(driveSubjects);

  return drives;
}
