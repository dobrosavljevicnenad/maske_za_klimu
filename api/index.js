const server = require('../dist/maske_za_klimu/server/main');

module.exports = (req, res) => {
  server.app()(req, res);
};
