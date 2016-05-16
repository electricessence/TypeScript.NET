/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function default_1(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null
            ? Object.create(b)
            : (__.prototype = b.prototype, new __());
    }
    exports_1("default", default_1);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=extends.js.map