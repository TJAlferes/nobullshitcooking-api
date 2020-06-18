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
  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {"regenerator": true}
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
  ];
  //"sourceType": "unambiguous"
  return {presets, plugins};
};