/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Disposable/Utility', '../../Collections/Enumeration/Enumerator'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1, Enumerator;
    function forEach(enumerable, action) {
        if (enumerable) {
            Utility_1.using(Enumerator.from(enumerable), function (e) {
                Enumerator.forEach(e, action);
            });
        }
    }
    exports_1("default", forEach);
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (Enumerator_1) {
                Enumerator = Enumerator_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=forEach.js.map