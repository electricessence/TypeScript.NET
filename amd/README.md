TypeScript.NET AMD/Require.js
=============================

### AMD with Dependencies

The current TypeScript compiler does not make it easy to create merged JavaScript files that easily export to a single AMD module.
R.js configuration is complicated and difficult to understand how to get right.

To facilitate AMD we simply wrap the minified code like so:

```javascript
define('[ModuleName]',['Dependency01','Dependency02'],function(Dependency01,Dependency02){
var ModuleName;
// Minified code that exports to ModuleName;
return ModuleName;
});
```
Using gulp-uglify, gulp-wrap-js, and gulp-sourcemaps we render this result correctly so it can be consumed by requirejs and be able to debug the original TypeScript source.