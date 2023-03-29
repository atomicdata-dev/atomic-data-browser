import {
  css,
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps,
} from 'styled-components';

export function transition(
  ...properties: string[]
): FlattenInterpolation<ThemeProps<DefaultTheme>> {
  const interpolate = (theme: DefaultTheme) =>
    properties
      .map(p => `${p} ${theme.animation.duration} ease-in-out`)
      .join(',');

  return css`
    transition: ${({ theme }) => interpolate(theme)};
  `;
}
