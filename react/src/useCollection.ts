import { properties, Resource, valToNumber } from '@tomic/lib';
import { useState } from 'react';
import { useArray, useNumber, useResource, useString, useTitle } from './hooks';

/** Hook for getting and setting a query param from the current Subject */
function useSubjectParam(
  key: string,
  subject: string,
  setSubject: (subject: string) => void,
): [string, (string) => void] {
  const params = new URL(subject).searchParams;
  const [val, setValInternal] = useState(params.get(key));

  function setVal(newVal: string | null) {
    params.set(key, newVal);
    const newUrl = new URL(subject);
    newUrl.searchParams.set(key, newVal);
    if (newVal == null) {
      newUrl.searchParams.delete(key);
    }
    setValInternal(newVal);
    setSubject(newUrl.href);
  }

  return [val, setVal];
}

interface Collection {
  /** List of children subject URLs of the Collection. Pass these to useResource */
  members: string[];
  /** The current page number, from 1 to (totalPages) */
  currentPage: number;
  setCurrentPage: (page: number) => void;
  /** The URL by which the collection is sorted */
  sortBy: string;
  setSortBy: (page: string) => void;
  title?: string;
  description?: string;
  valueFilter?: string;
  propertyFilter?: string;
  totalPages: number;
  /**
   * When you set a page number, sort or filter, you will add query parameters
   * to the Subject. Here you can see the current URL - this is the one that is
   * being fetched.
   */
  subjectWithParams: string;
  /** The current collection Resource */
  resource: Resource;
}

export function useCollection(subject: string): Collection {
  const [subjectWithParams, setSubject] = useState(subject);
  const [resource] = useResource(subjectWithParams);
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [members] = useArray(resource, properties.collection.members);
  const [valueFilter] = useString(resource, properties.collection.value);
  const [propertyFilter] = useString(resource, properties.collection.property);
  // We use the currentPage and totalpages from the Collection Resource itself - not the query param. This gives us a default value.
  // const [currentPage] = useNumber(resource, properties.collection.currentPage);
  const currentPage = valToNumber(
    resource.get(properties.collection.currentPage) || 1,
  );
  const [sortBy] = useString(resource, properties.collection.sortBy);
  const [totalPages] = useNumber(resource, properties.collection.totalPages);
  // Query parameters for Collections
  const [, setCurrentPage] = useSubjectParam(
    'current_page',
    subject,
    setSubject,
  );
  const [, setSortBy] = useSubjectParam('sort_by', subject, setSubject);

  return {
    members,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    title,
    description,
    valueFilter,
    propertyFilter,
    totalPages,
    subjectWithParams,
    resource,
  };
}
