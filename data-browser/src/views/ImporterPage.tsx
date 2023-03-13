import {
  importJsonAdString,
  Resource,
  useResource,
  useStore,
} from '@tomic/react';
import React, { useCallback, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { ContainerNarrow } from '../components/Containers';
import Field from '../components/forms/Field.jsx';
import {
  InputStyled,
  InputWrapper,
  TextAreaStyled,
} from '../components/forms/InputStyles.jsx';
import styled from 'styled-components';
import { Column } from '../components/Row';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { Title } from '../components/Title';
import toast from 'react-hot-toast';

type ImporterPageProps = {
  resource?: Resource;
};

/** Importer Resource for uploading JSON-AD * */
export function ImporterPage({ resource }: ImporterPageProps) {
  const [overwriteOutside, setOverwriteOutside] = useState(false);
  const [parent, setParent] = useCurrentSubject();
  const resourceByS = useResource(parent);

  resource = resourceByS || resource;

  const store = useStore();
  const [jsonAd, setJsonAd] = useState('');

  const handleImport = useCallback(async () => {
    try {
      await importJsonAdString(store, jsonAd, {
        overwriteOutside,
        parent: parent!,
      });
      toast.success('Imported!');
    } catch (e) {
      toast.error(e.message);
    }
  }, [parent, jsonAd, overwriteOutside, store]);

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Title resource={resource} prefix='Import to' link />
      <p>
        Read more about how importing Atomic Data works{' '}
        <a href='https://docs.atomicdata.dev/create-json-ad.html'>
          in the docs
        </a>
        .
      </p>
      <Column>
        <Field label='JSON-AD'>
          <InputWrapper>
            <TextAreaStyled
              // disabled={!!url}
              rows={15}
              placeholder='Paste your JSON-AD...'
              value={jsonAd}
              onChange={e => setJsonAd(e.target.value)}
            >
              {jsonAd}
            </TextAreaStyled>
          </InputWrapper>
        </Field>

        {/* <Field label='URL' helper='http URL where a JSON-AD resource is hosted'>
          <InputWrapper>
            <InputStyled
              disabled={!!jsonAd}
              placeholder='enter a URL...'
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </InputWrapper>
        </Field> */}
        <Header>Options</Header>
        <Group>
          <Label>
            <input
              type='checkbox'
              checked={overwriteOutside}
              onChange={e => setOverwriteOutside(e.target.checked)}
            />
            {`Overwrite resources that are outside the scope of the parent. Do this only if you trust the imported data.`}
          </Label>
          <Field
            label='Target parent'
            helper='This URL will be used as the default Parent for imported resources.'
            required
          >
            <InputWrapper>
              <InputStyled
                required
                placeholder='Enter subject'
                value={parent}
                onChange={e => setParent(e.target.value)}
              />
            </InputWrapper>
          </Field>
        </Group>
        {jsonAd !== '' && (
          <Button
            data-test='import-post'
            disabled={!parent}
            onClick={handleImport}
          >
            Send JSON
          </Button>
        )}
      </Column>
    </ContainerNarrow>
  );
}

const Label = styled.label`
  display: flex;
  gap: 1ch;
  align-items: center;
`;

const Group = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid ${p => p.theme.colors.bg2};
  border-radius: ${p => p.theme.radius};
`;

const Header = styled.h2`
  font-size: 1.2rem;
`;
