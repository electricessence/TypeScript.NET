requirejs.config(
	{
		baseUrl : "../../",
		paths: {
			"TypeScript.NET/System": "System",
			"TypeScript.NET/System.Linq": "System.Linq"
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