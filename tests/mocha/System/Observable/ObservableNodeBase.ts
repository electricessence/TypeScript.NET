///<reference types="node"/>
import * as assert from "assert";
import ObservableNodeBase from "../../../../dist/commonjs/System/Observable/ObservableNodeBase";


it("should receive signals only when subscribed", ()=>
{
	const ERR = "err";
	const o = new ObservableNodeBase<number>();

	let completed = false;
	let count = 0;
	let s1 = o.subscribe(
		v=>
		{
			assert.equal(completed,false);
			assert.equal(v, 1);
		},
		err=>
		{
			assert.equal(completed,false);
			assert.equal(err,ERR);
		}
	);
	o.subscribe({
		onNext: v=>
		{
			assert.equal(completed,false);
			assert.equal(v, count);
		},
		onCompleted:()=>
		{
			completed = true;
		}
	});

	o.onNext(++count);
	o.onError(ERR);

	s1.dispose();

	assert.equal(completed,false);
	o.onCompleted();
	assert.equal(completed,true);

	o.onNext(++count);
	o.onError(ERR);



	o.dispose();

	assert.throws(()=>
	{
		o.subscribe(()=>
		{
			assert.ok(false);
		});
	});


	assert.doesNotThrow(()=>
	{
		o.onNext(0);
	});


});
