//----------------------------------------------------------------------------//
//                        JavaScript Interface Library                        //
//----------------------------------------------------------------------------//

/**** get a reference to the "global" object ****/

  export const global = /*#__PURE__*/ Function('return this')()
// see https://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript

//------------------------------------------------------------------------------
//--                             Object Functions                             --
//------------------------------------------------------------------------------
// allow methods from Object.prototype to be applied to "vanilla" objects

/**** Object_hasOwnProperty ****/

  export function Object_hasOwnProperty (Value:Object, PropertyName:string):boolean {
    return (
      (Value == null) ||              // let this method crash like its original
      ('hasOwnProperty' in Value) && (typeof Value.hasOwnProperty === 'function')
      ? Value.hasOwnProperty(PropertyName)
      : Object.prototype.hasOwnProperty.call(Value,PropertyName)
    )
  }

/**** Object_isPrototypeOf ****/

  export function Object_isPrototypeOf (Value:Object, Candidate:any):boolean {
    return (
      (Value == null) ||              // let this method crash like its original
      ('isPrototypeOf' in Value) && (typeof Value.isPrototypeOf === 'function')
      ? Value.isPrototypeOf(Candidate)
      : Object.prototype.isPrototypeOf.call(Value,Candidate)
    )
  }

/**** Object_propertyIsEnumerable ****/

  export function Object_propertyIsEnumerable (Value:Object, PropertyName:string):boolean {
    return (
      (Value == null) ||              // let this method crash like its original
      ('propertyIsEnumerable' in Value) && (typeof Value.propertyIsEnumerable === 'function')
      ? Value.propertyIsEnumerable(PropertyName)
      : Object.prototype.propertyIsEnumerable.call(Value,PropertyName)
    )
  }

/**** Object_toString ****/

  export function Object_toString (Value:Object):string {
    return (
      (Value == null) ||              // let this method crash like its original
      ('toString' in Value) && (typeof Value.toString === 'function')
      ? Value.toString()
      : Object.prototype.toString.call(Value)
    )
  }

/**** Object_toLocaleString ****/

  export function Object_toLocaleString (Value:Object):string {
    return (
      (Value == null) ||              // let this method crash like its original
      ('toLocaleString' in Value) && (typeof Value.toLocaleString === 'function')
      ? Value.toLocaleString()
      : Object.prototype.toString.call(Value)
    ) // a missing "toLocaleString" method will crash Object.prototype.toLocaleString
  }

/**** Object_valueOf ****/

  export function Object_valueOf (Value:Object):any {
    return (
      (Value == null) ||              // let this method crash like its original
      ('valueOf' in Value) && (typeof Value.valueOf === 'function')
      ? Value.valueOf()
      : Object.prototype.valueOf.call(Value)
    )
  }

/**** ObjectMergedWith ****/

  export function ObjectMergedWith (
    TargetObject:object, ...otherObjectList:object[]
  ):object {
    for (let i = 0, l = otherObjectList.length; i < l; i++) {
      let otherObject = otherObjectList[i]
      if (otherObject == null) { continue }

      if (typeof otherObject === 'object') {
        for (let Key in otherObject) {
          let Descriptor = Object.getOwnPropertyDescriptor(otherObject,Key)
          if (Descriptor != null) {
            Object.defineProperty(TargetObject,Key,Descriptor)
          }
        }
      } else {
        throwError('InvalidArgument: argument #' + (i+1) + ' is not an object')
      }
    }

    return TargetObject
  }

/**** throwError - simplifies construction of named errors ****/

  export function throwError (Message:string):never {
    let Match = /^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(Message)
    if (Match == null) {
      throw new Error(Message)
    } else {
      let namedError = new Error(Match[2])
        namedError.name = Match[1]
      throw namedError
    }
  }

//------------------------------------------------------------------------------
//--                      Value Classification Functions                      --
//------------------------------------------------------------------------------

/**** ValueExists ****/

  export function ValueExists (Value:any):boolean {
    return (Value != null)
  }

/**** ValueIsMissing ****/

  export function ValueIsMissing (Value:any):boolean {
    return (Value == null)
  }

/**** ValueIsBoolean ****/

  export function ValueIsBoolean (Value:any):boolean {
    return (typeof Value === 'boolean') || (Value instanceof Boolean)
  }

/**** ValueIsNumber ****/

  export function ValueIsNumber (Value:any):boolean {
    return (typeof Value === 'number') || (Value instanceof Number)
  }

/**** ValueIsFiniteNumber (pure "isFinite" breaks on objects) ****/

  export function ValueIsFiniteNumber (Value:any):boolean {
    return (
      (typeof Value === 'number') || (Value instanceof Number)
    ) && isFinite(Value.valueOf())
  }

/**** ValueIsNaN (numeric, but NaN - this differs from pure "isNaN") ****/

  export function ValueIsNaN (Value:any):boolean {
    return (
      (typeof Value === 'number') || (Value instanceof Number)
    ) && isNaN(Value.valueOf())
  }

/**** ValueIsNumberInRange ****/

  export function ValueIsNumberInRange (
    Value:any, minValue?:number, maxValue?:number,
    withMin:boolean = true, withMax:boolean = true
  ):boolean {
    if (! ValueIsNumber(Value) || isNaN(Value)) { return false }

    if (ValueIsFiniteNumber(minValue)) {    // more robust than "isFinite" alone
      if (ValueIsFiniteNumber(maxValue)) {  // more robust than "isFinite" alone
        if (
          (Value < (minValue as Number)) || (! withMin && (Value === minValue)) ||
          (Value > (maxValue as Number)) || (! withMax && (Value === maxValue))
        ) {
          return false
        }
      } else {
        if ((Value < (minValue as Number)) || (! withMin && (Value === minValue))) {
          return false
        }
      }
    } else {
      if (ValueIsFiniteNumber(maxValue)) {  // more robust than "isFinite" alone
        if ((Value > (maxValue as Number)) || (! withMax && (Value === maxValue))) {
          return false
        }
      }
    }

    return true
  }

/**** ValueIsInteger ****/

  export function ValueIsInteger (Value:any):boolean {
    if ((typeof Value !== 'number') && ! (Value instanceof Number)) {
      return false
    }

    Value = Value.valueOf()
    return isFinite(Value) && (Math.round(Value) === Value)
  }

/**** ValueIsIntegerInRange ****/

  export function ValueIsIntegerInRange (
    Value:any, minValue?:number, maxValue?:number
  ):boolean {
    if (! ValueIsInteger(Value) || isNaN(Value)) { return false }

    if (ValueIsFiniteNumber(minValue)) {    // more robust than "isFinite" alone
      if (ValueIsFiniteNumber(maxValue)) {  // more robust than "isFinite" alone
        if ((Value < (minValue as Number)) || (Value > (maxValue as Number))) {
          return false
        }
      } else {
        if (Value < (minValue as Number)) {
          return false
        }
      }
    } else {
      if (ValueIsFiniteNumber(maxValue)) {  // more robust than "isFinite" alone
        if (Value > (maxValue as Number)) {
          return false
        }
      }
    }

    return true
  }

