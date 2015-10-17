const Uri = require('./dist/commonjs/System/Uri/Uri');
var u = Uri.from('/one/two/three.html?four=five&six=seven');

console.log('Hi.', u);
