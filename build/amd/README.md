TypeScript.NET AMD/Require.js
=============================

###A work in progress

The current TypeScript compiler does not make it easy to create merged JavaScript files that easily export to a single AMD module.
As I would love this to automatically occur at build time and be minifiied with a sourcemap, it's currently a manual process.
For now, the build/amd/*.js versions provided may be behind the actual build/*.js files.
I suggest adding something like the following entries to your require.config:
```
require.config(
	{
		paths: {
			"TypeScript.NET":"[...relative.component.path...]/TypeScript.NET/build"
		}
		shim:
		{
			"TypeScript.NET/System.Linq" : {
        deps:["TypeScript.NET/System"],
        exports:"System"
      }
		}
	});
```
This should make it easy to include these libraries in your JavaScript via Require.js without hassle.
If you want to use define() or require() the build/amd/*.js versions should work but as I said, may be out of date as well as they currently don't work out the box with TypeScript imports.

#####Minified Config

```
require.config(
	{
		paths: {
			"TypeScript.NET/System":"[...relative.component.path...]/TypeScript.NET/build/System.min"
			"TypeScript.NET/System.Linq":"[...relative.component.path...]/TypeScript.NET/build/System.Linq.min"
		}
		shim:
		{
			"TypeScript.NET/System.Linq" : {
				deps:["TypeScript.NET/System"],
				exports:"System"
			}
		}
	});
```
###Using with TypeScript
I suggest not using the build/amd/* versions and simply put the following at the top of your TypeScript file (with one of the above configs installed):
```
///<reference path="[...relative.component.path...]/TypeScript.NET/build/System.d.ts" />
///<amd-dependency path="TypeScript.NET/System" />
```
and/or
```
///<reference path="[...relative.component.path...]/build/System.Linq.d.ts" />
///<amd-dependency path="TypeScript.NET/System.Linq" />
```

