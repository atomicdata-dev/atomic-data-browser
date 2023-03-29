export const classes = {
  agent: 'https://atomicdata.dev/classes/Agent',
  chatRoom: 'https://atomicdata.dev/classes/ChatRoom',
  collection: 'https://atomicdata.dev/classes/Collection',
  commit: 'https://atomicdata.dev/classes/Commit',
  class: 'https://atomicdata.dev/classes/Class',
  document: 'https://atomicdata.dev/classes/Document',
  bookmark: 'https://atomicdata.dev/class/Bookmark',
  elements: {
    paragraph: 'https://atomicdata.dev/classes/elements/Paragraph',
  },
  error: 'https://atomicdata.dev/classes/Error',
  property: 'https://atomicdata.dev/classes/Property',
  datatype: 'https://atomicdata.dev/classes/Datatype',
  endpoint: 'https://atomicdata.dev/classes/Endpoint',
  drive: 'https://atomicdata.dev/classes/Drive',
  redirect: 'https://atomicdata.dev/classes/Redirect',
  invite: 'https://atomicdata.dev/classes/Invite',
  file: 'https://atomicdata.dev/classes/File',
  message: 'https://atomicdata.dev/classes/Message',
  importer: 'https://atomicdata.dev/classes/Importer',
  folder: 'https://atomicdata.dev/classes/Folder',
  article: 'https://atomicdata.dev/classes/Article',
  displayStyle: 'https://atomicdata.dev/class/DisplayStyle',
  displayStyles: {
    grid: 'https://atomicdata.dev/display-style/grid',
    list: 'https://atomicdata.dev/display-style/list',
  },
};

/** List of commonly used Atomic Data Properties. */
export const properties = {
  children: 'https://atomicdata.dev/properties/children',
  classType: 'https://atomicdata.dev/properties/classtype',
  createdBy: 'https://atomicdata.dev/properties/createdBy',
  datatype: 'https://atomicdata.dev/properties/datatype',
  description: 'https://atomicdata.dev/properties/description',
  drives: 'https://atomicdata.dev/properties/drives',
  incomplete: 'https://atomicdata.dev/properties/incomplete',
  isA: 'https://atomicdata.dev/properties/isA',
  isDynamic: 'https://atomicdata.dev/properties/isDynamic',
  name: 'https://atomicdata.dev/properties/name',
  parent: 'https://atomicdata.dev/properties/parent',
  paymentPointer: 'https://atomicdata.dev/properties/paymentPointer',
  read: 'https://atomicdata.dev/properties/read',
  recommends: 'https://atomicdata.dev/properties/recommends',
  requires: 'https://atomicdata.dev/properties/requires',
  shortname: 'https://atomicdata.dev/properties/shortname',
  subResources: 'https://atomicdata.dev/properties/subresources',
  write: 'https://atomicdata.dev/properties/write',
  displayStyle: 'https://atomicdata.dev/property/display-style',
  publishedAt: 'https://atomicdata.dev/properties/published-at',
  agent: {
    publicKey: 'https://atomicdata.dev/properties/publicKey',
  },
  collection: {
    members: 'https://atomicdata.dev/properties/collection/members',
    currentPage: 'https://atomicdata.dev/properties/collection/currentPage',
    pageSize: 'https://atomicdata.dev/properties/collection/pageSize',
    property: 'https://atomicdata.dev/properties/collection/property',
    totalMembers: 'https://atomicdata.dev/properties/collection/totalMembers',
    totalPages: 'https://atomicdata.dev/properties/collection/totalPages',
    value: 'https://atomicdata.dev/properties/collection/value',
  },
  commit: {
    subject: 'https://atomicdata.dev/properties/subject',
    createdAt: 'https://atomicdata.dev/properties/createdAt',
    lastCommit: 'https://atomicdata.dev/properties/lastCommit',
    previousCommit: 'https://atomicdata.dev/properties/previousCommit',
    signer: 'https://atomicdata.dev/properties/signer',
    set: 'https://atomicdata.dev/properties/set',
    push: 'https://atomicdata.dev/properties/push',
    remove: 'https://atomicdata.dev/properties/remove',
    destroy: 'https://atomicdata.dev/properties/destroy',
    signature: 'https://atomicdata.dev/properties/signature',
  },
  document: {
    elements: 'https://atomicdata.dev/properties/documents/elements',
  },
  endpoint: {
    parameters: 'https://atomicdata.dev/properties/endpoint/parameters',
    results: 'https://atomicdata.dev/properties/endpoint/results',
  },
  search: {
    query: 'https://atomicdata.dev/properties/search/query',
    limit: 'https://atomicdata.dev/properties/search/limit',
    property: 'https://atomicdata.dev/properties/search/property',
  },
  redirect: {
    destination: 'https://atomicdata.dev/properties/destination',
    redirectAgent: 'https://atomicdata.dev/properties/invite/redirectAgent',
  },
  invite: {
    agent: 'https://atomicdata.dev/properties/invite/agent',
    publicKey: 'https://atomicdata.dev/properties/invite/publicKey',
    target: 'https://atomicdata.dev/properties/invite/target',
    usagesLeft: 'https://atomicdata.dev/properties/invite/usagesLeft',
    users: 'https://atomicdata.dev/properties/invite/users',
    write: 'https://atomicdata.dev/properties/invite/write',
  },
  file: {
    filename: 'https://atomicdata.dev/properties/filename',
    filesize: 'https://atomicdata.dev/properties/filesize',
    downloadUrl: 'https://atomicdata.dev/properties/downloadURL',
    mimetype: 'https://atomicdata.dev/properties/mimetype',
    attachments: 'https://atomicdata.dev/properties/attachments',
  },
  chatRoom: {
    messages: 'https://atomicdata.dev/properties/messages',
    nextPage: 'https://atomicdata.dev/properties/nextPage',
    replyTo: 'https://atomicdata.dev/properties/replyTo',
  },
  bookmark: {
    url: 'https://atomicdata.dev/property/url',
    preview: 'https://atomicdata.dev/property/preview',
    imageUrl: 'https://atomicdata.dev/properties/imageUrl',
  },
};

export const datatypes = {
  atomicUrl: 'https://atomicdata.dev/datatypes/atomicURL',
  boolean: 'https://atomicdata.dev/datatypes/boolean',
  date: 'https://atomicdata.dev/datatypes/date',
  float: 'https://atomicdata.dev/datatypes/float',
  integer: 'https://atomicdata.dev/datatypes/integer',
  markdown: 'https://atomicdata.dev/datatypes/markdown',
  resourceArray: 'https://atomicdata.dev/datatypes/resourceArray',
  slug: 'https://atomicdata.dev/datatypes/slug',
  string: 'https://atomicdata.dev/datatypes/string',
  timestamp: 'https://atomicdata.dev/datatypes/timestamp',
};

export const instances = {
  publicAgent: 'https://atomicdata.dev/agents/publicAgent',
  displayStyleGrid: 'https://atomicdata.dev/agents/publicAgent',
};

export const endpoints = {
  import: '/import',
};

export const urls = {
  properties,
  endpoints,
  classes,
  datatypes,
  instances,
};
