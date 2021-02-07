export const classes = {
  collection: 'https://atomicdata.dev/classes/Collection',
};

export const properties = {
  shortname: 'https://atomicdata.dev/properties/shortname',
  description: 'https://atomicdata.dev/properties/description',
  recommends: 'https://atomicdata.dev/properties/recommends',
  requires: 'https://atomicdata.dev/properties/requires',
  title: 'https://atomicdata.dev/properties/title',
  collection: {
    members: 'https://atomicdata.dev/properties/collection/members',
    currentPage: 'https://atomicdata.dev/properties/collection/currentPage',
    pageSize: 'https://atomicdata.dev/properties/collection/pageSize',
    property: 'https://atomicdata.dev/properties/collection/property',
    totalMembers: 'https://atomicdata.dev/properties/collection/totalMembers',
    totalPages: 'https://atomicdata.dev/properties/collection/totalPages',
    value: 'https://atomicdata.dev/properties/collection/value',
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
