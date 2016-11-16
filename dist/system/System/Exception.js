System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NAME, Exception;
    return {
        setters:[],
        execute: function() {
            NAME = 'Exception';
            Exception = (function () {
                function Exception(message, innerException, beforeSealing) {
                    var _ = this;
                    this.name = _.getName();
                    this.message = message;
                    this.data = {};
                    if (innerException)
                        _.data['innerException'] = innerException;
                    if (beforeSealing)
                        beforeSealing(_);
                    try {
                        var stack = eval("new Error()").stack;
                        stack = stack
                            && stack
                                .replace(/^Error\n/, '')
                                .replace(/(.|\n)+\s+at new.+/, '')
                            || '';
                        this.stack = _.toStringWithoutBrackets() + stack;
                    }
                    catch (ex) { }
                    Object.freeze(_);
                }
                Exception.prototype.getName = function () { return NAME; };
                Exception.prototype.toString = function () {
                    return "[" + this.toStringWithoutBrackets() + "]";
                };
                Exception.prototype.toStringWithoutBrackets = function () {
                    var _ = this;
                    var m = _.message;
                    return _.name + (m ? (': ' + m) : '');
                };
                Exception.prototype.dispose = function () {
                    var data = this.data;
                    for (var k in data) {
                        if (data.hasOwnProperty(k))
                            delete data[k];
                    }
                };
                return Exception;
            }());
            exports_1("Exception", Exception);
            exports_1("default",Exception);
        }
    }
});
//# sourceMappingURL=Exception.js.map