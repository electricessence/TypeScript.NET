# ```TypeValidator<T>```

## Benefits
- Allows for run-time validation and checking of dynamic types as well as integrated type-guarding.
- Super easy to use, basically only requires a copy paste.
- Works with literals!

## Usage

#### Step 1: Declare the expected type/interface.
```typescript
interface MyType
{
	a:Object,
	b:String,
	c:Number,
	d:Boolean,
	e:{
		f:String,
		g:Boolean,
		h:[
			Number,
			Boolean,
			String
			]
	}
}

```
#### Step 2: Copy the interface as an actual object and ```<type>``` the validator
```typescript
const MyTypeValidator = new TypeValidator<MyType>(
	{
		a: Object,
		b: String,
		c: Number,
		d: Boolean,
		e: {
			f: String,
			g: Boolean,
			h: [
				Number,
				Boolean,
				String
			]
		}
	}
);
```
#### Step 3: validate as many times as you want:
```typescript
var myItem = {
	a: {},
	b: "hello",
	c: 1,
	d: true,
	e: {
		f: "whatever",
		g: false,
		h: [
			0,
			true,
			"2"
		]
	},
	i: "noise"
};

// no compile-time type errors!
if(MyTypeValidator.isSubsetOf(myItem))
{
	console.log(myItem.e.h.length); // 3
	console.log(myItem.b); // "hello"
} else {
	throw new Error("Invalid type!");
}
```