/**** ValueIsOrdinal ****/

  export function ValueIsOrdinal (Value:any):boolean {
    if ((typeof Value !== 'number') && ! (Value instanceof Number)) {
      return false
    }

    Value = Value.valueOf()
    return isFinite(Value) && (Math.round(Value) === Value) && (Value >= 0)
  }

/**** ValueIsCardinal ****/

  export function ValueIsCardinal (Value:any):boolean {
    if ((typeof Value !== 'number') && ! (Value instanceof Number)) {
      return false
    }

    Value = Value.valueOf()
    return isFinite(Value) && (Math.round(Value) === Value) && (Value >= 1)
  }

/**** ValueIsString ****/

  export function ValueIsString (Value:any):boolean {
    return (typeof Value === 'string') || (Value instanceof String)
  }

/**** ValueIs[Non]EmptyString ****/

  const emptyStringPattern = /^\s*$/

  export function ValueIsEmptyString (Value:any):boolean {
    return (
      (typeof Value === 'string') || (Value instanceof String)
    ) && emptyStringPattern.test(Value.valueOf())
  }

  export function ValueIsNonEmptyString (Value:any):boolean {
    return (
      (typeof Value === 'string') || (Value instanceof String)
    ) && ! emptyStringPattern.test(Value.valueOf())
  }

/**** ValueIsStringMatching ****/

  export function ValueIsStringMatching (Value:any, Pattern:RegExp):boolean {
    return (
      (typeof Value === 'string') || (Value instanceof String)
    ) && Pattern.test(Value.valueOf())
  }

/**** ValueIsText ****/

  const noCtrlCharsButCRLFPattern = /^[^\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F\u2028\u2029\uFFF9-\uFFFB]*$/

  export function ValueIsText (Value:any):boolean {
    return ValueIsStringMatching(Value,noCtrlCharsButCRLFPattern)
  }

/**** ValueIsTextline ****/

  const noCtrlCharsPattern = /^[^\x00-\x1F\x7F-\x9F\u2028\u2029\uFFF9-\uFFFB]*$/

  export function ValueIsTextline (Value:any):boolean {
    return ValueIsStringMatching(Value,noCtrlCharsPattern)
  }

/**** ValueIsFunction ****/

  export function ValueIsFunction (Value:any):boolean {
    return (typeof Value === 'function')
  }

/**** ValueIsAnonymousFunction ****/

  export function ValueIsAnonymousFunction (Value:any):boolean {
    return (
      (typeof Value === 'function') &&
      ((Value.name == null) || (Value.name === ''))
    )
  }

/**** ValueIsNamedFunction ****/

  export function ValueIsNamedFunction (Value:any):boolean {
    return (
      (typeof Value === 'function') &&
      (Value.name != null) && (Value.name !== '')
    )
  }

