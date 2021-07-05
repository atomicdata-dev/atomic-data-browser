import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Resource, ResourceStatus, classes, properties, urls } from '@tomic/lib';
import { useArray, useCanWrite, useResource, useStore, useString } from '@tomic/react';
import { handleError } from '../../helpers/handlers';
import { openURL } from '../../helpers/navigation';
import { Button } from '../Button';
import ResourceField from './ResourceField';
import { ErrMessage } from './InputStyles';
import { ResourceSelector } from './ResourceSelector';
import styled from 'styled-components';
import Field from './Field';
import { useSettings } from '../../helpers/AppSettings';
import { useDebounce } from '../../helpers/useDebounce';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';

type ResourceFormProps = {
  /** Optionally sets the isA Class of a resource. Really useful when creating a new instance of some resource */
  classSubject?: string;
  /** Optionally sets the parent of the new resource */
  parent?: string;
  /** Resource that is to be changed or created */
  resource: Resource;
};

/** Form for editing and creating a Resource */
export function ResourceForm({ classSubject, resource: resourceIn, parent }: ResourceFormProps): JSX.Element {
  const [resource] = useResource(resourceIn.getSubject());
  const [isAArray] = useArray(resource, properties.isA);
  if (classSubject == undefined && isAArray?.length > 0) {
    // This is not entirely accurate, as Atomic Data supports having multiple classes for a single resource.
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
  /** A list of custom properties, set by the User while editing this form */
  const [tempOtherProps, setTempOtherProps] = useState<string[]>([]);
  const [otherProps, setOtherProps] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { agent } = useSettings();
  const debouncedResource = useDebounce(resource, 5000);
  const [canWrite, canWriteErr] = useCanWrite(debouncedResource, agent?.subject);
  const [disabled, setDisabled] = useState(false);
  const [_resoureceParent, setResourceParent] = useString(resource, properties.parent);

  // Sets agent warning / eror
  useEffect(() => {
    if (canWrite == false) {
      setErr(new Error(`Cannot save: ${canWriteErr}.`));
      // TODO: This is being reset too often, which sucks
      // setDisabled(true);
    } else {
      setErr(null);
    }
  }, [canWrite, canWriteErr, agent]);

  // Sets the parent
  useEffect(() => {
    if (parent) {
      setResourceParent(parent);
    }
  }, [parent, resource]);

  /** Builds otherProps */
  useEffect(() => {
    let prps = [];
    const allProps = Array.from(resource.getPropVals().keys());
    // Iterate over all properties. If a property does not exist in requires or recommends, add it to otherprops
    for (const prop of allProps) {
      const propIsNotRenderedYet = !(requires.includes(prop) || recommends.includes(prop));
      if (propIsNotRenderedYet) {
        prps.push(prop);
      }
    }
    // The `is-a` property is not very useful in most cases, only show it if explicitly set
    prps = prps.filter(prop => prop !== properties.isA);
    prps = prps.filter(prop => prop !== properties.parent);
    prps = prps.filter(prop => prop !== properties.read);
    prps = prps.filter(prop => prop !== properties.write);
    setOtherProps(prps.concat(tempOtherProps));
    // I actually want to run this useEffect every time the requires / recommends array changes, but that leads to a weird loop, so that's what the length is for
  }, [resource, tempOtherProps, requires.length, recommends.length]);

  if (resourceStatus == ResourceStatus.loading) {
    return <>Loading resource...</>;
  }
  if (resourceStatus == ResourceStatus.error) {
    return <ErrMessage>{resource.getError().message}</ErrMessage>;
  }
  if (classStatus == ResourceStatus.loading) {
    return <>Loading class...</>;
  }
  if (klassIsa && klassIsa !== classes.class) {
    return (
      <ErrMessage>{classSubject} is not a Class. Only resources with valid classes can be created or edited at this moment.</ErrMessage>
    );
  }

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

  function handleAddProp() {
    setNewPropErr(null);
    if (tempOtherProps.includes(newProperty) || requires.includes(newProperty) || recommends.includes(newProperty)) {
      setNewPropErr(new Error('That property already exists in this resource. It can only be added once.'));
    } else {
      setTempOtherProps(tempOtherProps.concat(newProperty));
    }
    setNewProperty(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    save();
  }

  function handleDelete(propertyURL: string) {
    resource.removePropVal(propertyURL);
    setTempOtherProps(tempOtherProps.filter(prop => prop != propertyURL));
  }

  return (
    <form about={resource.getSubject()}>
      {classStatus == ResourceStatus.error && (
        <ErrMessage>Error in class. {klass.getError().message}. You can still edit the resource, though.</ErrMessage>
      )}
      {requires.map(property => {
        return <ResourceField key={property} propertyURL={property} resource={resource} disabled={disabled} required />;
      })}
      {recommends.map(property => {
        return <ResourceField key={property} propertyURL={property} resource={resource} disabled={disabled} />;
      })}
      {otherProps.map(property => {
        return (
          <ResourceField
            key={property}
            propertyURL={property}
            resource={resource}
            disabled={disabled}
            handleDelete={() => handleDelete(property)}
          />
        );
      })}
      <Field
        label='add another property...'
        helper='In Atomic Data, any Resource could have any single Property. Use this field to add new property-value combinations to your resource.'
      >
        <PropertyAdder>
          <Button subtle disabled={!newProperty} onClick={handleAddProp}>
            add
          </Button>
          <ResourceSelector
            value={null}
            disabled={disabled}
            setSubject={(set, _setNewPropErr) => setNewProperty(set)}
            // TODO error handling
            error={newPropErr}
            setError={setNewPropErr}
            classType={urls.classes.property}
          />
        </PropertyAdder>
      </Field>
      <Button
        title={'show / hide advanced form fields'}
        clean
        style={{ display: 'flex', marginBottom: '1rem', alignItems: 'center' }}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <strong>advanced options {showAdvanced ? <FaCaretDown /> : <FaCaretRight />}</strong>
      </Button>
      {showAdvanced && (
        <>
          <ResourceField propertyURL={properties.isA} resource={resource} />
          <ResourceField propertyURL={properties.parent} resource={resource} />
          <ResourceField propertyURL={properties.write} resource={resource} />
          <ResourceField propertyURL={properties.read} resource={resource} />
        </>
      )}
      <Button onClick={handleSubmit} disabled={disabled || saving}>
        {saving ? 'wait...' : 'save'}
      </Button>
      {disabled && (
        <Button subtle onClick={() => setDisabled(false)}>
          enable editing
        </Button>
      )}
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </form>
  );
}

const AdvancedBlock = styled.div`
  border: solid 1px ${props => props.theme.colors.bg2};
  padding: ${p => p.theme.margin}rem;
  padding-bottom: 0;
  border-radius: ${props => props.theme.radius};
  margin-bottom: ${p => p.theme.margin}rem;
`;

const PropertyAdder = styled.div`
  display: flex;
  flex-direction: row;
`;
