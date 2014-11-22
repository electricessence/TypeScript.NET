var System;
(function (System) {
    (function (Threading) {
        var Task = (function () {
            function Task() {
            }
            return Task;
        })();
        Threading.Task = Task;
    })(System.Threading || (System.Threading = {}));
    var Threading = System.Threading;
})(System || (System = {}));
