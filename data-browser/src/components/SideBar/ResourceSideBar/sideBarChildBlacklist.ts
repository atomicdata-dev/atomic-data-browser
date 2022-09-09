import { urls } from '@tomic/lib';

/**
 * These should not show a collapse/dropdown with their children when rendered
 * inside the sidebar
 */
export const sideBarChildBlacklist = new Set([
  urls.classes.chatRoom,
  urls.classes.document,
  urls.classes.collection,
]);