/**** ValueIsNativeFunction ****/

  export function ValueIsNativeFunction (Value:any):boolean {
    return (
      (typeof Value === 'function') &&
      /^function\s*[^(]*\(\)\s*\{\s*\[native code\]\s*\}\s*$/.test(Value.toString())
    )
  }

/**** ValueIsScriptedFunction ****/

  export function ValueIsScriptedFunction (Value:any):boolean {
    return (
      (typeof Value === 'function') &&
      ! /^function\s*[^(]*\(\)\s*\{\s*\[native code\]\s*\}\s*$/.test(Value.toString())
    )
  }

/**** ValueIsObject ****/

  export function ValueIsObject (Value:any):boolean {
    return (Value != null) && (typeof Value === 'object')
  }

/**** ValueIsPlainObject ****/

  export function ValueIsPlainObject (Value:any):boolean {
    return (
      (Value != null) && (typeof Value === 'object') &&
      (Object.getPrototypeOf(Value) === Object.prototype)
    )
  }

/**** ValueIsVanillaObject ****/

  export function ValueIsVanillaObject (Value:any):boolean {
    return (
      (Value != null) && (typeof Value === 'object') &&
      ! (Value instanceof Object)
    )
  }

/**** ValueIsArray ****/

  export let ValueIsArray = Array.isArray

/**** ValueIsList ("dense" array) ****/

  export function ValueIsList (
    Value:any, minLength?:number, maxLength?:number
  ):boolean {
    if (ValueIsArray(Value)) {
      for (let i = 0, l = Value.length; i < l; i++) {
        if (Value[i] === undefined) { return false }
      }

      if (minLength != null) {
        if (Value.length < minLength) { return false }
      }

      if (maxLength != null) {
        if (Value.length > maxLength) { return false }
      }
      return true
    }

    return false
  }

/**** ValueIsListSatisfying ****/

  export function ValueIsListSatisfying (
    Value:any, Validator:Function, minLength?:number, maxLength?:number
  ):boolean {
    if (ValueIsArray(Value)) {
      try {
        for (let i = 0, l = Value.length; i < l; i++) {
          if (Validator(Value[i]) == false) { return false }
        }

        if (minLength != null) {
          if (Value.length < minLength) { return false }
        }

        if (maxLength != null) {
          if (Value.length > maxLength) { return false }
        }
        return true
      } catch (Signal) { /* nop */ }
    }

    return false
  }

/**** ValueIsInstanceOf ****/

  export function ValueIsInstanceOf (Value:any, Constructor:Function):boolean {
    return (Value instanceof Constructor)
  }

/**** ValueInheritsFrom ****/

  export function ValueInheritsFrom (Value:any, Prototype:Object):boolean {
    return Object_isPrototypeOf(Prototype,Value)
  }

/**** ValueIsDate ****/

  export function ValueIsDate (Value:any):boolean {
    return (Value instanceof Date)
  }

/**** ValueIsError ****/

  export function ValueIsError (Value:any):boolean {
    return (Value instanceof Error)
  }

/**** ValueIsPromise ****/

  export function ValueIsPromise (Value:any):boolean {
    return (Value != null) && (typeof Value.then === 'function')
  }
// see https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise

/**** ValueIsRegExp ****/

  export function ValueIsRegExp (Value:any):boolean {
    return (Value instanceof RegExp)
  }

/**** ValueIsOneOf ****/

  export function ValueIsOneOf (Value:any, ValueList:any[]):boolean {
    return (ValueList.indexOf(Value) >= 0)
  }                     // no automatic unboxing of boxed values and vice-versa!

/**** ValueIsColor ****/

  export function ValueIsColor (Value:any):boolean {
    return ValueIsString(Value) && (
      ColorSet.hasOwnProperty (Value) ||
      /^#[a-fA-F0-9]{6}$/.test(Value) ||
      /^#[a-fA-F0-9]{8}$/.test(Value) ||
      /^rgb\([0-9]+,\s*[0-9]+,\s*[0-9]+\)$/.test(Value) ||        // not perfect
      /^rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,([01]|[0]?[.][0-9]+)\)$/.test(Value) // dto.
    )
  }

/**** ValueIsEMailAddress ****/

  const EMailAddressPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  // see https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression

  export function ValueIsEMailAddress (Value:any):boolean {
    return ValueIsStringMatching(Value, EMailAddressPattern)
  }

/**** ValueIsURL ****/

  const noCtrlCharsOrWhitespacePattern = /^[^\s\x00-\x1F\x7F-\x9F\u2028\u2029\uFFF9-\uFFFB]*$/

  export function ValueIsURL (Value:any):boolean {
    if (
      ! ValueIsStringMatching(Value, noCtrlCharsOrWhitespacePattern) ||
      (Value === '')
    ) { return false }

    try {
      new URL(Value, 'file://')
      return true
    } catch (Signal) {
      return false
    }
  }

//------------------------------------------------------------------------------
//--                      Argument Validation Functions                       --
//------------------------------------------------------------------------------

  export const rejectNil = false
  export const acceptNil = true

/**** validatedArgument ****/

  export function validatedArgument (
    Description:string, Argument:any, ValueIsValid:(Value:any) => boolean,
    NilIsAcceptable:boolean, Expectation:string
  ):any|null|undefined {
    if (Argument == null) {
      if (NilIsAcceptable) {
        return Argument
      } else {
        throwError(`MissingArgument: no ${escaped(Description)} given`)
      }
    } else {
      if (ValueIsValid(Argument)) {
        switch (true) {
          case Argument instanceof Boolean:
          case Argument instanceof Number:
          case Argument instanceof String:
            return Argument.valueOf()                  // unboxes any primitives
          default:
            return Argument
        }
      } else {
        throwError(
          `InvalidArgument: the given ${escaped(Description)} is no valid ${escaped(Expectation)}`
        )
      }
    }
  }

/**** ValidatorForClassifier ****/

  export function ValidatorForClassifier (
    Classifier:(Value:any) => boolean, NilIsAcceptable:boolean,
    Expectation:string
  ):Function {
    let Validator = function (Description:string, Argument:any):any {
      return validatedArgument(
        Description, Argument, Classifier, NilIsAcceptable, Expectation
      )
    }

    let ClassifierName = Classifier.name
    if ((ClassifierName != null) && /^ValueIs/.test(ClassifierName)) {
      let ValidatorName = ClassifierName.replace(  // derive name from validator
        /^ValueIs/, NilIsAcceptable ? 'allow' : 'expect'
      )
      return FunctionWithName(Validator,ValidatorName)
    } else {
      return Validator                              // without any specific name
    }
  }

/**** FunctionWithName (works with older JS engines as well) ****/

  export function FunctionWithName (
    originalFunction:Function, desiredName:string|String
  ):Function {
    if (originalFunction == null) {
      throwError('MissingArgument: no function given')
    }
    if (typeof originalFunction !== 'function') {
      throwError('InvalidArgument: the given 1st Argument is not a JavaScript function')
    }

    if (desiredName == null) {
      throwError('MissingArgument: no desired name given')
    }
    if ((typeof desiredName !== 'string') && ! (desiredName instanceof String)) {
      throwError('InvalidArgument: the given desired name is not a string')
    }

    if (originalFunction.name === desiredName) { return originalFunction }

    try {
      Object.defineProperty(originalFunction, 'name', { value:desiredName })
      if (originalFunction.name === desiredName) { return originalFunction }
    } catch (signal) { /* ok - let's take the hard way */ }

    let renamed = new Function(
      'originalFunction', 'return function ' + desiredName + ' () {' +
        'return originalFunction.apply(this,Array.prototype.slice.apply(arguments))' +
      '}'
    )
    return renamed(originalFunction)
  }                                  // also works with older JavaScript engines

/**** expect[ed]Value ****/

  export function expectValue (Description:string, Argument:any):any {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    } else {
      return Argument.valueOf()
    }
  }
  export const expectedValue = expectValue

/**** allow/expect[ed]Boolean ****/

  export const allowBoolean = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsBoolean, acceptNil, 'boolean value'
  ), allowedBoolean = allowBoolean

  export const expectBoolean = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsBoolean, rejectNil, 'boolean value'
  ), expectedBoolean = expectBoolean

/**** allow/expect[ed]Number ****/

  export const allowNumber = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNumber, acceptNil, 'numeric value'
  ), allowedNumber = allowNumber

  export const expectNumber = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNumber, rejectNil, 'numeric value'
  ), expectedNumber = expectNumber

/**** allow/expect[ed]FiniteNumber ****/

  export const allowFiniteNumber = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsFiniteNumber, acceptNil, 'finite numeric value'
  ), allowedFiniteNumber = allowFiniteNumber

  export const expectFiniteNumber = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsFiniteNumber, rejectNil, 'finite numeric value'
  ), expectedFiniteNumber = expectFiniteNumber

/**** allow/expect[ed]NaN ****/

  export const allowNaN = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNaN, acceptNil, 'NaN value'
  ), allowedNaN = allowNaN

  export const expectNaN = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNaN, rejectNil, 'NaN value'
  ), expectedNaN = expectNaN

/**** allow[ed]NumberInRange ****/

  export function allowNumberInRange (
    Description:string, Argument:any,
    minValue?:number, maxValue?:number, withMin?:boolean, withMax?:boolean
  ):number|null|undefined {
    return (Argument == null
      ? Argument
      : expectedNumberInRange(Description, Argument, minValue,maxValue, withMin,withMax)
    )
  }
  export const allowedNumberInRange = allowNumberInRange

