System.register(["./Sorting/createComparer", "./Sorting/quickSort"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var createComparer_1;
    var exportedNames_1 = {
        "createComparer": true,
        "default": true,
        "by": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n))
                exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (createComparer_1_1) {
                createComparer_1 = createComparer_1_1;
            },
            function (quickSort_1_1) {
                exportStar_1(quickSort_1_1);
            }
        ],
        execute: function () {
            exports_1("createComparer", createComparer_1.createComparer);
            exports_1("default", createComparer_1.createComparer);
            exports_1("by", // Allow for default import.
            createComparer_1.createComparer);
        }
    };
});
//# sourceMappingURL=Sort.js.map