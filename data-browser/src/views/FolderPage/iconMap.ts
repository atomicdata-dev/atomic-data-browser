import { classes } from '@tomic/react';
import { IconType } from 'react-icons';
import { FaBook, FaComment, FaFile, FaFileAlt, FaFolder } from 'react-icons/fa';

export const iconMap = new Map<string, IconType>([
  [classes.folder, FaFolder],
  [classes.bookmark, FaBook],
  [classes.chatRoom, FaComment],
  [classes.document, FaFileAlt],
  [classes.file, FaFile],
]);
