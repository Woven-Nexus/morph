/**
 * Async interface wrapper around `setTimeout`.
 *
 * @summary Async interface wrapper around `setTimeout`.
 */
export const timeOut = {
	/**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @param delay Time to wait before calling callbacks in ms
   * @return An async timeout interface
   */
	after(delay: number) {
		return {
			run(fn: TimerHandler): number {
				return window.setTimeout(fn, delay);
			},
			cancel(handle: number) {
				window.clearTimeout(handle);
			},
		};
	},
	/**
   * Enqueues a function called in the next task.
   *
   * @param fn Callback to run
   * @param delay Delay in milliseconds
   * @return Handle used for canceling task
   */
	run(fn: TimerHandler, delay: number): number {
		return window.setTimeout(fn, delay);
	},
	/**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @param handle Handle returned from `run` of callback to cancel
   */
	cancel(handle: number): void {
		window.clearTimeout(handle);
	},
};