/**** expect[ed]NumberInRange ****/

  export function expectNumberInRange (
    Description:string, Argument:any,
    minValue?:number, maxValue?:number, withMin?:boolean, withMax?:boolean
  ):number {
    expectNumber(Description, Argument)

    if (isNaN(Argument)) {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is not-a-number`
      )
    }

    if (withMin == null) { withMin = true }
    if (withMax == null) { withMax = true }

    if ((minValue != null) && isFinite(minValue)) {
      if ((maxValue != null) && isFinite(maxValue)) {
        if (
          (Argument < minValue) || (! withMin && (Argument === minValue)) ||
          (Argument > maxValue) || (! withMax && (Argument === maxValue))
        ) {
          throw new RangeError(
            `the given ${escaped(Description)} (${Argument}) is outside ` +
            `the allowed range (${minValue}...${maxValue})`
          )
        }
      } else {
        if ((Argument < minValue) || (! withMin && (Argument === minValue))) {
          throw new RangeError(
            `the given ${escaped(Description)} is below the allowed ` +
            `minimum (${Argument} ${withMin ? '<' : '<='} ${minValue})`
          )
        }
      }
    } else {
      if ((maxValue != null) && isFinite(maxValue)) {
        if ((Argument > maxValue) || (! withMax && (Argument === maxValue))) {
          throw new RangeError(
            `the given ${escaped(Description)} exceeds the allowed ` +
            `maximum (${Argument} ${withMax ? '>' : '>='} ${maxValue})`
          )
        }
      }
    }

    return Argument.valueOf()
  }
  export const expectedNumberInRange = expectNumberInRange

/**** allow/expect[ed]Integer ****/

  export const allowInteger = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsInteger, acceptNil, 'integral numeric value'
  ), allowedInteger = allowInteger

  export const expectInteger = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsInteger, rejectNil, 'integral numeric value'
  ), expectedInteger = expectInteger

/**** allow[ed]IntegerInRange ****/

  export function allowIntegerInRange (
    Description:string, Argument:any, minValue?:number, maxValue?:number
  ):number|null|undefined {
    return (Argument == null
      ? Argument
      : expectedIntegerInRange(Description, Argument, minValue,maxValue)
    )
  }
  export const allowedIntegerInRange = allowIntegerInRange

/**** expect[ed]IntegerInRange ****/

  export function expectIntegerInRange (
    Description:string, Argument:any, minValue?:number, maxValue?:number
  ):number {
    expectInteger(Description, Argument)

    if (isNaN(Argument)) {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is not-a-number`
      )
    }

    if ((minValue != null) && isFinite(minValue)) {
      if ((maxValue != null) && isFinite(maxValue)) {
        if ((Argument < minValue) || (Argument > maxValue)) {
          throw new RangeError(
            `the given ${escaped(Description)} (${Argument}) is outside ` +
            `the allowed range (${minValue}...${maxValue})`
          )
        }
      } else {
        if (Argument < minValue) {
          throw new RangeError(
            `the given ${escaped(Description)} is below the allowed ` +
            `minimum (${Argument} < ${minValue})`
          )
        }
      }
    } else {
      if ((maxValue != null) && isFinite(maxValue)) {
        if (Argument > maxValue) {
          throw new RangeError(
            `the given ${escaped(Description)} exceeds the allowed ` +
            `maximum (${Argument} > ${maxValue})`
          )
        }
      }
    }

    return Argument.valueOf()
  }
  export const expectedIntegerInRange = expectIntegerInRange

/**** allow/expect[ed]Ordinal ****/

  export const allowOrdinal = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsOrdinal, acceptNil, 'ordinal number'
  ), allowedOrdinal = allowOrdinal

  export const expectOrdinal = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsOrdinal, rejectNil, 'ordinal number'
  ), expectedOrdinal = expectOrdinal

/**** allow/expect[ed]Cardinal ****/

  export const allowCardinal = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsCardinal, acceptNil, 'cardinal number'
  ), allowedCardinal = allowCardinal

  export const expectCardinal = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsCardinal, rejectNil, 'cardinal number'
  ), expectedCardinal = expectCardinal

/**** allow/expect[ed]String ****/

  export const allowString = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsString, acceptNil, 'literal string'
  ), allowedString = allowString

  export const expectString = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsString, rejectNil, 'literal string'
  ), expectedString = expectString

/**** allow/expect[ed]NonEmptyString ****/

  export const allowNonEmptyString = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNonEmptyString, acceptNil, 'non-empty literal string'
  ), allowedNonEmptyString = allowNonEmptyString

  export const expectNonEmptyString = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNonEmptyString, rejectNil, 'non-empty literal string'
  ), expectedNonEmptyString = expectNonEmptyString

/**** allow[ed]StringMatching ****/

  export function allowStringMatching (
    Description:string, Argument:any, Pattern:RegExp
  ):string|null|undefined {
    return (Argument == null
      ? Argument
      : expectedStringMatching(Description, Argument, Pattern)
    )
  }
  export const allowedStringMatching = allowStringMatching

/**** expect[ed]StringMatching ****/

  export function expectStringMatching (
    Description:string, Argument:any, Pattern:RegExp
  ):string {
    expectString(Description, Argument)

    if (Pattern.test(Argument)) {
      return Argument.valueOf()
    } else {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} does not match the specified pattern`
      )
    }
  }
  export const expectedStringMatching = expectStringMatching

/**** allow/expect[ed]Text ****/

  export const allowText = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsText, acceptNil, 'literal text'
  ), allowedText = allowText

  export const expectText = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsText, rejectNil, 'literal text'
  ), expectedText = expectText

/**** allow/expect[ed]Textline ****/

  export const allowTextline = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsTextline, acceptNil, 'single line of text'
  ), allowedTextline = allowTextline

  export const expectTextline = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsTextline, rejectNil, 'single line of text'
  ), expectedTextline = expectTextline

/**** allow/expect[ed]Function ****/

  export const allowFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsFunction, acceptNil, 'JavaScript function'
  ), allowedFunction = allowFunction

  export const expectFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsFunction, rejectNil, 'JavaScript function'
  ), expectedFunction = expectFunction

/**** allow/expect[ed]AnonymousFunction ****/

  export const allowAnonymousFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsAnonymousFunction, acceptNil, 'anonymous JavaScript function'
  ), allowedAnonymousFunction = allowAnonymousFunction

  export const expectAnonymousFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsAnonymousFunction, rejectNil, 'anonymous JavaScript function'
  ), expectedAnonymousFunction = expectAnonymousFunction

/**** allow/expect[ed]NamedFunction ****/

  export const allowNamedFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNamedFunction, acceptNil, 'named JavaScript function'
  ), allowedNamedFunction = allowNamedFunction

  export const expectNamedFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNamedFunction, rejectNil, 'named JavaScript function'
  ), expectedNamedFunction = expectNamedFunction

/**** allow/expect[ed]NativeFunction ****/

  export const allowNativeFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNativeFunction, acceptNil, 'native JavaScript function'
  ), allowedNativeFunction = allowNativeFunction

  export const expectNativeFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsNativeFunction, rejectNil, 'native JavaScript function'
  ), expectedNativeFunction = expectNativeFunction

/**** allow/expect[ed]ScriptedFunction ****/

  export const allowScriptedFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsScriptedFunction, acceptNil, 'scripted JavaScript function'
  ), allowedScriptedFunction = allowScriptedFunction

  export const expectScriptedFunction = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsScriptedFunction, rejectNil, 'scripted JavaScript function'
  ), expectedScriptedFunction = expectScriptedFunction

/**** allow/expect[ed]Object ****/

  export const allowObject = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsObject, acceptNil, 'JavaScript object'
  ), allowedObject = allowObject

  export const expectObject = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsObject, rejectNil, 'JavaScript object'
  ), expectedObject = expectObject

/**** allow/expect[ed]PlainObject ****/

  export const allowPlainObject = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsPlainObject, acceptNil, '"plain" JavaScript object'
  ), allowedPlainObject = allowPlainObject

  export const expectPlainObject = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsPlainObject, rejectNil, '"plain" JavaScript object'
  ), expectedPlainObject = expectPlainObject

/**** allow/expect[ed]VanillaObject ****/

  export const allowVanillaObject = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsVanillaObject, acceptNil, '"vanilla" JavaScript object'
  ), allowedVanillaObject = allowVanillaObject

  export const expectVanillaObject = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsVanillaObject, rejectNil, '"vanilla" JavaScript object'
  ), expectedVanillaObject = expectVanillaObject

/**** allow[ed]Array ****/

  export function allowArray (Description:string, Argument:any):any[]|null|undefined {
    return (Argument == null
      ? Argument
      : expectedArray(Description,Argument)
    )
  }
  export const allowedArray = allowArray

/**** expect[ed]Array ****/

  export function expectArray (Description:string, Argument:any):any[] {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    }

    if (ValueIsArray(Argument)) {
      return Argument
    } else {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is no JavaScript array`
      )
    }
  }
  export const expectedArray = expectArray

