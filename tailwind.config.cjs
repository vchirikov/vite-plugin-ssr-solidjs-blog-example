/* postcss+tailwindcss doesn't support mjs by default (╯°□°)╯︵ ┻━┻ */
/* eslint-disable global-require */

// example of a custom theme
const customTheme = {
  // ...require("daisyui/src/colors/themes")["[data-theme=dracula]"],
  // customization, parameters from [daisyUI themes](https://daisyui.com/docs/themes/)
  primary: '#c2c3fc',
  secondary: '#b783d3',
  accent: '#8bacd6',
  neutral: '#2A2735',
  'base-100': '#F9FAFB',
  info: '#4789E6',
  success: '#15C16B',
  warning: '#E58510',
  error: '#DF2A66',
};

/** @link https://daisyui.com/docs/config/  */
const daisyuiConfig = {
  logs: false,
  rtl: false,
  styled: true,
  base: true,
  utils: true,
  themes: ['dark', 'light', { custom: customTheme }],
};

/** @type {import('tailwindcss').Config} */
const tailwindcssConfig = {
  darkMode: 'class',
  content: ['./src/**/*.{html,svelte}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: daisyuiConfig,
};

module.exports = tailwindcssConfig;
