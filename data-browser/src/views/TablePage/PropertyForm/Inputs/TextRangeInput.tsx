import { JSONValue, Resource, urls, useArray, useNumber } from '@tomic/react';
import React, { useCallback } from 'react';
import { ErrorChip } from '../../../../components/forms/ErrorChip';
import { useValidation } from '../../../../components/forms/formValidation/useValidation';
import {
  RangeInput,
  validateRange,
} from '../../../../components/forms/RangeInput';

interface TextRangeInputProps {
  resource: Resource;
}

function addRangePropertyClass(
  setIsA: (val: JSONValue) => Promise<void>,
  isA: string[],
) {
  setIsA(
    Array.from(
      new Set([...isA, urls.classes.constraintProperties.rangeProperty]),
    ),
  );
}

function removeRangePropertyClass(
  setIsA: (val: JSONValue) => Promise<void>,
  isA: string[],
) {
  setIsA(
    isA.filter(i => i !== urls.classes.constraintProperties.rangeProperty),
  );
}

export function TextRangeInput({ resource }: TextRangeInputProps): JSX.Element {
  const [minLength, setMinLength] = useNumber(
    resource,
    urls.properties.constraints.min,
  );
  const [maxLength, setMaxLength] = useNumber(
    resource,
    urls.properties.constraints.max,
  );

  const [isA, setIsA] = useArray(resource, urls.properties.isA);

  const [error, setError, onBlur] = useValidation();

  const handleRangeChange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      setMinLength(min);
      setMaxLength(max);

      if (min !== undefined || max !== undefined) {
        addRangePropertyClass(setIsA, isA);
      } else {
        removeRangePropertyClass(setIsA, isA);
      }

      const err = validateRange(min, max, true);
      setError(err);
    },
    [setMinLength, setMaxLength, setIsA],
  );

  return (
    <div>
      <RangeInput
        round
        maxValue={maxLength}
        minValue={minLength}
        invalid={!!error}
        onBlur={onBlur}
        onChange={handleRangeChange}
      />
      {error && <ErrorChip>{error}</ErrorChip>}
    </div>
  );
}
