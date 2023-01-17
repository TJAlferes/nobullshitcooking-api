module.exports = function(api) {
  api.cache(true);
  
  const presets = [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        corejs: "3.27",
        targets: {
          node: "16.19.0"
        },
        useBuiltIns: "usage"
      }
    ]
  ];

  return {presets};
};