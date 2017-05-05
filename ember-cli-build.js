const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Don't fingerprint the ember-logo b/c it is pulled using a path from the
    // docs meta which doesn't get updated with fingerprint hash
    fingerprint: {
      exclude: ['ember-logo']
    },

    sassOptions: {
      extension: 'scss'
    }
  });

  return app.toTree();
};
