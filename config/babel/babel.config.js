module.exports = { //@TODO: add optimization configs for production build
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
      }
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'withPower.pragma',
        pragmaFrag: 'withPower.Fragment',
      }
    ],
  ],
};