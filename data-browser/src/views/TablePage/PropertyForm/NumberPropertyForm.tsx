import { urls, useStore, useString } from '@tomic/react';
import React, { useEffect } from 'react';
import { RadioGroup, RadioInput } from '../../../components/forms/RadioInput';
import { FormGroupHeading } from './FormGroupHeading';
import { DecimalPlacesInput } from './Inputs/DecimalPlacesInput';
import { TableRangeInput } from './Inputs/TableRangeInput';
import { PropertyCategoryFormProps } from './PropertyCategoryFormProps';

const { numberFormats } = urls.instances;

export const NumberPropertyForm = ({
  resource,
}: PropertyCategoryFormProps): JSX.Element => {
  const store = useStore();
  const [numberFormatting, setNumberFormatting] = useString(
    resource,
    urls.properties.constraints.numberFormatting,
  );

  const handleNumberFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberFormatting(e.target.value);
  };

  useEffect(() => {
    resource.addClasses(
      store,
      urls.classes.constraintProperties.formattedNumber,
    );

    resource.set(urls.properties.datatype, urls.datatypes.float, store);

    setNumberFormatting(numberFormats.number);
  }, []);

  return (
    <>
      <FormGroupHeading>Number Format:</FormGroupHeading>
      <RadioGroup>
        <RadioInput
          name='number-format'
          value={numberFormats.number}
          checked={numberFormatting === numberFormats.number}
          onChange={handleNumberFormatChange}
        >
          Number
        </RadioInput>
        <RadioInput
          name='number-format'
          value={numberFormats.percentage}
          checked={numberFormatting === numberFormats.percentage}
          onChange={handleNumberFormatChange}
        >
          Percentage
        </RadioInput>
      </RadioGroup>
      <FormGroupHeading>Decimal Places</FormGroupHeading>
      <DecimalPlacesInput resource={resource} />
      <FormGroupHeading>Range</FormGroupHeading>
      <TableRangeInput
        resource={resource}
        minProp={urls.properties.constraints.min}
        maxProp={urls.properties.constraints.max}
        constraintClass={urls.classes.constraintProperties.rangeProperty}
      />
    </>
  );
};
