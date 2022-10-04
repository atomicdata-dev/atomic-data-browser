import { classes } from '@tomic/react';
import { IconType } from 'react-icons';
import {
  FaAtom,
  FaBook,
  FaClock,
  FaComment,
  FaFile,
  FaFileAlt,
  FaFolder,
  FaHdd,
} from 'react-icons/fa';

const iconMap = new Map<string, IconType>([
  [classes.folder, FaFolder],
  [classes.bookmark, FaBook],
  [classes.chatRoom, FaComment],
  [classes.document, FaFileAlt],
  [classes.file, FaFile],
  [classes.drive, FaHdd],
  [classes.commit, FaClock],
]);

export function getIconForClass(
  classSubject: string,
  fallback: IconType = FaAtom,
): IconType {
  return iconMap.get(classSubject) ?? fallback;
}
