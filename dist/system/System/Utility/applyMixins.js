System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function applyMixins(derivedConstructor, baseConstructors) {
        baseConstructors
            .forEach(function (bc) {
            Object.getOwnPropertyNames(bc.prototype).forEach(function (name) {
                derivedConstructor.prototype[name] = bc.prototype[name];
            });
        });
    }
    exports_1("default", applyMixins);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=applyMixins.js.map