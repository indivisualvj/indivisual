const _commandLineArgs = require("command-line-args");

exports = _commandLineArgs([
    {name: "port", alias: "p", type: String, defaultOption: true},
    {name: "https", type: Boolean},
    {name: "ssl-key", type: String},
    {name: "ssl-cert", type: String},
]);