#LINQ

Exported in this module is the ```Enumerable``` class which contains
all available LINQ methods you would expect.

Because the notion of 'extensions' in JavaScript is not as simple and elegant
as C#, it was important to allow for flexibility of use.

### Usage

```Enumerable.from(source)``` will return an ```Enumerable``` wrapper for LINQ access to the source.

Source values that work:
* Any object which has a ```.getEnumerator()``` method attached to it.  See ```IEnumerator``` in System/Collections/Enumerable.
* Arrays or objects analogous to arrays (have a ```.length``` property and index by number).

#### TypeScript or ES6
```typescript
import Enumerable from 'typescript-dotnet/dist/es6/System.Linq/Linq';
 
var sourceData = ['a','b','c','c','d'];
 
var myEnumerable = Enumerable.from(sourceData);

console.log(
	myEnumerable.count(x=>x=='c'), // 2
	myEnumerable.any(x=>x=='e'), // false
);
```

#### JavaScript (requirejs, ES5)
```javascript
require('[path or alias to package root]/dist/umd.min/System.Linq/Linq',function(Enumerable){
	 
	var sourceData = ['a','b','c','c','d'];
	 
	var myEnumerable = Enumerable.from(sourceData);
	
	console.log(
		myEnumerable.count(function(x){return x=='c'}), // 2
		myEnumerable.any(function(x){return x=='e'}), // false
	);
});
```

#### JavaScript (NodeJS, ES5)
```javascript
var Enumerable = require('typescript-dotnet/dist/commonjs/System.Linq/Linq');
	 
var sourceData = ['a','b','c','c','d'];
 
var myEnumerable = Enumerable.from(sourceData);

console.log(
	myEnumerable.count(function(x){return x=='c'}), // 2
	myEnumerable.any(function(x){return x=='e'}), // false
);
```
