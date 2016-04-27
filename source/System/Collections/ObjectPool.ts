/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implmentations.
 * Uses .add(T) and .take():T
 */

import dispose from "../Disposable/dispose";
import DisposableBase from "../Disposable/DisposableBase";
import TaskHandler from "../Tasks/TaskHandler";
export default class ObjectPool<T> extends DisposableBase {

	private _pool:T[];
	private _trimmer:TaskHandler;
	private _flusher:TaskHandler;
	private _autoFlusher:TaskHandler;

	/**
	 * By default will clear after 5 seconds of non-use.
	 */
	autoClearTimeout:number = 5000;

	constructor(
		private _maxSize:number,
		private _generator:()=>T)
	{
		super();
		this._disposableObjectName = "ObjectPool";
		this._pool = [];
		this._trimmer = new TaskHandler(()=>this._trim());
		var clear = ()=>this._clear();
		this._flusher = new TaskHandler(clear);
		this._autoFlusher = new TaskHandler(clear);
	}

	/**
	 * Defines the maximum at which trimming should allow.
	 * @returns {number}
	 */
	get maxSize():number {
		return this._maxSize;
	}

	/**
	 * Current number of objects in pool.
	 * @returns {number}
	 */
	get count():number {
		var p = this._pool;
		return p ? p.length : 0;
	}

	protected _trim():void {
		if(this._pool.length>this._maxSize)
			this._pool.length = this._maxSize;
	}

	/**
	 * Will trim ensure the pool is less than the maxSize.
	 * @param defer A delay before trimming.  Will be overridden by later calls.
	 */
	trim(defer?:number):void {
		this.throwIfDisposed();
		this._trimmer.execute(defer);
	}

	protected _clear():void {
		this._trimmer.cancel();
		this._flusher.cancel();
		this._autoFlusher.cancel();
		this._pool.length = 0;
	}

	/**
	 * Will clear out the pool.
	 * Cancels any scheduled trims when executed.
	 * @param defer A delay before clearing.  Will be overridden by later calls.
	 */
	clear(defer?:number):void {
		this.throwIfDisposed();
		this._flusher.execute(defer);
	}

	toArrayAndClear():T[] {
		this.throwIfDisposed();
		this._trimmer.cancel();
		this._flusher.cancel();
		var p = this._pool;
		if(p) {
			this._pool = [];
			return p;
		}
	}

	/**
	 * Shortcut for toArrayAndClear();
	 */
	dump():T[] {
		return this.toArrayAndClear();
	}


	protected _onDispose():void
	{
		super._onDispose();
		this._generator = null;
		dispose(
			this._trimmer,
			this._flusher,
			this._autoFlusher
		);
		this._trimmer = null;
		this._flusher = null;
		this._autoFlusher = null;

		this._pool.length = 0;
		this._pool = null;
	}

	extendAutoClear():void {
		var _ = this, t = _.autoClearTimeout;
		if(isFinite(t) && !_._autoFlusher.isScheduled)
			_._autoFlusher.execute(t);
	}

	add(o:T):void {
		var _ = this;
		_.throwIfDisposed();
		_._pool.push(o);
		if(_._pool.length>_._maxSize)
			_._trimmer.execute(500);
		_.extendAutoClear();

	}

	take():T {
		var _ = this;
		_.throwIfDisposed();

		var e = _._pool.pop() || _._generator(),
			len = _._pool.length;

		if(_._pool.length<=_._maxSize)
			_._trimmer.cancel();
		if(len)
			_.extendAutoClear();
		
		return e;
	}



}
