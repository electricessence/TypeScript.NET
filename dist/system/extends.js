System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Used by TypeScript to extend classes before ES6.
     *
     * Usage:
     * ```
     * import __extendsImport from "../../extends";
     * //noinspection JSUnusedLocalSymbols
     * const __extends = __extendsImport;
     * ```
     * @param d
     * @param b
     */
    function default_1(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        //@ts-ignore
        function __() { this.constructor = d; }
        //noinspection CommaExpressionJS
        d.prototype = b === null
            ? Object.create(b)
            : (__.prototype = b.prototype, new __());
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=extends.js.map