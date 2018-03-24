/**
 *  Represents the current stage in the lifecycle of a Task.
 */
declare const enum TaskStatus {
    /**
     *  The task has been initialized but has not yet been scheduled.
     */
    Created = 0,
    /**
     *  The task has been scheduled for execution but has not yet begun executing.
     */
    WaitingToRun = 1,
    /**
     *  The task is running but has not yet completed.
     */
    Running = 2,
    /**
     *  The task is currently blocked in a wait state.
     */
    RanToCompletion = 3,
    /**
     *  The task acknowledged cancellation by throwing an OperationCanceledException with its own CancellationToken
     *  while the token was in signaled state, or the task's CancellationToken was already signaled before the
     *  task started executing.
     */
    Cancelled = 4,
    /**
     *  The task completed due to an unhandled exception.
     */
    Faulted = 5,
}
export default TaskStatus;
