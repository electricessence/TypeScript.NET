const Uri = require('./dist/commonjs/System/Uri/Uri').default;
const ArgumentException = require('./dist/commonjs/System/Exceptions/ArgumentException').default;

var u = Uri.from('/one/two/three.html?four=five&six=seven');

throw new ArgumentException("arg1","This is the message.");

console.log('Hi.', u);
