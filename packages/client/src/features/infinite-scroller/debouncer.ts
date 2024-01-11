export interface AsyncInterface {
	run(fn: Function, delay?: number): number;
	cancel(handle: number): void;
}


const debouncerQueue = new Set<Debouncer>();


/**
 * @summary Collapse multiple callbacks into one invocation after a timer.
 */
export class Debouncer {

	/**
	* Creates a debouncer if no debouncer is passed as a parameter
	* or it cancels an active debouncer otherwise. The following
	* example shows how a debouncer can be called multiple times within a
	* microtask and "debounced" such that the provided callback function is
	* called once. Add this method to a custom element:
	*
	* ```js
	* _debounceWork() {
	*   this._debounceJob = Debouncer.debounce(this._debounceJob,
	*       microTask, () => this._doWork());
	* }
	* ```
	*
	* If the `_debounceWork` method is called multiple times within the same
	* microtask, the `_doWork` function will be called only once at the next
	* microtask checkpoint.
	*
	* Note: In testing it is often convenient to avoid asynchrony. To accomplish
	* this with a debouncer, you can use `enqueueDebouncer` and
	* `flush`. For example, extend the above example by adding
	* `enqueueDebouncer(this._debounceJob)` at the end of the
	* `_debounceWork` method. Then in a test, call `flush` to ensure
	* the debouncer has completed.
	*
	* @param debouncer Debouncer object.
	* @param asyncModule Object with Async interface
	* @param callback Callback to run.
	* @return Returns a debouncer object.
	*/
	public static debounce(
		debouncer: Debouncer | null,
		asyncModule: AsyncInterface,
		callback: () => any,
	): Debouncer {
		if (debouncer instanceof Debouncer) {
			// Cancel the async callback, but leave in debouncerQueue if it was
			// enqueued, to maintain 1.x flush order
			debouncer._cancelAsync();
		}
		else {
			debouncer = new Debouncer();
		}

		debouncer.setConfig(asyncModule, callback);

		return debouncer;
	}

	protected _asyncModule: AsyncInterface;
	protected _callback: (() => any);
	protected _timer?: number;

	/**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param asyncModule Object with Async interface.
   * @param callback Callback to run.
   */
	public setConfig(asyncModule: AsyncInterface, callback: () => any): void {
		this._asyncModule = asyncModule;
		this._callback = callback;
		this._timer = this._asyncModule.run(() => {
			this._timer = undefined;
			debouncerQueue.delete(this);
			this._callback?.();
		});
	}

	/** Cancels an active debouncer and returns a reference to itself. */
	public cancel(): void {
		if (this._timer === undefined)
			return;

		this._cancelAsync();

		// Canceling a debouncer removes its spot from the flush queue,
		// so if a debouncer is manually canceled and re-debounced, it
		// will reset its flush order (this is a very minor difference from 1.x)
		// Re-debouncing via the `debounce` API retains the 1.x FIFO flush order
		debouncerQueue.delete(this);
	}

	/** Cancels a debouncer's async callback. */
	protected _cancelAsync(): void {
		if (this._timer === undefined)
			return;

		this._asyncModule.cancel(this._timer);
		this._timer = undefined;
	}

	/** Flushes an active debouncer and returns a reference to itself. */
	public flush(): void {
		if (this._timer === undefined)
			return;

		this.cancel();
		this._callback();
	}

	/**
   * Returns true if the debouncer is active.
   *
   * @return True if active.
   */
	public isActive(): boolean {
		return this._timer !== undefined;
	}

}


/**
 * Adds a `Debouncer` to a list of globally flushable tasks.
 *
 * @param debouncer Debouncer to enqueue
 */
export const enqueueDebouncer = (debouncer: Debouncer): void => {
	debouncerQueue.add(debouncer);
};


/**
 * Flushes any enqueued debouncers
 *
 * @return Returns whether any debouncers were flushed
 */
export const flushDebouncers = (): boolean => {
	const didFlush = !!debouncerQueue.size;

	// If new debouncers are added while flushing, Set.forEach will ensure
	// newly added ones are also flushed
	debouncerQueue.forEach((debouncer) => {
		try {
			debouncer.flush();
		}
		catch (e) {
			setTimeout(() => {
				throw e;
			});
		}
	});

	return didFlush;
};


export const flush = () => {
	let debouncers;
	do
		debouncers = flushDebouncers();
	while (debouncers);
};
