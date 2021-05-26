import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Resource, ResourceStatus } from '../../atomic-lib/resource';
import { useArray, useResource, useStore, useString } from '../../atomic-react/hooks';
import { handleError } from '../../helpers/handlers';
import { openURL } from '../../helpers/navigation';
import { classes, properties, urls } from '../../helpers/urls';
import { Button } from '../Button';
import ResourceField from './ResourceField';
import { ErrMessage, LabelStyled } from './InputStyles';
import { ResourceSelector } from './ResourceSelector';
import styled from 'styled-components';

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
  const [err, setErr] = useState<Error>(null);
  const [newPropErr, setNewPropErr] = useState<Error>(null);
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  const [newProperty, setNewProperty] = useState<string>(null);
  const [tempOtherProps, setTempOtherProps] = useState<string[]>([]);

  if (resourceStatus == ResourceStatus.loading) {
    return <>Loading resource...</>;
  }
  if (resourceStatus == ResourceStatus.error) {
    return <ErrMessage>{resource.getError().message}</ErrMessage>;
  }
  // if (classStatus == ResourceStatus.loading) {
  //   return <>Loading class...</>;
  // }
  // if (classStatus == ResourceStatus.error) {
  //   return <ErrMessage>Error in class. {klass.getError().message}</ErrMessage>;
  // }
  if (klassIsa && klassIsa !== classes.class) {
    return (
      <ErrMessage>{classSubject} is not a Class. Only resources with valid classes can be created or edited at this moment.</ErrMessage>
    );
  }

  // Iterate over all properties. If a property does not exist in requires or recommends, add it to otherprops
  // TODO: Should be an array of all properties of the resources that have not been included in the recommended and required fields
  const otherProps = tempOtherProps;
  // if (otherProps.length == 0) {
  // console.log(requires, recommends);
  for (const key of Array.from(resource.getPropVals().keys())) {
    const keyIsInEither = requires.includes(key) || recommends.includes(key);
    console.log(key, keyIsInEither);
    if (!(requires.includes(key) || recommends.includes(key) || otherProps.includes(key))) {
      otherProps.push(key);
    }
  }

  console.log('requires', requires);
  console.log('recommends', recommends);
  console.log('otherprops', otherProps);

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

  function handleAddProp(e) {
    setNewPropErr(null);
    if (otherProps.includes(newProperty) || requires.includes(newProperty) || recommends.includes(newProperty)) {
      setNewPropErr(new Error('That property already exists in this resource. It can only be added once.'));
    } else {
      setTempOtherProps(tempOtherProps.concat(newProperty));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    save();
  }

  let warning = null;

  if (!resource.getSubject().includes(store.getBaseUrl())) {
    warning = `You're trying to edit / create a resource (${resource.getSubject()}) outside of your Base URL (${store.getBaseUrl()}). You might not have the rights to edit this.`;
  }
  const agent = store.getAgent();
  if (agent == null) {
    warning = `No Agent has been set. You can't edit or post resources. Go to the settings page (press 's') and enter an Agent.`;
  }

  return (
    <form about={resource.getSubject()}>
      {warning && <ErrMessage>⚠️{warning}</ErrMessage>}
      {requires.map(property => {
        return <ResourceField key={property} propertyURL={property} resource={resource} required />;
      })}
      {recommends.length > 0 && <em>optional fields:</em>}
      {recommends.map(property => {
        return <ResourceField key={property} propertyURL={property} resource={resource} />;
      })}
      {Array.from(otherProps).map(property => {
        return <ResourceField key={property} propertyURL={property} resource={resource} />;
      })}
      <LabelStyled>add another property...</LabelStyled>
      <PropertyAdder>
        <Button subtle disabled={newProperty == null} onClick={handleAddProp}>
          add
        </Button>
        <ResourceSelector
          value={null}
          setSubject={(set, _handleErr) => setNewProperty(set)}
          // TODO error handling
          error={newPropErr}
          setError={setNewPropErr}
          classType={urls.classes.property}
        />
      </PropertyAdder>
      {agent && (
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'wait...' : 'save'}
        </Button>
      )}
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </form>
  );
}

const PropertyAdder = styled.div`
  display: flex;
  flex-direction: row;
`;
