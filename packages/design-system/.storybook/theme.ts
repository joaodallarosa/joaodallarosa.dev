import { create } from 'storybook/theming/create'

/*
 * Storybook's own chrome themed with the real design tokens (docs/design-prompt.md)
 * rather than left at Storybook's generic default purple — the reference tool should
 * read as part of the same system it documents.
 */
export default create({
  base: 'dark',

  colorPrimary: '#ffb000',
  colorSecondary: '#ffb000',

  appBg: '#0b0c0d',
  appContentBg: '#131517',
  appPreviewBg: '#0b0c0d',
  appBorderColor: '#2a2e32',
  appBorderRadius: 2,

  textColor: '#eceeef',
  textMutedColor: '#868c91',
  textInverseColor: '#0b0c0d',

  barTextColor: '#868c91',
  barSelectedColor: '#ffb000',
  barHoverColor: '#ffc94d',
  barBg: '#131517',

  buttonBg: '#1c1f22',
  buttonBorder: '#2a2e32',
  booleanBg: '#1c1f22',
  booleanSelectedBg: '#ffb000',

  inputBg: '#131517',
  inputBorder: '#2a2e32',
  inputTextColor: '#eceeef',
  inputBorderRadius: 2,

  fontBase: '"JetBrains Mono", "SFMono-Regular", monospace',
  fontCode: '"JetBrains Mono", "SFMono-Regular", monospace',

  brandTitle: 'joaodallarosa.dev — design system',
  brandUrl: '/',
  brandTarget: '_self',
})
