export function incrementCount(zIdx: number, currMaxZ: any, currStore: any, name: string) {
    if (zIdx > currMaxZ["zIdx"]) {
        // do nothing
    } else if (zIdx == currMaxZ["zIdx"]) {
        //make it higher then anything
        zIdx += 2;
    } else {
        zIdx = currMaxZ["zIdx"] + 1;
    }
    currStore.set({ zIdx, name });
    return zIdx;
}

export const windowOffsets = {
    fileWinOffset: 0
};

var tapedTwice = false;
export function tapHandler(event: any, handleMinimize: any) {
    if (!tapedTwice) {
        tapedTwice = true;
        setTimeout(function () {
            tapedTwice = false;
        }, 300);
        return false;
    }
    event.preventDefault();
    handleMinimize();
}

function isTouchDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error msMaxTouchPoints is a non-standard property
        navigator.msMaxTouchPoints > 0
    );
}

//true if the device has a touch screen.
export const touchDevice = isTouchDevice();
let touchstartX = 0;
let touchendX = 200;

export function swipeStart(e: any) {
    touchstartX = e.changedTouches[0].screenY;
}

export function swipeEnd(e: any, handleMinimize: any) {
    touchendX = e.changedTouches[0].screenY;
    if (Math.abs(touchstartX - touchendX) > 100) {
        if (touchendX > touchstartX) handleMinimize();
    }
}

export function handleMinimize(
    writableArray: any[],
    glowWindow: any,
    windowName: string,
    menuButtonSelector: string,
    elementSelector: string
) {
    let currMenuPos = writableArray.indexOf(windowName);
    glowWindow.set(windowName);
    if (currMenuPos === -1) return [false, 0, 0];

    let domButton = document.querySelector(menuButtonSelector);
    if (!domButton) return [false, 0, 0];

    let domButtonPos = domButton.getBoundingClientRect();

    let buttonMidPt = domButtonPos.left + domButtonPos.width / 3;
    let elem = document.querySelector(elementSelector);
    if (!elem) return [false, 0, 0];

    let styles = getComputedStyle(elem);
    let left = parseInt(styles.left);
    let bottom = parseInt(styles.bottom);
    let height = parseInt(styles.height);
    let width = parseInt(styles.width);
    let menuX = buttonMidPt - (left + width / 2) - 20;
    let menuY = bottom + height;

    elem.addEventListener("animationend", () => {
        if (glowWindow && typeof glowWindow.reset === 'function') {
            glowWindow.reset();
        }
    }, false);
    return [true, menuX, menuY];
}

export function minimizeFunc(windowIndex: any) {
    let elem = document.querySelector(`.titleWindow${windowIndex}`) as HTMLElement;
    let buttonMidPt = 0;
    if (window.innerWidth >= 1200) {
        buttonMidPt = (window.innerWidth / 100) * 15;
    } else {
        buttonMidPt = window.innerWidth / 2;
    }
    const { left, width, bottom, height } = elem.getBoundingClientRect();
    let menuX = (buttonMidPt - (left + width / 2)) - 20;
    let menuY = bottom + height;

    return [true, menuX, menuY];
}

/**
 * A robust Svelte action to handle window dragging using generic pointer/touch events.
 * This completely avoids HTML5 drag-and-drop and the need for buggy mobile polyfills.
 */
export function draggable(node: HTMLElement, { onDragStart, onDragMove, onDragEnd }: {
    onDragStart: () => { x: number, y: number },
    onDragMove: (x: number, y: number) => void,
    onDragEnd: (x: number, y: number) => void
}) {
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    function handlePointerDown(event: PointerEvent | TouchEvent) {
        if ('button' in event && event.button !== 0) return; // Only operate on left clicks

        // Prevent dragging if the user is clicking a button inside the title bar
        if (event.target instanceof Element && (event.target.tagName.toLowerCase() === 'button' || event.target.closest('button'))) {
            return;
        }

        // Prevent default browser touch scrolling/pinching gestures
        if (event.cancelable) event.preventDefault();

        if ('touches' in event) {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        } else {
            startX = (event as PointerEvent).clientX;
            startY = (event as PointerEvent).clientY;
        }

        const initial = onDragStart();
        initialX = initial.x;
        initialY = initial.y;

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('touchend', handlePointerUp);
        window.addEventListener('touchcancel', handlePointerUp);
    }

    function handlePointerMove(e: PointerEvent | TouchEvent) {
        if (e.cancelable) e.preventDefault();

        let clientX = 0;
        let clientY = 0;

        if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
            clientX = (e as PointerEvent).clientX;
            clientY = (e as PointerEvent).clientY;
        } else {
            return;
        }

        const dx = clientX - startX;
        const dy = clientY - startY;
        onDragMove(initialX + dx, initialY + dy);
    }

    function handlePointerUp(e: PointerEvent | TouchEvent) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
        window.removeEventListener('touchcancel', handlePointerUp);

        let clientX = undefined;
        let clientY = undefined;

        if ('changedTouches' in e && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else if ('clientX' in e) {
            clientX = (e as PointerEvent).clientX;
            clientY = (e as PointerEvent).clientY;
        }

        if (clientX !== undefined && clientY !== undefined) {
            const dx = clientX - startX;
            const dy = clientY - startY;
            onDragEnd(initialX + dx, initialY + dy);
        } else {
            onDragEnd(initialX, initialY);
        }
    }

    node.addEventListener('pointerdown', handlePointerDown);
    node.addEventListener('touchstart', handlePointerDown, { passive: false });

    return {
        update(newParams: any) {
            onDragStart = newParams.onDragStart;
            onDragMove = newParams.onDragMove;
            onDragEnd = newParams.onDragEnd;
        },
        destroy() {
            node.removeEventListener('pointerdown', handlePointerDown);
            node.removeEventListener('touchstart', handlePointerDown);
        }
    };
}
