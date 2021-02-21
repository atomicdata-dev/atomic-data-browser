import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Resource, ResourceStatus } from '../../atomic-lib/resource';
import { useArray, useResource, useStore, useString } from '../../atomic-react/hooks';
import { handleError } from '../../helpers/handlers';
import { openURL } from '../../helpers/navigation';
import { classes, properties } from '../../helpers/urls';
import { ButtonMargin } from '../Button';
import FieldLabeled from './Field';
import { ErrMessage } from './InputStyles';

type ResourceFormProps = {
  /** Optionally sets the isA Class of a resource. Really useful when creating a new instance of some resource */
  classSubject?: string;
  /** Resource that is to be changed or created */
  resource: Resource;
};

/** Form for editing and creating a Resource */
export function ResourceForm({ classSubject, resource }: ResourceFormProps): JSX.Element {
  const [isAArray] = useArray(resource, properties.isA);
  if (classSubject == undefined && isAArray?.length > 0) {
    classSubject = isAArray[0];
  }
  const [klass] = useResource(classSubject);
  const store = useStore();
  const resourceStatus = resource.getStatus();
  const classStatus = klass.getStatus();
  const [requires] = useArray(klass, properties.requires);
  const [recommends] = useArray(klass, properties.recommends);
  const [klassIsa] = useString(klass, properties.isA);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const history = useHistory();

  if (resourceStatus == ResourceStatus.loading) {
    return <>Loading resource...</>;
  }
  if (resourceStatus == ResourceStatus.error) {
    return <>{resource.getError().message}</>;
  }
  if (classStatus == ResourceStatus.loading) {
    return <>Loading class...</>;
  }
  if (classStatus == ResourceStatus.error) {
    return <>{klass.getError().message}</>;
  }
  if (klassIsa !== classes.class) {
    return <>{classSubject} is not a Class. Only resources with valid classes can be created or edited at this moment.</>;
  }

  // TODO: Should be an array of all properties of the resources that have not been included in the recommended and required fields
  const otherProps = [];

  async function save() {
    setErr(null);
    try {
      resource.setStatus(ResourceStatus.ready);
      const newUrlString = await resource.save(store);
      setSaving(false);
      // Redirect to created / edited resource
      history.push(openURL(newUrlString));
    } catch (e) {
      handleError(e);
      setErr(e);
      setSaving(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    save();
  }

  let warning = null;

  if (!resource.getSubject().includes(store.getBaseUrl())) {
    warning = `You're trying to edit / create a resource (${resource.getSubject()}) outside of your Base URL (${store.getBaseUrl()}). You might nog have the rights to edit this.`;
  }

  return (
    <form about={resource.getSubject()}>
      {warning && <ErrMessage>Warning: {warning}</ErrMessage>}
      {requires.map(property => {
        return <FieldLabeled key={property} property={property} resource={resource} required />;
      })}
      {recommends.map(property => {
        return <FieldLabeled key={property} property={property} resource={resource} />;
      })}
      {otherProps.map(property => {
        return <FieldLabeled key={property} property={property} resource={resource} />;
      })}
      <ButtonMargin type='button' onClick={handleSubmit} disabled={saving}>
        {saving ? 'wait...' : 'save'}
      </ButtonMargin>
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </form>
  );
}
