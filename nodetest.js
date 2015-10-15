var Uri = require('./dist/commonjs/System/Uri/Uri').default;
var u = Uri.parse('/one/two/three.html?four=five&six=seven');
console.log('Hi.', u);
