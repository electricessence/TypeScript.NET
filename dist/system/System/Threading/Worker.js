/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
System.register(["../Environment"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Environment_1;
    var Worker;
    return {
        setters:[
            function (Environment_1_1) {
                Environment_1 = Environment_1_1;
            }],
        execute: function() {
            exports_1("Worker", Worker = Environment_1.isNodeJS ? require('./NodeJSWorker').default : self.Worker);
            exports_1("default",Worker);
        }
    }
});
//# sourceMappingURL=Worker.js.map