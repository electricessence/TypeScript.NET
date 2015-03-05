requirejs(
	// First verify that requirejs correctly pulls in System as a dependency.
	['System.Linq'], function(Linq) {
		var SUCCESS = 'Success.', FAIL = 'Fail.';

		if('Enumerable' in Linq)
		{
			requirejs(
				// Then ensure that System is exported correctly.
				['System'], function(System) {
					alert('Collections' in System ? SUCCESS : FAIL);
				});

			return;
		}

		alert(FAIL);
	});