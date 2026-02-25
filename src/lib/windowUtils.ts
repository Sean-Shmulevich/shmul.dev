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
