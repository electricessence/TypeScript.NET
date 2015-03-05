requirejs.config(
	{
		baseUrl : "../../",
		paths: {
			"TypeScript.NET/System": "System.min",
			"TypeScript.NET/System.Linq": "System.Linq.min"
		},
		shim: {
			"TypeScript.NET/System": {
				exports: "System"
			},
			"TypeScript.NET/System.Linq": {
				deps: ["TypeScript.NET/System"],
				exports: "System.Linq"
			}
		}
	});