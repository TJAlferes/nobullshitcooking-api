module.exports = function(api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        "targets": {"node": "12.17.0"},
        useBuiltIns: "usage",
        "corejs": "3.6"
      }
    ]
  ];
  /*const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {"regenerator": true}
    ]
  ];*/
  //"sourceType": "unambiguous"
  //return {presets, plugins};
  return {presets};
};