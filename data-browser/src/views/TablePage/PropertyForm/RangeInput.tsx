import React, { useId, useState } from 'react';
import styled from 'styled-components';
import {
  InputStyled,
  InputWrapper,
} from '../../../components/forms/InputStyles';
import { Row } from '../../../components/Row';
import { FormGroupHeading } from './FormGroupHeading';

interface RangeInputProps {
  minValue?: number;
  maxValue?: number;
  label: string;
  onChange: (min: number, max: number) => void;
}

export function RangeInput({
  minValue,
  maxValue,
  label,
  onChange,
}: RangeInputProps): JSX.Element {
  return (
    <Row center gap='0.5rem'>
      <InputWrapper>
        <InputStyled type='number' placeholder='min' value={minValue} />
      </InputWrapper>
      {' - '}
      <InputWrapper>
        <InputStyled type='number' placeholder='max' value={maxValue} />
      </InputWrapper>
    </Row>
  );
}
