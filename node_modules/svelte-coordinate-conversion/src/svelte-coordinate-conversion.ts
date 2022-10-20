//----------------------------------------------------------------------------//
//                        Svelte Coordinate Conversion                        //
//----------------------------------------------------------------------------//

  type Position = { left:number, top:number }

  function fromViewportTo (
    System:'document'|'local', originalPosition:Position, Target?:Element
  ):Position {
    switch (true) {
      case (originalPosition == null):
        throw new Error('no "Position" given')
      case (typeof originalPosition.left !== 'number') && ! (originalPosition.left as Number instanceof Number):
      case (typeof originalPosition.top  !== 'number') && ! (originalPosition.top  as Number instanceof Number):
        throw new Error('invalid "Position" given')
    }

    switch (System) {
      case null: case undefined:
        throw new Error('no coordinate system given')
// @ts-ignore the following check is for non-TypeScript applications only
      case 'viewport':
        return { left:originalPosition.left, top:originalPosition.top }
      case 'document':
        return {
          left:originalPosition.left + window.scrollX,
          top:  originalPosition.top + window.scrollY
        }
      case 'local':
        switch (true) {
          case (Target == null):
            throw new Error('no target element given')
          case (Target instanceof Element):
            let computedStyle = window.getComputedStyle(Target as Element)

            let leftOffset = parseFloat(computedStyle.borderLeftWidth)
            let topOffset  = parseFloat(computedStyle.borderTopWidth)

            let TargetPositionInViewport = (Target as Element).getBoundingClientRect()
            return {
              left:originalPosition.left - TargetPositionInViewport.left - leftOffset,
              top:  originalPosition.top - TargetPositionInViewport.top  - topOffset
            }
          default:
            throw new Error('invalid target element given')
        }
      default:
        throw new Error('invalid coordinate system given')
    }
  }

  function fromDocumentTo (
    System:'viewport'|'local', originalPosition:Position, Target?:Element
  ):Position {
    switch (true) {
      case (originalPosition == null):
        throw new Error('no "Position" given')
      case (typeof originalPosition.left !== 'number') && ! (originalPosition.left as Number instanceof Number):
      case (typeof originalPosition.top  !== 'number') && ! (originalPosition.top  as Number instanceof Number):
        throw new Error('invalid "Position" given')
    }

    switch (System) {
      case null: case undefined:
        throw new Error('no coordinate system given')
      case 'viewport':
        return {
          left:originalPosition.left - window.scrollX,
          top:  originalPosition.top - window.scrollY
        }
// @ts-ignore the following check is for non-TypeScript applications only
      case 'document':
        return { left:originalPosition.left, top:originalPosition.top }
      case 'local':
        switch (true) {
          case (Target == null):
            throw new Error('no target element given')
          case (Target instanceof Element):
            let computedStyle = window.getComputedStyle(Target as Element)

            let leftOffset = parseFloat(computedStyle.borderLeftWidth)
            let topOffset  = parseFloat(computedStyle.borderTopWidth)

            let TargetPositionInViewport = (Target as Element).getBoundingClientRect()
            return {
              left:originalPosition.left + window.scrollX - TargetPositionInViewport.left - leftOffset,
              top:  originalPosition.top + window.scrollY - TargetPositionInViewport.top  - topOffset
            }
          default:
            throw new Error('invalid target element given')
        }
      default:
        throw new Error('invalid coordinate system given')
    }
  }

  function fromLocalTo (
    System:'viewport'|'document', originalPosition:Position, Source?:Element
  ):Position {
    switch (true) {
      case (originalPosition == null):
        throw new Error('no "Position" given')
      case (typeof originalPosition.left !== 'number') && ! (originalPosition.left as Number instanceof Number):
      case (typeof originalPosition.top  !== 'number') && ! (originalPosition.top  as Number instanceof Number):
        throw new Error('invalid "Position" given')
    }

    let SourcePositionInViewport:Position, leftPosition:number, topPosition:number
    switch (true) {
      case (Source == null):
        throw new Error('no source element given')
      case (Source instanceof Element):
        let computedStyle = window.getComputedStyle(Source as Element)

        let leftOffset = parseFloat(computedStyle.borderLeftWidth)
        let topOffset  = parseFloat(computedStyle.borderTopWidth)

        SourcePositionInViewport = (Source as Element).getBoundingClientRect()
        leftPosition = SourcePositionInViewport.left + leftOffset
        topPosition  = SourcePositionInViewport.top  + topOffset
        break
      default:
        throw new Error('invalid source element given')
    }

    switch (System) {
      case null: case undefined:
        throw new Error('no coordinate system given')
      case 'viewport':
        return {
          left:originalPosition.left + leftPosition,
          top:  originalPosition.top + topPosition
        }
      case 'document':
        return {
          left:originalPosition.left + leftPosition + window.scrollX,
          top:  originalPosition.top + topPosition  + window.scrollY
        }
// @ts-ignore the following check is for non-TypeScript applications only
      case 'local':
        return { left:originalPosition.left, top:originalPosition.top }
      default:
        throw new Error('invalid coordinate system given')
    }
  }



  export default {
    fromViewportTo,
    fromDocumentTo,
    fromLocalTo
  }
