declare type Position = {
    left: number;
    top: number;
};
declare function fromViewportTo(System: 'document' | 'local', originalPosition: Position, Target?: Element): Position;
declare function fromDocumentTo(System: 'viewport' | 'local', originalPosition: Position, Target?: Element): Position;
declare function fromLocalTo(System: 'viewport' | 'document', originalPosition: Position, Source?: Element): Position;
declare const _default: {
    fromViewportTo: typeof fromViewportTo;
    fromDocumentTo: typeof fromDocumentTo;
    fromLocalTo: typeof fromLocalTo;
};
export default _default;
