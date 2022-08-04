import { classes, useStore } from '@tomic/react';
import React from 'react';
import { NewBookmarkButton } from './NewBookmarkButton';
import { NewInstanceButtonProps } from './NewInstanceButtonProps';
import { NewInstanceButtonDefault } from './NewInstanceButtonDefault';

type InstanceButton = (props: NewInstanceButtonProps) => JSX.Element;

/** If your New Instance button requires custom logic, such as a custom dialog */
const classMap = new Map<string, InstanceButton>([
  [classes.bookmark, NewBookmarkButton],
]);

/** A button for creating a new instance of some thing */
export default function NewInstanceButton(
  props: NewInstanceButtonProps,
): JSX.Element {
  const store = useStore();
  const { klass, parent } = props;

  const Comp = classMap.get(klass) ?? NewInstanceButtonDefault;

  return <Comp {...props} parent={parent ?? store.getAgent()?.subject} />;
}
