# javascript-interface-library #

various classification, validation and utility functions for JavaScript and TypeScript

From time to time, it's necessary to classify and/or validate the values of user inputs, data read from input streams (like files or network connections) or arguments passed as part of a function call. While TypeScript type annotations already eliminate the need for many of these tests, there still exist lots of interfaces to the outer (non-TypeScript) world where value checking remains important.

These situations are, what the `javascript-interface-library` has been made for.

**NPM users**: please consider the [Github README](https://github.com/rozek/javascript-interface-library/blob/main/README.md) for the latest description of this package (as updating the docs would otherwise always require a new NPM package version)

## Installation ##

`javascript-interface-library` may be used as an ECMAScript module (ESM), a CommonJS or AMD module or from a global variable.

You may either install the package into your build environment using [NPM](https://docs.npmjs.com/) with the command

```
npm install javascript-interface-library
```

or load the plain script file directly

```
<script src="https://unpkg.com/javascript-interface-library"></script>
```

## Access ##

How to access the package depends on the type of module you prefer

* ESM (or Svelte): `import { ValueIsListSatisfying, ValueIsOrdinal } from 'javascript-interface-library'`
* CommonJS: `const JIL = require('javascript-interface-library')`
* AMD: `require(['javascript-interface-library'], (JIL) => {...})`

Alternatively, you may access the global variable `JIL` directly.

Note for ECMAScript module users: all module functions and values are exported individually, thus allowing your bundler to perform some "tree-shaking" in order to include actually used functions or values (together with their dependencies) only.


## Usage within Svelte ##

For Svelte, it is recommended to import the package in a module context. From then on, its exports may be used as usual:

```
<script context="module">
  import { ValueIsListSatisfying, ValueIsOrdinal } from 'javascript-interface-library'
</script>

<script>
  console.log(ValueIsListSatisfying(
    [1,2,3,4], ValueIsOrdinal, 1,10
  ))
</script>
```

## Usage as ECMAscript, CommonJS or AMD Module (or as a global Variable) ##

Let's assume that you already "required" or "imported" (or simply loaded) the module according to your local environment. In that case, you may use it as follows:

```
console.log(JIL.ValueIsListSatisfying(
  [1,2,3,4], JIL.ValueIsOrdinal, 1,10
))
```

## API Reference ##

As shown above, the individual functions and values may either be accessed directly (when used as an ESM) or by prefixing them with their namespace `JIL` (in all other cases). The following documentation lists all module contents without namespace prefix only, and the shown function signatures are those used by TypeScript.

### Object Functions ###

The JavaScript `Object` class provides a few useful functions (or "static methods") for inspecting or converting a given object. Unfortunately, these functions are often used without prior checking whether the given target object actually inherits from the `Object` protoype or was built using `Object.create(null)` - and will fail whenever such a "vanilla" object is given.

`JIL` therefore contains the following functions which mimic their counterparts from the `Object` class, but succeed even if the given target object is "vanilla".

* **`Object_hasOwnProperty (Value:Object, PropertyName:string):boolean`**<br>returns `true` if the given `Value` contains a property with the name `PropertyName` as its own property - or `false` otherwise. This function mimics the JavaScript method [Object.hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
* **`Object_isPrototypeOf (Value:Object, Candidate:any):boolean`**<br>returns `true` if the given `Value` exists in the prototype chain of a given `Candidate` - or `false` otherwise. This function mimics the JavaScript method [Object.isPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)
* **`Object_propertyIsEnumerable (Value:Object, PropertyName:string):boolean`**<br>returns `true` if the given `Value` contains a property with the name `PropertyName` as its own property and that one is enumerable - or `false` otherwise. This function mimics the JavaScript method [Object.propertyIsEnumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)
* **`Object_toString (Value:Object):string`**<br>returns a string which represents the given `Value`. This function mimics the JavaScript method [Object.toString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)
* **`Object_toLocaleString (Value:Object):string`**<br>returns a locale-specific string which represents the given `Value`. This function mimics the JavaScript method [Object.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString)
* **`Object_valueOf (Value:Object):any`**<br>returns the primitive value of the given `Value` object. This function mimics the JavaScript method [Object.valueOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

### Value Classification Functions ###

The following functions check whether a given argument satisfies a certain constraint (e.g., belongs to a certain category) and return either `true` (if the constrain is met) or false otherwise.

* **`ValueExists (Value:any):boolean`**<br>returns `true` if the given `Value` exists, i.e., if it differs from both `null` and `undefined` - or `false` otherwise
* **`ValueIsMissing (Value:any):boolean`**<br>returns `true` if the given `Value` is either `null` or `undefined` - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsBoolean (Value:any):boolean`**<br>returns `true` if the given `Value` is either a primitive boolean value or an instance of `Boolean` - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsNumber (Value:any):boolean`**<br>returns `true` if the given `Value` is either a primitive numeric value or an instance of `Number` - or `false` otherwise
* **`ValueIsFiniteNumber (Value:any):boolean`**<br>returns `true` if the given `Value` is a finite number, i.e. a number which is not `NaN` and whose value is greater than negative and smaller than positive infinity - or `false` otherwise
* **`ValueIsNaN (Value:any):boolean`**<br>returns `true` if the given `Value` is `NaN` - or `false` otherwise
* **`ValueIsNumberInRange (Value:any, minValue?:number, maxValue?:number, withMin:boolean = true, withMax:boolean = true):boolean`**<br>returns `true` if the given `Value` is a number whose value is within the range given by `minValue` and `maxValue` - or `false` otherwise. `minValue` is optional and defaults to negative infinity, `maxValue` is also optional but defaults to positive infinity. When `true`, `withMin` indicates that `Value` may also be *equal* to the lower end of the given range, otherwise it must just be *greater than* the lower limit. When `true`, `withMax` indicates that `Value` may also be *equal* to the upper end of the given range, otherwise it must just be *lower than* the upper limit
* **`ValueIsInteger (Value:any):boolean`**<br>returns `true` if the given `Value` is a whole number - or `false` otherwise
* **`ValueIsIntegerInRange (Value:any, minValue?:number, maxValue?:number):boolean`**<br>returns `true` if the given `Value` is a whole number whose value is within the range given by `minValue` and `maxValue` - or `false` otherwise. `minValue` is optional and defaults to negative infinity, `maxValue` is also optional but defaults to positive infinity
* **`ValueIsOrdinal (Value:any):boolean`**<br>returns `true` if the given `Value` is a whole number greater than or equal to zero - or `false` otherwise
* **`ValueIsCardinal (Value:any):boolean`**<br>returns `true` if the given `Value` is a whole number greater than or equal to one - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsString (Value:any):boolean`**<br>returns `true` if the given `Value` is either a primitive literal value or an instance of `String` - or `false` otherwise
* **`ValueIsEmptyString (Value:any):boolean`**<br>returns `true` if the given `Value` is a string without any characters or with some content that consists of white-space characters only - or `false` otherwise
* **`ValueIsNonEmptyString (Value:any):boolean`**<br>returns `true` if the given `Value` is a string with some content that does not just consist of white-space characters - or `false` otherwise
* **`ValueIsStringMatching (Value:any, Pattern:RegExp):boolean`**<br>returns `true` if the given `Value` is a string whose content matches the given regular expression `Pattern` - or `false` otherwise
* **`ValueIsText (Value:any):boolean`**<br>returns `true` if the given `Value` is a string containing "ordinary" text only (i.e., a string which lacks any kind of control characters except \\n or \\r) - or `false` otherwise
* **`ValueIsTextline (Value:any):boolean`**<br>returns `true` if the given `Value` is a string containing a single line of "ordinary" text only (i.e., a string which lacks any kind of control characters) - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsFunction (Value:any):boolean`**<br>returns `true` if the given `Value` is a JavaScript function - or `false` otherwise
* **`ValueIsAnonymousFunction (Value:any):boolean`**<br>returns `true` if the given `Value` is an anonymous JavaScript function (i.e., a function without a `name` property)  - or `false` otherwise
* **`ValueIsNamedFunction (Value:any):boolean`**<br>returns `true` if the given `Value` is a "named" JavaScript function (i.e., a function with a non-empty `name` property) - or `false` otherwise
* **`ValueIsNativeFunction (Value:any):boolean`**<br>returns `true` if the given `Value` is a native JavaScript function - or `false` otherwise
* **`ValueIsScriptedFunction (Value:any):boolean`**<br>returns `true` if the given `Value` is a scripted JavaScript function - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsObject (Value:any):boolean`**<br>returns `true` if the given `Value` is a JavaScript object (and not `null`) - or `false` otherwise
* **`ValueIsPlainObject (Value:any):boolean`**<br>returns `true` if the given `Value` is a JavaScript object (different from `null`) which directly inherits from `Object` (such as a Javascript object literal) - or `false` otherwise
* **`ValueIsVanillaObject (Value:any):boolean`**<br>returns `true` if the given `Value` is a JavaScript object which has been built using `Object.create(null)` - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsArray (Value:any):boolean`**<br>returns `true` if the given `Value` is an `Array` instance - or `false` otherwise. If given, `minLength` specifies the minimal required list length and `maxLength` specifies the maximal allowed list length
* **`ValueIsList (Value:any, minLength?:number, maxLength?:number):boolean`**<br>returns `true` if the given `Value` is a "dense" JavaScript array (i.e., an array whose indices 0...n-1 all exist, where n is the `length` of the given array) - or `false` otherwise
* **`ValueIsListSatisfying (Value:any, Validator:Function, minLength?:number, maxLength?:number):boolean`**<br>returns `true` if the given `Value` is a "dense" JavaScript array, whose elements all pass the given `Validator` - or `false` otherwise. `Validator` is a function which receives a list element as its sole argument and returns `true` if the given element is "valid" or `false` otherwise. If given, `minLength` specifies the minimal required list length and `maxLength` specifies the maximal allowed list length<br>&nbsp;<br>
* **`ValueIsInstanceOf (Value:any, Constructor:Function):boolean`**<br>returns `true` if the given `Value` was constructed using the given `Constructor` function - or `false` otherwise
* **`ValueInheritsFrom (Value:any, Prototype:Object):boolean`**<br>returns `true` if `Prototype` exists in the prototype chain of the given `Value` - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsDate (Value:any):boolean`**<br>returns `true` if the given `Value` is a `Date` instance - or `false` otherwise
* **`ValueIsError (Value:any):boolean`**<br>returns `true` if the given `Value` is an `Error` instance  - or `false` otherwise
* **`ValueIsPromise (Value:any):boolean`**<br>returns `true` if the given `Value` is a "Promise", i.e., an object with a property named `then` which contains a function - or `false` otherwise
* **`ValueIsRegExp (Value:any):boolean`**<br>returns `true` if the given `Value` is a `RegExp` instance - or `false` otherwise<br>&nbsp;<br>
* **`ValueIsOneOf (Value:any, ValueList:any[]):boolean`**<br>returns `true` if the given `Value` equals (at least) one of the items found in the given `ValueList` - or `false` otherwise. Equality is checked using the JavaScript `===` operator<br>&nbsp;<br>
* **`ValueIsColor (Value:any):boolean`**<br>returns `true` if the given `Value` is a string containing a syntactically valid CSS color specification - or `false` otherwise
* **`ValueIsEMailAddress (Value:any):boolean`**<br>returns `true` if the given `Value` is a string containing a syntactically valid EMail address - or `false` otherwise
* **`ValueIsURL (Value:any):boolean`**<br>returns `true` if the given `Value` is a string containing a syntactically valid URL - or `false` otherwise

### Argument Validation Functions ###

The following functions check whether a given argument satisfies a certain constraint (e.g., belongs to a certain category) and either return the given argument (sometimes after some normalization), if the constrain is met, or throw an error otherwise.

Unless stated otherwise, these functions exist in four different "flavours", as indicated by their name prefixes:

* `allowXXX`<br>validates the given argument and returns it, if it is either missing (i.e., equals `null` or `undefined`) or meets the condition defined for `XXX` - or throws an exception otherwise
* `allwedXXX`<br>synonym for `allowXXX`, looks better when used as an expression
* `expectXXX`<br>validates the given argument and returns it, if it exists (i.e., differs both from `null` and `undefined`) and meets the condition defined for `XXX` - or throws an exception otherwise  
* `expectedXXX`<br>synonym for `expectXXX`, looks better when used as an expression

For the sake of clarity, however, only the first "flavour" (namely `allowXXX`) is shown in the list below (provided that this flavour actually exists).

* **`expectValue (Description:string, Argument:any):any`**<br>checks if the given `Argument` exists (i.e., if it differs from both `null` and `undefined`). If this is the case, the function returns the given `Argument`, otherwise an error with the message `"no ${Description} given"` is thrown, which uses the given `Description` argument. Please note: this function does not exist in the flavours `allowXXX` or `allowedXXX`<br>&nbsp;<br>
* **`allowBoolean (Description:string, Argument:any):boolean|null|undefined`**<br>checks if the given `Argument` is either a primitive boolean value or an instance of `Boolean`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error with the message `"the given ${Description} is no valid boolean value"` is thrown, which uses the given `Description`<br>&nbsp;<br>
* **`allowNumber (Description:string, Argument:any):number|null|undefined`**<br>checks if the given `Argument` is either a primitive numeric value or an instance of `Number`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error with the message `"the given ${Description} is no valid numeric value"` is thrown, which uses the given `Description`
* **`allowFiniteNumber (Description:string, Argument:any):number|null|undefined`**<br>checks if the given `Argument` is a finite number, i.e. a number which is not `NaN` and whose value is greater than negative and smaller than positive infinity. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowNaN (Description:string, Argument:any):number|null|undefined`**<br>checks if the given `Argument` is `NaN`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowNumberInRange (Description:string, Argument:any, minValue?:number, maxValue?:number, withMin?:boolean, withMax?:boolean):number|null|undefined`**<br>checks if the given `Argument` is a number whose value is within the range given by `minValue` and `maxValue`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`. `minValue` is optional and defaults to negative infinity, `maxValue` is also optional but defaults to positive infinity. When true, `withMin` indicates that `Value` may also be *equal* to the lower end of the given range, otherwise it must just be *greater than* the lower limit. When true, `withMax` indicates that `Value` may also be *equal* to the upper end of the given range, otherwise it must just be *lower than* the upper limit
* **`allowInteger (Description:string, Argument:any):number|null|undefined`**<br>checks if the given `Argument` is a whole number. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowIntegerInRange (Description:string, Argument:any, minValue?:number, maxValue?:number):number|null|undefined`**<br>checks if the given `Argument` is a whole number whose value is within the range given by `minValue` and `maxValue`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`. `minValue` is optional and defaults to negative infinity, `maxValue` is also optional but defaults to positive infinity
* **`allowOrdinal (Description:string, Argument:any):number|null|undefined`**<br>checks if the given `Argument` is a whole number greater than or equal to zero. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowCardinal (Description:string, Argument:any):number|null|undefined`**<br>checks if the given `Argument` is a whole number greater than or equal to one. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`<br>&nbsp;<br>
* **`allowString (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is either a primitive literal value or an instance of `String`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error with the message `"the given ${Description} is no valid literal string"` is thrown, which uses the given `Description`
* **`allowNonEmptyString (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is a string with some content that does not just consist of white-space characters. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowStringMatching (Description:string, Argument:any, Pattern:RegExp):string|null|undefined`**<br>checks if the given `Argument` is a string whose content matches the given regular expression `Pattern`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowText (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is a string containing "ordinary" text only (i.e., a string which lacks any kind of control characters except \\n or \\r). If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowTextline (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is a string containing a single line of "ordinary" text only (i.e., a string which lacks any kind of control characters). If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`<br>&nbsp;<br>
* **`allowFunction (Description:string, Argument:any):Function|null|undefined`**<br>checks if the given `Argument` is a JavaScript function. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowAnonymousFunction (Description:string, Argument:any):Function|null|undefined`**<br>checks if the given `Argument` is an anonymous JavaScript function (i.e., a function without a name property). If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowNamedFunction (Description:string, Argument:any):Function|null|undefined`**<br>checks if the given `Argument` is a "named" JavaScript function (i.e., a function with a non-empty `name` property). If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowNativeFunction (Description:string, Argument:any):Function|null|undefined`**<br>checks if the given `Argument` is a native JavaScript function. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowScriptedFunction (Description:string, Argument:any):Function|null|undefined`**<br>checks if the given `Argument` is a scripted JavaScript function. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`<br>&nbsp;<br>
* **`allowObject (Description:string, Argument:any):any|null|undefined`**<br>checks if the given `Argument` is a JavaScript object (and not `null`). If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowPlainObject (Description:string, Argument:any):any|null|undefined`**<br>checks if the given `Argument` is a JavaScript object (different from `null`) which directly inherits from `Object` (such as a Javascript object literal). If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowVanillaObject (Description:string, Argument:any):any|null|undefined`**<br>checks if the given `Argument` is a JavaScript object which has been built using `Object.create(null)`. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`<br>&nbsp;<br>
* **`allowArray (Description:string, Argument:any):any[]|null|undefined`**<br>checks if the given `Argument` is an `Array` instance. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowList (Description:string, Argument:any, Expectation?:string,minLength?:number, maxLength?:number):any[]|null|undefined`**<br>checks if the given `Argument` is a "dense" JavaScript array (i.e., an array whose indices 0...n-1 all exist, where n is the length of the given array). If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`. If given, `minLength` specifies the minimal required list length and `maxLength` specifies the maximal allowed list length
* **`allowListSatisfying (Description:string, Argument:any, Validator:(Value:any) => boolean,Expectation?:string, minLength?:number, maxLength?:number):any[]|null|undefined`**<br>checks if the given `Argument` is a "dense" JavaScript array, whose elements all pass the given `Validator`. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`. `Validator` is a function which receives a list element as its sole argument and returns `true` if the given element is "valid" or `false` otherwise. If given, `minLength` specifies the minimal required list length and `maxLength` specifies the maximal allowed list length<br>&nbsp;<br>
* **`allowInstanceOf (Description:string, Argument:any, constructor:Function, Expectation:string):any|null|undefined`**<br>checks if the given `Argument` was constructed using the given `Constructor` function. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowValueInheritingFrom (Description:string, Argument:any, prototype:any, Expectation:string):any|null|undefined`**<br>checks if  `Prototype` exists in the prototype chain of the given `Argument`. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`<br>&nbsp;<br>
* **`allowDate (Description:string, Argument:any):Date|null|undefined`**<br>checks if the given `Argument` is a `Date` instance. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowError (Description:string, Argument:any):Error|null|undefined`**<br>checks if the given `Argument` is an `Error` instance. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowPromise (Description:string, Argument:any):any|null|undefined`**<br>checks if the given `Argument` is a "Promise", i.e., an object with a property named `then` which contains a function. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowRegExp (Description:string, Argument:any):RegExp|null|undefined`**<br>checks if the given `Argument` is a `RegExp` instance. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`<br>&nbsp;<br>
* **`allowOneOf (Description:string, Argument:any, ValueList:any[]):any|null|undefined`**<br>checks if the given `Argument` equals (at least) one of the items found in the given `ValueList`. If this is the case, the function returns the given `Argument`, otherwise an error is thrown whose message contains the given `Description`. Equality is checked using the JavaScript `===` operator<br>&nbsp;<br>
* **`allowColor (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is a string containing a syntactically valid CSS color specification. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowEMailAddress (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is a string containing a syntactically valid EMail address. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`
* **`allowURL (Description:string, Argument:any):string|null|undefined`**<br>checks if the given `Argument` is a string containing a syntactically valid URL. If this is the case, the function returns the primitive value of the given `Argument`, otherwise an error is thrown whose message contains the given `Description`

### Utility Functions ###

* **`throwError (Message:string):never`**<br>this function has been provided in order to simplify throwing "named" `Error` instances: if the given `Message` starts with a JavaScript identifier followed by a colon, identifier and colon are stripped apart and the identifier is used as the `name` property of a newly constructed `Error` instance for the remaining part of `Message`. Otherwise, this function is equivalent to `throw new Error(Message)` <br>&nbsp;<br>
* **`ObjectMergedWith (TargetObject:object, ...otherObjectList:object[]):object`**<br>`Object.assign` can not be used to copy properties with getters and setters from one object into another - this is what `ObjectMergedWith` is good for: it copies the descriptors of all *own* properties from any object found in `otherObjectList` into the given `TargetObject` and also returns that object as its function result. Any  descriptor already existing for a given property in `TargetObject` will be overwritten<br>&nbsp;<br>
* **`constrained (Value:number, Minimum:number = -Infinity, Maximum:number = Infinity):number`**<br>limits the given `Value` to the range specified by `Minimum` and `Maximum` - i.e., the function returns `Minimum` if `Value` is less than (or equal to) `Minimum`, `Maximum` if `Value` is greater than (or equal to) `Maximum`, or `Value` itself otherwise. `Minimum` and `Maximum` are optional and default to `-Infinity` or `+Infinity`, resp.<br>&nbsp;<br>
* **`escaped (Text:string):string`**<br>returns a copy of the given `Text` in which all control characters have been replaced by their corresponding escape sequences
* **`unescaped (Text:string):string`**<br>returns a copy of the given `Text` in which all character escape sequences have been replaced by their corresponding (control) characters<br>&nbsp;<br>
* **`quotable (Text:string, Quote:'"' | "'" = '"'):string`**<br>returns a copy of the given `Text` in which all control characters and `Quote`s have been replaced by their corresponding escape sequences. The outcome of this function may, f.e., used to construct literal values in JSON files. `Quote` is optional and defaults to the double-quotes character
* **`quoted (Text:string, Quote:'"' | "'" = '"'):string`**<br>returns a copy of the given `Text` (embedded within a pair of `Quote`s) in which all control characters and `Quote`s have been replaced by their corresponding escape sequences. The outcome of this function may, f.e., used to construct literal values in JSON files. `Quote` is optional and defaults to the double-quotes character<br>&nbsp;<br>
* **`HTMLsafe (Argument:string, EOLReplacement?:string):string`**<br>returns a copy of the given `Argument` in which all control characters (except `\n`) and characters with a special meaning for HTML have been replaced by their corresponding HTML entities. Any linefeed characters (`\n`) will be replaced by the given `EOLReplacement` string - specification of `EOLReplacement` is optional and defaults to `<br/>`
* **`MarkDownSafe (Argument:string, EOLReplacement?:string):string`**<br>returns a copy of the given `Argument` in which all control characters (except `\n`) and characters with a special meaning for (HTML and) Markdown have been replaced by their corresponding HTML entities. Any linefeed characters (`\n`) will be replaced by the given `EOLReplacement` string - specification of `EOLReplacement` is optional and defaults to `<br/>`<br>&nbsp;<br>
* **`ValuesDiffer (thisValue:any, otherValue:any):boolean`**<br>returns `true` if `thisValue` differs from `otherValue` - or `false` otherwise. Equality is checked by inspection, i.e., `null`, `undefined`, booleans, strings and functions are checked using the JavaScript `===` operator, comparison of numbers also takes care of `NaN` and a potential deviation by `Number.EPSILON` and objects or arrays are compared element by element
* **`ValuesAreEqual (thisValue:any, otherValue:any):boolean`**<br>returns `true` if `thisValue` equals to `otherValue` - or `false` otherwise. Equality is checked by inspection, i.e., `null`, `undefined`, booleans, strings and functions are checked using the JavaScript `===` operator, comparison of numbers also takes care of `NaN` and a potential deviation by `Number.EPSILON` and objects or arrays are compared element by element<br>&nbsp;<br>
* **`ObjectIsEmpty (Candidate:any):boolean`**<br>returns true if the given `Candidate` is an empty object (i.e., an object without any *own* properties) - or `false` otherwise
* **`ObjectIsNotEmpty (Candidate:any):boolean`**<br>returns true if the given `Candidate` is a non-empty empty object (i.e., an object with at least one *own* property) - or `false` otherwise
* **`StringIsEmpty (Candidate:string):boolean`**<br>returns true if the given `Candidate` is an empty string (i.e., a string which either contains no characters at all or only whitespace characters) - or `false` otherwise
* **`StringIsNotEmpty (Candidate:string):boolean`**<br>returns true if the given `Candidate` is a non-empty string (i.e., a string which contains one or more characters and not all of them are whitespace characters) - or `false` otherwise<br>&nbsp;<br>
* **`ValidatorForClassifier (Classifier:(Value:any) => boolean, NilIsAcceptable:boolean, Expectation:string):Function`**<br>this function is used internally to construct many of the offered argument validation functions: it returns a new function which takes a `Description` and an `Argument`, uses the given `Classifier` to check if `Argument` belongs to the expected category of values and - if it does - returns the primitive value of the given `Argument`. Otherwise, an error message is constructed, which includes the given `Description` and complains about the given value not being a "valid ${Expectation}" - i.e., `Expectation` should describe the expected kind of argument. If set to `true`, `NilIsAcceptable` indicates that `Argument` may be missing (i.e., `null` or `undefined`), otherwise the given `Argument` is mandatory.<br>&nbsp;<br>**Important Note**: if you plan to develop a library which may be "tree-shaked" by application bundlers (such as WebPack and Rollup) and export functions built with `ValidatorForClassifier`, you should mark all invocations of `ValidatorForClassifier` as "free of side-effects" by prepending them with `/*#__PURE__*/` - otherwise those invocations will remain in the bundled code even if you don't use the corresponding exports
* **`validatedArgument (Description:string, Argument:any, ValueIsValid:(Value:any) => boolean,NilIsAcceptable:boolean, Expectation:string):any|null|undefined`**<br>this function is used internally to actually validate a given `Argument` and throw an `Error` with a message containing the given `Description`, if not. `ValueIsValid` is the function used check `Argument` and should return `true` if `Argument` is "valid" or `false` if not. If set to `true`, `NilIsAcceptable` indicates that `Argument` may be missing (i.e., `null` or `undefined`), otherwise the given `Argument` is mandatory. If validation fails, an error message is constructed, which includes the given `Description` and complains about the given value not being a "valid ${Expectation}" - i.e., `Expectation` should describe the expected kind of argument<br>&nbsp;<br>
* **`FunctionWithName (originalFunction:Function, desiredName:string|String):Function`**<br>this function is used internally to convert an anonymous function `originalFunction` into a named one - either by setting the `desiredName` for the existing function or by wrapping it into a new function with that name

### Color Utilities ###

* **`ColorSet`**<br>is an object, whose keys are the names of all colors known by (and built into) a web browser and the corresponding values are the RGBA specifications of these colors
* **`HexColor (Color:string):string`**<br>converts a given `Color` string (which must be a valid CSS color specification) into the long hexadecimal format (`#rrggbbaa`)
* **`shortHexColor (Color:string):string`**<br>converts a given `Color` string (which must be a valid CSS color specification) into the short hexadecimal format (`#rrggbb`) - such a format must be used for HTML input elements of type "color"
* **`RGBAColor (Color:string):string`**<br>converts a given `Color` string (which must be a valid CSS color specification) into the RGBA format (`rgba(r,g,b,a)`)

## Build Instructions ##

You may easily build this package yourself.

Just install [NPM](https://docs.npmjs.com/) according to the instructions for your platform and follow these steps:

1. either clone this repository using [git](https://git-scm.com/) or [download a ZIP archive](https://github.com/rozek/javascript-interface-library/archive/refs/heads/main.zip) with its contents to your disk and unpack it there 
2. open a shell and navigate to the root directory of this repository
3. run `npm install` in order to install the complete build environment
4. execute `npm run build` to create a new build

If you made some changes to the source code, you may also try

```
npm run agadoo
```

in order to check if the result is still tree-shakable.

You may also look into the author's [build-configuration-study](https://github.com/rozek/build-configuration-study) for a general description of his build environment.

## License ##

[MIT License](LICENSE.md)
