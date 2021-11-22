const disableModuleScopePlugin = require("./craco-disable-module-scope-plugin.js");

module.exports = {
  plugins: [{ plugin: disableModuleScopePlugin }],
};