/**** allow[ed]List ****/

  export function allowList (
    Description:string, Argument:any, Expectation?:string,
    minLength?:number, maxLength?:number
  ):any[]|null|undefined {
    return (Argument == null
      ? Argument
      : expectedList(Description, Argument, Expectation, minLength,maxLength)
    )
  }
  export const allowedList = allowList

/**** expect[ed]List ****/

  export function expectList (
    Description:string, Argument:any, Expectation?:string,
    minLength?:number, maxLength?:number
  ):any[] {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    }

    if (ValueIsList(Argument, minLength,maxLength)) {
      return Argument
    } else {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is ` + (
          Expectation == null
          ? 'either not a list or contains an invalid number of elements'
          : 'no ' + escaped(Expectation)
        )
      )
    }
  }
  export const expectedList = expectList

/**** allow[ed]ListSatisfying ****/

  export function allowListSatisfying (
    Description:string, Argument:any, Validator:(Value:any) => boolean,
    Expectation?:string, minLength?:number, maxLength?:number
  ):any[]|null|undefined {
    return (Argument == null
      ? Argument
      : expectedListSatisfying(
          Description, Argument, Validator, Expectation, minLength,maxLength
        )
    )
  }
  export const allowedListSatisfying = allowListSatisfying

/**** expect[ed]ListSatisfying ****/

  export function expectListSatisfying (
    Description:string, Argument:any, Validator:(Value:any) => boolean,
    Expectation?:string, minLength?:number, maxLength?:number
  ):any[] {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    }

    if (ValueIsListSatisfying(Argument,Validator, minLength,maxLength)) {
      return Argument
    } else {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is ` + (
          Expectation == null
          ? 'either not a list or contains invalid elements'
          : 'no ' + escaped(Expectation)
        )
      )
    }
  }
  export const expectedListSatisfying = expectListSatisfying

/**** allow[ed]InstanceOf ****/

  export function allowInstanceOf (
    Description:string, Argument:any, constructor:Function, Expectation:string
  ):any|null|undefined {
    return (Argument == null
      ? Argument
      : expectedInstanceOf(Description, Argument, constructor, Expectation)
    )
  }
  export const allowedInstanceOf = allowInstanceOf

/**** expect[ed]InstanceOf ****/

  export function expectInstanceOf (
    Description:string, Argument:any, constructor:Function, Expectation:string
  ):any {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    }

    if (! (Argument instanceof constructor)) {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is no ${escaped(Expectation)}`
      )
    }

    return Argument
  }
  export const expectedInstanceOf = expectInstanceOf

/**** allow[ed]ValueInheritingFrom ****/

  export function allowValueInheritingFrom (
    Description:string, Argument:any, prototype:any, Expectation:string
  ):any|null|undefined {
    return (Argument == null
      ? Argument
      : expectedValueInheritingFrom(Description, Argument, prototype, Expectation)
    )
  }
  export const allowedValueInheritingFrom = allowValueInheritingFrom

/**** expect[ed]ValueInheritingFrom ****/

  export function expectValueInheritingFrom (
    Description:string, Argument:any, prototype:any, Expectation:string
  ):any {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    }

    if (prototype.isPrototypeOf(Argument)) {
      return Argument
    } else {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is no ${escaped(Expectation)}`
      )
    }
  }
  export const expectedValueInheritingFrom = expectValueInheritingFrom

/**** allow/expect[ed]Date ****/

  export const allowDate = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsDate, acceptNil, 'JavaScript Date object'
  ), allowedDate = allowDate

  export const expectDate = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsDate, rejectNil, 'JavaScript Date object'
  ), expectedDate = expectDate

/**** allow/expect[ed]Error ****/

  export const allowError = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsError, acceptNil, 'JavaScript Error object'
  ), allowedError = allowError

  export const expectError = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsError, rejectNil, 'JavaScript Error object'
  ), expectedError = expectError

/**** allow/expect[ed]Promise ****/

  export const allowPromise = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsPromise, acceptNil, 'JavaScript Promise (or "Thenable") object'
  ), allowedPromise = allowPromise

  export const expectPromise = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsPromise, rejectNil, 'JavaScript Promise (or "Thenable") object'
  ), expectedPromise = expectPromise

/**** allow/expect[ed]RegExp ****/

  export const allowRegExp = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsRegExp, acceptNil, 'JavaScript RegExp object'
  ), allowedRegExp = allowRegExp

  export const expectRegExp = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsRegExp, rejectNil, 'JavaScript RegExp object'
  ), expectedRegExp = expectRegExp

/**** allow[ed]OneOf ****/

  export function allowOneOf (
    Description:string, Argument:any, ValueList:any[]
  ):any|null|undefined {
    return (Argument == null
      ? Argument
      : expectedOneOf(Description, Argument, ValueList)
    )
  }
  export const allowedOneOf = allowOneOf

/**** expect[ed]OneOf ****/

  export function expectOneOf (
    Description:string, Argument:any, ValueList:any[]
  ):any {
    if (Argument == null) {
      throwError(`MissingArgument: no ${escaped(Description)} given`)
    }

    if (ValueIsOneOf(Argument,ValueList)) {
      return (                                         // unboxes any primitives
        (Argument == null) || (typeof Argument.valueOf !== 'function')
        ? Argument
        : Argument.valueOf()
      )
    } else {
      throwError(
        `InvalidArgument: the given ${escaped(Description)} is not among the supported values`
      )
    }
  }
  export const expectedOneOf = expectOneOf

/**** allow/expect[ed]Color ****/

  export const allowColor = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsColor, acceptNil, 'valid CSS color specification'
  ), allowedColor = allowColor

  export const expectColor = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsColor, rejectNil, 'valid CSS color specification'
  ), expectedColor = expectColor

/**** allow/expect[ed]EMailAddress ****/

  export const allowEMailAddress = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsEMailAddress, acceptNil, 'valid EMail address'
  ), allowedEMailAddress = allowEMailAddress

  export const expectEMailAddress = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsEMailAddress, rejectNil, 'valid EMail address'
  ), expectedEMailAddress = expectEMailAddress

