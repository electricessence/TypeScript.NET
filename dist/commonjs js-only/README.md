This package is a distribution for [typescript-dotnet](https://www.npmjs.com/package/typescript-dotnet).  
https://www.npmjs.com/package/typescript-dotnet

The [typescript-dotnet](https://www.npmjs.com/package/typescript-dotnet) package includes the source code along with unminified UMD JavaScript and will function perfectly within another project but requires a reference to the ```/source/``` folder.

It is recommended you select the module type that you intend to use:

* [```typescript-dotnet-umd```](https://www.npmjs.com/package/typescript-dotnet-umd)
* [```typescript-dotnet-es6```](https://www.npmjs.com/package/typescript-dotnet-es6)
* [```typescript-dotnet-commonjs```](https://www.npmjs.com/package/typescript-dotnet-commonjs)
* [```typescript-dotnet-amd```](https://www.npmjs.com/package/typescript-dotnet-amd)
* [```typescript-dotnet-system```](https://www.npmjs.com/package/typescript-dotnet-system)


---

##### Examples:

The following example will install the UMD version which works with both CommonJS and AMD module types.

```
npm install typescript-dotnet-umd
```

...

*Note: WebPack has trouble with UMD. Use CommonJS or AMD if you intend to use WebPack.*

```
npm install typescript-dotnet-commonjs
```

or

```
npm install typescript-dotnet-amd
```
