///<reference path="System.ts"/>
///<reference path="IDisposable.ts"/>
///<reference path="Collections/ArrayUtility.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System
{
	// Provides a means for simplifying defining events on a class.
	export /*abstract*/ class EventHelperBase extends DisposableBase
	{
		constructor(protected _name: string)
		{

			super();

			if (!_name)
				throw 'ArgumentNullException("_name")';
		}

		get name(): string
		{
			return this._name;
		}

		add(listener: EventListener): void
		{
			throw "EventDispatcherBase.add Not Implemented.";
		}

		remove(listener: EventListener): void
		{
			throw "EventDispatcherBase.remove Not Implemented.";
		}

	}


	// Provides a means for simplifying defining events on a class.
	export class EventHelper extends EventHelperBase
	{
		constructor(
			name: string,
			private _onAdd: (listener: EventListener) => void,
			private _onRemove: (listener: EventListener) => void)
		{

			super(name);

			if (!_onAdd)
				throw 'ArgumentNullException("_onAdd")';
			if (!_onRemove)
				throw 'ArgumentNullException("_onRemove")';
		}

		add(listener: EventListener):void
		{
			this.assertIsNotDisposed();
			this._onAdd(listener);
		}

		remove(listener: EventListener): void
		{
			this.assertIsNotDisposed();
			this._onRemove(listener);
		}

		protected _onDisposed(): void
		{
			// Clear the references.
			this._onAdd = null;
			this._onRemove = null;
		}


	}

	// Sealed.
	Object.freeze(EventHelper);


	// Provides a means for simplifying defining events on a class.
	export class EventDispatcherHelper extends EventHelperBase
	{
		constructor(
			name: string,
			private _dispatcher: EventDispatcher)
		{

			super(name);

			if (!_dispatcher)
				throw 'ArgumentNullException("_dispatcher")';
		}

		add(listener: EventListener): void
		{
			var _ = this;
			_.assertIsNotDisposed();
			_._dispatcher.addEventListener(_._name,listener);
		}

		remove(listener: EventListener): void
		{
			var _ = this;
			_.assertIsNotDisposed();
			_._dispatcher.removeEventListener(_._name, listener);
		}

		protected _onDisposed(): void
		{
			// Clear the references.
			this._dispatcher = null;
		}


	}

	// Sealed.
	Object.freeze(EventHelper);
}