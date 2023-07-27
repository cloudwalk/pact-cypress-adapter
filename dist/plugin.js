/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
var readFileAsync = require('./utils').readFileAsync;
module.exports = function (on, config, fs) {
    var readFile = function (filename) { return readFileAsync(fs.promises, filename); };
    var removePactDir = function () {
        fs.promises.rm('cypress/pacts', { recursive: true, force: true }).then(function () {
            console.log('Clear up pacts');
        });
    };
    on('before:run', function () {
        removePactDir();
    });
    on('task', {
        readFile: readFile
    });
};
//# sourceMappingURL=plugin.js.map