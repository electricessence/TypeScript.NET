/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implmentations.
 * Uses .add(T) and .take():T
 */

import dispose from "./dispose";
import DisposableBase from "./DisposableBase";
import TaskHandler from "../Tasks/TaskHandler";
import ArgumentOutOfRangeException from "../Exceptions/ArgumentOutOfRangeException";
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
		if(_maxSize<1)
			throw new ArgumentOutOfRangeException('_maxSize',_maxSize,"Must be at least 1.");

		var _ = this;
		_._disposableObjectName = "ObjectPool";
		_._pool = [];
		_._trimmer = new TaskHandler(()=>_._trim());
		var clear = ()=>_._clear();
		_._flusher = new TaskHandler(clear);
		_._autoFlusher = new TaskHandler(clear);
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
		var pool = this._pool;
		while(pool.length>this._maxSize)
			dispose.withoutException(<any>pool.pop());
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
		var _ = this, p = _._pool;
		_._trimmer.cancel();
		_._flusher.cancel();
		_._autoFlusher.cancel();
		dispose.these(<any>p,true);
		p.length = 0;
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
		var _ = this;
		_.throwIfDisposed();
		_._trimmer.cancel();
		_._flusher.cancel();
		var p = _._pool;
		_._pool = [];
		return p;
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
		var _ = this;
		_._generator = null;
		dispose(
			_._trimmer,
			_._flusher,
			_._autoFlusher
		);
		_._trimmer = null;
		_._flusher = null;
		_._autoFlusher = null;

		_._pool.length = 0;
		_._pool = null;
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
