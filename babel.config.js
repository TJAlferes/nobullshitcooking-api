module.exports = function(api) {
  api.cache(true);
  
  const presets = [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "targets": {"node": "12.17.0"},
        useBuiltIns: "usage",
        "corejs": "3.6"
      }
    ]
  ];

  return {presets};
};