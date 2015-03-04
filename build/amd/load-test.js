requirejs(
	// First verify that requirejs correctly pulls in System as a dependency.
	['TypeScript.NET/System.Linq'], function(Linq) {
		var SUCCESS = 'Success.', FAIL = 'Fail.';

		if('Enumerable' in Linq)
		{
			requirejs(
				// Then ensure that System is exported correctly.
				['TypeScript.NET/System'], function(System) {
					alert('Collections' in System ? SUCCESS : FAIL);
				});

			return;
		}

		alert(FAIL);
	});