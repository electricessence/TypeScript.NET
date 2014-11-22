var System;
(function (System) {
    (function (Threading) {
        (function (Tasks) {
            (function (TaskCreationOptions) {
                TaskCreationOptions[TaskCreationOptions["None"] = 0x0] = "None";

                TaskCreationOptions[TaskCreationOptions["PreferFairness"] = 0x01] = "PreferFairness";

                TaskCreationOptions[TaskCreationOptions["LongRunning"] = 0x02] = "LongRunning";

                TaskCreationOptions[TaskCreationOptions["AttachedToParent"] = 0x04] = "AttachedToParent";
            })(Tasks.TaskCreationOptions || (Tasks.TaskCreationOptions = {}));
            var TaskCreationOptions = Tasks.TaskCreationOptions;

            (function (TaskContinuationOptions) {
                TaskContinuationOptions[TaskContinuationOptions["None"] = 0] = "None";

                TaskContinuationOptions[TaskContinuationOptions["PreferFairness"] = 0x01] = "PreferFairness";

                TaskContinuationOptions[TaskContinuationOptions["LongRunning"] = 0x02] = "LongRunning";

                TaskContinuationOptions[TaskContinuationOptions["AttachedToParent"] = 0x04] = "AttachedToParent";

                TaskContinuationOptions[TaskContinuationOptions["NotOnRanToCompletion"] = 0x10000] = "NotOnRanToCompletion";

                TaskContinuationOptions[TaskContinuationOptions["NotOnFaulted"] = 0x20000] = "NotOnFaulted";

                TaskContinuationOptions[TaskContinuationOptions["NotOnCanceled"] = 0x40000] = "NotOnCanceled";

                TaskContinuationOptions[TaskContinuationOptions["OnlyOnRanToCompletion"] = TaskContinuationOptions.NotOnFaulted | TaskContinuationOptions.NotOnCanceled] = "OnlyOnRanToCompletion";

                TaskContinuationOptions[TaskContinuationOptions["OnlyOnFaulted"] = TaskContinuationOptions.NotOnRanToCompletion | TaskContinuationOptions.NotOnCanceled] = "OnlyOnFaulted";

                TaskContinuationOptions[TaskContinuationOptions["OnlyOnCanceled"] = TaskContinuationOptions.NotOnRanToCompletion | TaskContinuationOptions.NotOnFaulted] = "OnlyOnCanceled";

                TaskContinuationOptions[TaskContinuationOptions["ExecuteSynchronously"] = 0x80000] = "ExecuteSynchronously";
            })(Tasks.TaskContinuationOptions || (Tasks.TaskContinuationOptions = {}));
            var TaskContinuationOptions = Tasks.TaskContinuationOptions;

            var InternalTaskOptions;
            (function (InternalTaskOptions) {
                InternalTaskOptions[InternalTaskOptions["None"] = 0] = "None";

                InternalTaskOptions[InternalTaskOptions["InternalOptionsMask"] = 0x0000FF00] = "InternalOptionsMask";

                InternalTaskOptions[InternalTaskOptions["ChildReplica"] = 0x0100] = "ChildReplica";
                InternalTaskOptions[InternalTaskOptions["ContinuationTask"] = 0x0200] = "ContinuationTask";
                InternalTaskOptions[InternalTaskOptions["PromiseTask"] = 0x0400] = "PromiseTask";
                InternalTaskOptions[InternalTaskOptions["SelfReplicating"] = 0x0800] = "SelfReplicating";

                InternalTaskOptions[InternalTaskOptions["QueuedByRuntime"] = 0x2000] = "QueuedByRuntime";
            })(InternalTaskOptions || (InternalTaskOptions = {}));

            var Task = (function () {
                function Task() {
                }
                return Task;
            })();
            Tasks.Task = Task;
        })(Threading.Tasks || (Threading.Tasks = {}));
        var Tasks = Threading.Tasks;
    })(System.Threading || (System.Threading = {}));
    var Threading = System.Threading;
})(System || (System = {}));
