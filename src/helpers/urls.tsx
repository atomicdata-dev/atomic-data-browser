export const classes = {
  agent: 'https://atomicdata.dev/classes/Agent',
  collection: 'https://atomicdata.dev/classes/Collection',
  commit: 'https://atomicdata.dev/classes/Commit',
  class: 'https://atomicdata.dev/classes/Class',
  property: 'https://atomicdata.dev/classes/Property',
  datatype: 'https://atomicdata.dev/classes/Datatype',
};

export const properties = {
  shortname: 'https://atomicdata.dev/properties/shortname',
  description: 'https://atomicdata.dev/properties/description',
  recommends: 'https://atomicdata.dev/properties/recommends',
  requires: 'https://atomicdata.dev/properties/requires',
  name: 'https://atomicdata.dev/properties/name',
  classType: 'https://atomicdata.dev/properties/classtype',
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
  datatype: 'https://atomicdata.dev/properties/datatype',
  isA: 'https://atomicdata.dev/properties/isA',
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

export const urls = {
  properties,
  classes,
  datatypes,
};
