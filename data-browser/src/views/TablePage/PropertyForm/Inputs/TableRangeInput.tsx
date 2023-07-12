import { Resource, useNumber, useStore } from '@tomic/react';
import React, { useCallback } from 'react';
import { ErrorChip } from '../../../../components/forms/ErrorChip';
import { useValidation } from '../../../../components/forms/formValidation/useValidation';
import {
  RangeInput,
  validateRange,
} from '../../../../components/forms/RangeInput';

interface TableRangeInputProps {
  resource: Resource;
  minProp: string;
  maxProp: string;
  constraintClass: string;
}

export function TableRangeInput({
  resource,
  minProp,
  maxProp,
  constraintClass,
}: TableRangeInputProps): JSX.Element {
  const store = useStore();
  const [minLength, setMinLength] = useNumber(resource, minProp);
  const [maxLength, setMaxLength] = useNumber(resource, maxProp);

  const [error, setError, onBlur] = useValidation();

  const handleRangeChange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      setMinLength(min);
      setMaxLength(max);

      if (min !== undefined || max !== undefined) {
        resource.addClasses(store, constraintClass);
      } else {
        resource.removeClasses(store, constraintClass);
      }

      const err = validateRange(min, max, true);
      setError(err);

      if (!err) {
        resource.save(store);
      }
    },
    [setMinLength, setMaxLength, store, resource],
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
