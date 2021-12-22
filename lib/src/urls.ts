export const classes = {
  /** Collection of all the AtomicData.dev classes */
  getAll: 'https://atomicdata.dev/classes/?page_size=999',
  agent: 'https://atomicdata.dev/classes/Agent',
  collection: 'https://atomicdata.dev/classes/Collection',
  commit: 'https://atomicdata.dev/classes/Commit',
  class: 'https://atomicdata.dev/classes/Class',
  document: 'https://atomicdata.dev/classes/Document',
  elements: {
    paragraph: 'https://atomicdata.dev/classes/elements/Paragraph',
  },
  property: 'https://atomicdata.dev/classes/Property',
  datatype: 'https://atomicdata.dev/classes/Datatype',
  endpoint: 'https://atomicdata.dev/classes/Endpoint',
  drive: 'https://atomicdata.dev/classes/Drive',
  redirect: 'https://atomicdata.dev/classes/Redirect',
  invite: 'https://atomicdata.dev/classes/Invite',
  file: 'https://atomicdata.dev/classes/File',
};

export const properties = {
  /** Collection of all the AtomicData.dev properties */
  getAll: 'https://atomicdata.dev/properties/?page_size=999',
  shortname: 'https://atomicdata.dev/properties/shortname',
  description: 'https://atomicdata.dev/properties/description',
  recommends: 'https://atomicdata.dev/properties/recommends',
  requires: 'https://atomicdata.dev/properties/requires',
  name: 'https://atomicdata.dev/properties/name',
  classType: 'https://atomicdata.dev/properties/classtype',
  createdBy: 'https://atomicdata.dev/properties/createdBy',
  incomplete: 'https://atomicdata.dev/properties/incomplete',
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
    signer: 'https://atomicdata.dev/properties/signer',
    set: 'https://atomicdata.dev/properties/set',
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
  datatype: 'https://atomicdata.dev/properties/datatype',
  isA: 'https://atomicdata.dev/properties/isA',
  isDynamic: 'https://atomicdata.dev/properties/isDynamic',
  parent: 'https://atomicdata.dev/properties/parent',
  read: 'https://atomicdata.dev/properties/read',
  write: 'https://atomicdata.dev/properties/write',
  children: 'https://atomicdata.dev/properties/children',
  paymentPointer: 'https://atomicdata.dev/properties/paymentPointer',
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
};

export const urls = {
  properties,
  classes,
  datatypes,
  instances,
};
