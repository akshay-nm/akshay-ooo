/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-preset-env')({ stage: 1 }),
  ],
}
