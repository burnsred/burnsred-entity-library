import { css } from 'styled-components';

import { mixin } from '../../selectors';

// eslint-disable-next-line import/prefer-default-export
export const component_widgetTextarea_standard = {
  css: css`
    ${mixin({ name: 'componentBox' })}
    height: 100px;
    resize: none;
  `,
};