/**** allow/expect[ed]URL ****/

  export const allowURL = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsURL, acceptNil, 'valid URL'
  ), allowedURL = allowURL

  export const expectURL = /*#__PURE__*/ ValidatorForClassifier(
    ValueIsURL, rejectNil, 'valid URL'
  ), expectedURL = expectURL

/**** escaped - escapes all control characters in a given string ****/

  export function escaped (Text:string):string {
    const EscapeSequencePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?/g
    const CtrlCharCodePattern  = /[\x00-\x1f\x7f-\x9f]/g

    return Text
      .replace(EscapeSequencePattern, function (Match:string):string {
        return (Match === '\\' ? '\\\\' : Match)
      })
      .replace(CtrlCharCodePattern, function (Match:string):string {
        switch (Match) {
          case '\0':  return '\\0'
          case '\b':  return '\\b'
          case '\f':  return '\\f'
          case '\n':  return '\\n'
          case '\r':  return '\\r'
          case '\t':  return '\\t'
          case '\v':  return '\\v'
          default: {
            let HexCode = Match.charCodeAt(0).toString(16)
            return '\\x' + '00'.slice(HexCode.length) + HexCode
          }
        }
      })
  }

/**** unescaped - evaluates all escape sequences in a given string ****/

  export function unescaped (Text:string):string {
    const EscapeSequencePattern = /\\[0bfnrtv'"\\\/]|\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}/g

    return Text
      .replace(EscapeSequencePattern, function (Match:string):string {
        switch (Match) {
          case '\\0':  return '\0'
          case '\\b':  return '\b'
          case '\\f':  return '\f'
          case '\\n':  return '\n'
          case '\\r':  return '\r'
          case '\\t':  return '\t'
          case '\\v':  return '\v'
          case '\\\'': return "'"
          case '\\"':  return '"'
          case '\\\\': return "\\"
          default: {
            let CharCode = parseInt(Match.slice(2),16)
            return String.fromCharCode(CharCode)
          }
        }
    })
  }

/**** quotable - makes a given string ready to be put in single/double quotes ****/

  export function quotable (Text:string, Quote:'"' | "'" = '"'):string {
    const EscSeqOrSglQuotePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?|'/g
    const EscSeqOrDblQuotePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?|"/g
    const CtrlCharCodePattern     = /[\x00-\x1f\x7f-\x9f]/g

    return Text
      .replace(
        Quote === "'" ? EscSeqOrSglQuotePattern : EscSeqOrDblQuotePattern,
        function (Match:string):string {
          switch (Match) {
            case "'":  return "\\'"
            case '"':  return '\\"'
            case '\\': return '\\\\'
            default:   return Match
          }
        }
      )
      .replace(CtrlCharCodePattern, function (Match:string):string {
        switch (Match) {
          case '\0':  return '\\0'
          case '\b':  return '\\b'
          case '\f':  return '\\f'
          case '\n':  return '\\n'
          case '\r':  return '\\r'
          case '\t':  return '\\t'
          case '\v':  return '\\v'
          default: {
            let HexCode = Match.charCodeAt(0).toString(16)
            return '\\x' + '00'.slice(HexCode.length) + HexCode
          }
        }
      })
  }

/**** quoted ****/

  export function quoted (Text:string, Quote:'"' | "'" = '"'):string {
    return Quote + quotable(Text,Quote) + Quote
  }

/**** HTMLsafe ****/

  export function HTMLsafe (Argument:string, EOLReplacement?:string):string {
    EOLReplacement = (EOLReplacement || '').trim() || '<br/>'
    return Argument.replace(
      /[&<>"'\u0000-\u001F\u007F-\u009F\\]/g, function (Match:string):string {
        switch (Match) {
          case '&':  return '&amp;'
          case '<':  return '&lt;'
          case '>':  return '&gt;'
          case '"':  return '&quot;'
          case "'":  return '&apos;'
          case '\b': return '&#92;b'
          case '\f': return '&#92;f'
          case '\n': return EOLReplacement as string
          case '\r': return '&#92;r'
          case '\t': return '&#92;t'
          case '\v': return '&#92;v'
          case '\\': return '&#92;'
          default:   let Result = Match.charCodeAt(0).toString(16)
                     return '&#x0000'.substring(3,7-Result.length) + Result + ';'
        }
      }
    )
  }

/**** MarkDownSafe ****/

  export function MarkDownSafe (Argument:string, EOLReplacement?:string):string {
    return HTMLsafe(Argument, EOLReplacement).replace(/:/g,'&#58;')
  }

/**** ValuesDiffer ****/

  export function ValuesDiffer (
    thisValue:any, otherValue:any, Mode?:'by-value'|'by-reference'|undefined
  ):boolean {
    if (thisValue === otherValue) { return false }

    let thisType = typeof thisValue
    if (thisType !== typeof otherValue) { return true }

    /**** ArraysDiffer ****/

      function ArraysDiffer (
        thisArray:any[], otherArray:any[], Mode:'by-value'|'by-reference'|undefined
      ):boolean {
        if (! Array.isArray(otherArray)) { return true }

        if (thisArray.length !== otherArray.length) { return true }

        for (let i = 0, l = thisArray.length; i < l; i++) {
          if (ValuesDiffer(thisArray[i],otherArray[i],Mode)) { return true }
        }

        return false
      }

    /**** ObjectsDiffer ****/

      function ObjectsDiffer (
        thisObject:any, otherObject:any, Mode:'by-value'|'by-reference'|undefined
      ):boolean {
        if (Object.getPrototypeOf(thisObject) !== Object.getPrototypeOf(otherObject)) {
          return true
        }

        for (let key in thisObject) {
          if (! (key in otherObject)) { return true }
        }

        for (let key in otherObject) {
          if (! (key in thisObject)) { return true }

          if (ValuesDiffer(thisObject[key],otherObject[key],Mode)) {
            return true
          }
        }

        return false
      }

    switch (thisType) {
      case 'undefined':
      case 'boolean':
      case 'string':
      case 'function': return true   // most primitives are compared using "==="
      case 'number':   return (
                         (isNaN(thisValue) !== isNaN(otherValue)) ||
                         (Math.abs(thisValue-otherValue) > Number.EPSILON)
                       )
      case 'object':
        if (thisValue  == null) { return true }  // since "other_value" != null!
        if (otherValue == null) { return true }   // since "this_value" != null!

        if ((Mode === 'by-value') && (
          (thisValue instanceof Boolean) ||
          (thisValue instanceof Number) ||
          (thisValue instanceof String)
        )) {
          return (thisValue.valueOf() !== otherValue.valueOf())
        }

        if (Array.isArray(thisValue)) {
          return ArraysDiffer(thisValue,otherValue,Mode)
        }

        return (
          Mode === 'by-reference'
          ? true                           // because (thisValue !== otherValue)
          : ObjectsDiffer(thisValue,otherValue,Mode)
        )
      default: return true                          // unsupported property type
    }

    return true
  }

/**** ValuesAreEqual ****/

  export function ValuesAreEqual (
    thisValue:any, otherValue:any, Mode?:'by-value'|'by-reference'|undefined
  ):boolean {
    return ! ValuesDiffer(thisValue,otherValue,Mode)
  }

/**** ObjectIsEmpty ****/

  export function ObjectIsEmpty (Candidate:any):boolean {
    expectObject('candidate',Candidate)
    for (let Key in Candidate) {
      if (Object_hasOwnProperty(Candidate,Key)) {
        return false
      }
    }
    return true
  }

/**** ObjectIsNotEmpty ****/

  export function ObjectIsNotEmpty (Candidate:any):boolean {
    return ! ObjectIsEmpty(Candidate)
  }

/**** StringIsEmpty ****/

  export function StringIsEmpty (Candidate:string):boolean {
    return /^\s*$/.test(Candidate)
  }

/**** StringIsNotEmpty ****/

  export function StringIsNotEmpty (Candidate:string):boolean {
    return ! StringIsEmpty(Candidate)
  }

/**** constrained ****/

  export function constrained (
    Value:number, Minimum:number = -Infinity, Maximum:number = Infinity
  ):number {
    return Math.max(Minimum, Math.min(Value, Maximum))
  }

//------------------------------------------------------------------------------
//--                             Color Utilities                              --
//------------------------------------------------------------------------------

// built-in color names (see http://www.w3.org/TR/SVG/types.html#ColorKeywords) ----

  export const ColorSet = {
           transparent:'rgba(0,0,0,0,0.0)',
             aliceblue:'rgba(240,248,255,1.0)',         lightpink:'rgba(255,182,193,1.0)',
          antiquewhite:'rgba(250,235,215,1.0)',       lightsalmon:'rgba(255,160,122,1.0)',
                  aqua:'rgba(0,255,255,1.0)',       lightseagreen:'rgba(32,178,170,1.0)',
            aquamarine:'rgba(127,255,212,1.0)',      lightskyblue:'rgba(135,206,250,1.0)',
                 azure:'rgba(240,255,255,1.0)',    lightslategray:'rgba(119,136,153,1.0)',
                 beige:'rgba(245,245,220,1.0)',    lightslategrey:'rgba(119,136,153,1.0)',
                bisque:'rgba(255,228,196,1.0)',    lightsteelblue:'rgba(176,196,222,1.0)',
                 black:'rgba(0,0,0,1.0)',             lightyellow:'rgba(255,255,224,1.0)',
        blanchedalmond:'rgba(255,235,205,1.0)',              lime:'rgba(0,255,0,1.0)',
                  blue:'rgba(0,0,255,1.0)',             limegreen:'rgba(50,205,50,1.0)',
            blueviolet:'rgba(138,43,226,1.0)',              linen:'rgba(250,240,230,1.0)',
                 brown:'rgba(165,42,42,1.0)',             magenta:'rgba(255,0,255,1.0)',
             burlywood:'rgba(222,184,135,1.0)',            maroon:'rgba(128,0,0,1.0)',
             cadetblue:'rgba(95,158,160,1.0)',   mediumaquamarine:'rgba(102,205,170,1.0)',
            chartreuse:'rgba(127,255,0,1.0)',          mediumblue:'rgba(0,0,205,1.0)',
             chocolate:'rgba(210,105,30,1.0)',       mediumorchid:'rgba(186,85,211,1.0)',
                 coral:'rgba(255,127,80,1.0)',       mediumpurple:'rgba(147,112,219,1.0)',
        cornflowerblue:'rgba(100,149,237,1.0)',    mediumseagreen:'rgba(60,179,113,1.0)',
              cornsilk:'rgba(255,248,220,1.0)',   mediumslateblue:'rgba(123,104,238,1.0)',
               crimson:'rgba(220,20,60,1.0)',   mediumspringgreen:'rgba(0,250,154,1.0)',
                  cyan:'rgba(0,255,255,1.0)',     mediumturquoise:'rgba(72,209,204,1.0)',
              darkblue:'rgba(0,0,139,1.0)',       mediumvioletred:'rgba(199,21,133,1.0)',
              darkcyan:'rgba(0,139,139,1.0)',        midnightblue:'rgba(25,25,112,1.0)',
         darkgoldenrod:'rgba(184,134,11,1.0)',          mintcream:'rgba(245,255,250,1.0)',
              darkgray:'rgba(169,169,169,1.0)',         mistyrose:'rgba(255,228,225,1.0)',
             darkgreen:'rgba(0,100,0,1.0)',              moccasin:'rgba(255,228,181,1.0)',
              darkgrey:'rgba(169,169,169,1.0)',       navajowhite:'rgba(255,222,173,1.0)',
             darkkhaki:'rgba(189,183,107,1.0)',              navy:'rgba(0,0,128,1.0)',
           darkmagenta:'rgba(139,0,139,1.0)',             oldlace:'rgba(253,245,230,1.0)',
        darkolivegreen:'rgba(85,107,47,1.0)',               olive:'rgba(128,128,0,1.0)',
            darkorange:'rgba(255,140,0,1.0)',           olivedrab:'rgba(107,142,35,1.0)',
            darkorchid:'rgba(153,50,204,1.0)',             orange:'rgba(255,165,0,1.0)',
               darkred:'rgba(139,0,0,1.0)',             orangered:'rgba(255,69,0,1.0)',
            darksalmon:'rgba(233,150,122,1.0)',            orchid:'rgba(218,112,214,1.0)',
          darkseagreen:'rgba(143,188,143,1.0)',     palegoldenrod:'rgba(238,232,170,1.0)',
         darkslateblue:'rgba(72,61,139,1.0)',           palegreen:'rgba(152,251,152,1.0)',
         darkslategray:'rgba(47,79,79,1.0)',        paleturquoise:'rgba(175,238,238,1.0)',
         darkslategrey:'rgba(47,79,79,1.0)',        palevioletred:'rgba(219,112,147,1.0)',
         darkturquoise:'rgba(0,206,209,1.0)',          papayawhip:'rgba(255,239,213,1.0)',
            darkviolet:'rgba(148,0,211,1.0)',           peachpuff:'rgba(255,218,185,1.0)',
              deeppink:'rgba(255,20,147,1.0)',               peru:'rgba(205,133,63,1.0)',
           deepskyblue:'rgba(0,191,255,1.0)',                pink:'rgba(255,192,203,1.0)',
               dimgray:'rgba(105,105,105,1.0)',              plum:'rgba(221,160,221,1.0)',
               dimgrey:'rgba(105,105,105,1.0)',        powderblue:'rgba(176,224,230,1.0)',
            dodgerblue:'rgba(30,144,255,1.0)',             purple:'rgba(128,0,128,1.0)',
             firebrick:'rgba(178,34,34,1.0)',                 red:'rgba(255,0,0,1.0)',
           floralwhite:'rgba(255,250,240,1.0)',         rosybrown:'rgba(188,143,143,1.0)',
           forestgreen:'rgba(34,139,34,1.0)',           royalblue:'rgba(65,105,225,1.0)',
               fuchsia:'rgba(255,0,255,1.0)',         saddlebrown:'rgba(139,69,19,1.0)',
             gainsboro:'rgba(220,220,220,1.0)',            salmon:'rgba(250,128,114,1.0)',
            ghostwhite:'rgba(248,248,255,1.0)',        sandybrown:'rgba(244,164,96,1.0)',
                  gold:'rgba(255,215,0,1.0)',            seagreen:'rgba(46,139,87,1.0)',
             goldenrod:'rgba(218,165,32,1.0)',           seashell:'rgba(255,245,238,1.0)',
                  gray:'rgba(128,128,128,1.0)',            sienna:'rgba(160,82,45,1.0)',
                 green:'rgba(0,128,0,1.0)',                silver:'rgba(192,192,192,1.0)',
           greenyellow:'rgba(173,255,47,1.0)',            skyblue:'rgba(135,206,235,1.0)',
                  grey:'rgba(128,128,128,1.0)',         slateblue:'rgba(106,90,205,1.0)',
              honeydew:'rgba(240,255,240,1.0)',         slategray:'rgba(112,128,144,1.0)',
               hotpink:'rgba(255,105,180,1.0)',         slategrey:'rgba(112,128,144,1.0)',
             indianred:'rgba(205,92,92,1.0)',                snow:'rgba(255,250,250,1.0)',
                indigo:'rgba(75,0,130,1.0)',          springgreen:'rgba(0,255,127,1.0)',
                 ivory:'rgba(255,255,240,1.0)',         steelblue:'rgba(70,130,180,1.0)',
                 khaki:'rgba(240,230,140,1.0)',               tan:'rgba(210,180,140,1.0)',
              lavender:'rgba(230,230,250,1.0)',              teal:'rgba(0,128,128,1.0)',
         lavenderblush:'rgba(255,240,245,1.0)',           thistle:'rgba(216,191,216,1.0)',
             lawngreen:'rgba(124,252,0,1.0)',              tomato:'rgba(255,99,71,1.0)',
          lemonchiffon:'rgba(255,250,205,1.0)',         turquoise:'rgba(64,224,208,1.0)',
             lightblue:'rgba(173,216,230,1.0)',            violet:'rgba(238,130,238,1.0)',
            lightcoral:'rgba(240,128,128,1.0)',             wheat:'rgba(245,222,179,1.0)',
             lightcyan:'rgba(224,255,255,1.0)',             white:'rgba(255,255,255,1.0)',
  lightgoldenrodyellow:'rgba(250,250,210,1.0)',        whitesmoke:'rgba(245,245,245,1.0)',
             lightgray:'rgba(211,211,211,1.0)',            yellow:'rgba(255,255,0,1.0)',
            lightgreen:'rgba(144,238,144,1.0)',       yellowgreen:'rgba(154,205,50,1.0)',
             lightgrey:'rgba(211,211,211,1.0)',
  }

/**** HexColor - converts a given color to #rrggbbaa ****/

  export function HexColor (Color:string):string {
    let lowerColor = Color.toLowerCase()
    if (ColorSet.hasOwnProperty(lowerColor)) {
// @ts-ignore TS dislikes indexing with literal keys
      Color = ColorSet[lowerColor]
    } // do not return here as color is now in RGBA format

    if (/^#[a-fA-F0-9]{6}$/.test(Color)) {
      return Color + 'FF'
    }

    if (/^#[a-fA-F0-9]{8}$/.test(Color)) {
      return Color
    }

    const HexDigit = '0123456789ABCDEF'
    function dec2hex (Value:number):string {
      if (Value > 255) { Value = 255 }
      return HexDigit[Math.trunc(Value / 16)] + HexDigit[Value % 16]
    }

    const RGBPattern = /^rgb\(([0-9]+),\s*([0-9]+),\s*([0-9]+)\)$/i // not perfect

    let Match = RGBPattern.exec(Color)
    if (Match != null) {
      return ('#' +
        dec2hex(parseInt(Match[1],10)) +
        dec2hex(parseInt(Match[2],10)) +
        dec2hex(parseInt(Match[3],10)) + 'FF'
      )
    }

    const RGBAPattern = /^rgba\(([(0-9]+),\s*([0-9]+),\s*([0-9]+),\s*([01]?[.][0-9]+|[01])\)$/i // not perfect

    Match = RGBAPattern.exec(Color)
    if (Match != null) {
      return ('#' +
        dec2hex(parseInt(Match[1],10)) +
        dec2hex(parseInt(Match[2],10)) +
        dec2hex(parseInt(Match[3],10)) +
        dec2hex(parseFloat(Match[4]))
      )
    }

    throwError('InvalidArgument: the given Value is not a valid CSS Color specification')
  }

/**** RGBAColor - converts a given color to RGBA(r,g,b,a) ****/

  export function RGBAColor (Color:string):string {
    let lowerColor = Color.toLowerCase()
    if (ColorSet.hasOwnProperty(lowerColor)) {
// @ts-ignore TS dislikes indexing with literal keys
      return ColorSet[lowerColor]             // color is already in RGBA format
    }

    if (/^#[a-fA-F0-9]{6}$/.test(Color)) {
      return ('rgba(' +
        parseInt(Color.slice(1,3),16) + ',' +
        parseInt(Color.slice(3,5),16) + ',' +
        parseInt(Color.slice(5,7),16) + ', 1' +
      ')')
    }

    if (/^#[a-fA-F0-9]{8}$/.test(Color)) {
      return ('rgba(' +
        parseInt(Color.slice(1,3),16) + ',' +
        parseInt(Color.slice(3,5),16) + ',' +
        parseInt(Color.slice(5,7),16) + ',' +
        (parseInt(Color.slice(7),16)/255) +
      ')')
    }

    const RGBPattern = /^rgb\(([0-9]+),\s*([0-9]+),\s*([0-9]+)\)$/i //not perfect

    let Match = RGBPattern.exec(Color)
    if (Match != null) {
      return Color.slice(0,Color.length-1) + ',1)'
    }

    const RGBAPattern = /^rgba\(([(0-9]+),\s*([0-9]+),\s*([0-9]+),\s*([0]?[.][0-9]+|[01])\)$/i // not perfect

    Match = RGBAPattern.exec(Color)
    if (Match != null) { return Color }

    throwError('InvalidArgument: the given Value is not a valid CSS Color specification')
  }

/**** shortHexColor - converts a given color into #RRGGBB ****/

  export function shortHexColor (Color:string):string {
    return HexColor(Color).slice(0,7)
  }
