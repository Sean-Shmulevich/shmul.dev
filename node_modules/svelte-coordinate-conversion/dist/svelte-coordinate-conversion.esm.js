//----------------------------------------------------------------------------//
//                        Svelte Coordinate Conversion                        //
//----------------------------------------------------------------------------//
function fromViewportTo(System, originalPosition, Target) {
    switch (true) {
        case (originalPosition == null):
            throw new Error('no "Position" given');
        case (typeof originalPosition.left !== 'number') && !(originalPosition.left instanceof Number):
        case (typeof originalPosition.top !== 'number') && !(originalPosition.top instanceof Number):
            throw new Error('invalid "Position" given');
    }
    switch (System) {
        case null:
        case undefined:
            throw new Error('no coordinate system given');
        // @ts-ignore the following check is for non-TypeScript applications only
        case 'viewport':
            return { left: originalPosition.left, top: originalPosition.top };
        case 'document':
            return {
                left: originalPosition.left + window.scrollX,
                top: originalPosition.top + window.scrollY
            };
        case 'local':
            switch (true) {
                case (Target == null):
                    throw new Error('no target element given');
                case (Target instanceof Element):
                    var computedStyle = window.getComputedStyle(Target);
                    var leftOffset = parseFloat(computedStyle.borderLeftWidth);
                    var topOffset = parseFloat(computedStyle.borderTopWidth);
                    var TargetPositionInViewport = Target.getBoundingClientRect();
                    return {
                        left: originalPosition.left - TargetPositionInViewport.left - leftOffset,
                        top: originalPosition.top - TargetPositionInViewport.top - topOffset
                    };
                default:
                    throw new Error('invalid target element given');
            }
        default:
            throw new Error('invalid coordinate system given');
    }
}
function fromDocumentTo(System, originalPosition, Target) {
    switch (true) {
        case (originalPosition == null):
            throw new Error('no "Position" given');
        case (typeof originalPosition.left !== 'number') && !(originalPosition.left instanceof Number):
        case (typeof originalPosition.top !== 'number') && !(originalPosition.top instanceof Number):
            throw new Error('invalid "Position" given');
    }
    switch (System) {
        case null:
        case undefined:
            throw new Error('no coordinate system given');
        case 'viewport':
            return {
                left: originalPosition.left - window.scrollX,
                top: originalPosition.top - window.scrollY
            };
        // @ts-ignore the following check is for non-TypeScript applications only
        case 'document':
            return { left: originalPosition.left, top: originalPosition.top };
        case 'local':
            switch (true) {
                case (Target == null):
                    throw new Error('no target element given');
                case (Target instanceof Element):
                    var computedStyle = window.getComputedStyle(Target);
                    var leftOffset = parseFloat(computedStyle.borderLeftWidth);
                    var topOffset = parseFloat(computedStyle.borderTopWidth);
                    var TargetPositionInViewport = Target.getBoundingClientRect();
                    return {
                        left: originalPosition.left + window.scrollX - TargetPositionInViewport.left - leftOffset,
                        top: originalPosition.top + window.scrollY - TargetPositionInViewport.top - topOffset
                    };
                default:
                    throw new Error('invalid target element given');
            }
        default:
            throw new Error('invalid coordinate system given');
    }
}
function fromLocalTo(System, originalPosition, Source) {
    switch (true) {
        case (originalPosition == null):
            throw new Error('no "Position" given');
        case (typeof originalPosition.left !== 'number') && !(originalPosition.left instanceof Number):
        case (typeof originalPosition.top !== 'number') && !(originalPosition.top instanceof Number):
            throw new Error('invalid "Position" given');
    }
    var SourcePositionInViewport, leftPosition, topPosition;
    switch (true) {
        case (Source == null):
            throw new Error('no source element given');
        case (Source instanceof Element):
            var computedStyle = window.getComputedStyle(Source);
            var leftOffset = parseFloat(computedStyle.borderLeftWidth);
            var topOffset = parseFloat(computedStyle.borderTopWidth);
            SourcePositionInViewport = Source.getBoundingClientRect();
            leftPosition = SourcePositionInViewport.left + leftOffset;
            topPosition = SourcePositionInViewport.top + topOffset;
            break;
        default:
            throw new Error('invalid source element given');
    }
    switch (System) {
        case null:
        case undefined:
            throw new Error('no coordinate system given');
        case 'viewport':
            return {
                left: originalPosition.left + leftPosition,
                top: originalPosition.top + topPosition
            };
        case 'document':
            return {
                left: originalPosition.left + leftPosition + window.scrollX,
                top: originalPosition.top + topPosition + window.scrollY
            };
        // @ts-ignore the following check is for non-TypeScript applications only
        case 'local':
            return { left: originalPosition.left, top: originalPosition.top };
        default:
            throw new Error('invalid coordinate system given');
    }
}
var svelteCoordinateConversion = {
    fromViewportTo: fromViewportTo,
    fromDocumentTo: fromDocumentTo,
    fromLocalTo: fromLocalTo
};

export default svelteCoordinateConversion;
//# sourceMappingURL=svelte-coordinate-conversion.esm.js.map
