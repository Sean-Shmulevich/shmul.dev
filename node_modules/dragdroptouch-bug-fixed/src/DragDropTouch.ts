let DragDropTouch:any
(function (DragDropTouchExport) {
  type DropEffect    = 'none'|'copy'|'link'|'move'
  type allowedEffect = (
    'none'|'copy'|'copyLink'|'copyMove'|'link'|'linkMove'|'move'|'all'|'uninitialized'
  )

  type simulatedDataTransfer = {
    _dropEffect:DropEffect,
    _effectAllowed:allowedEffect
    _data:{ [MIMEType:string]:any }
  }

  let DataTransfer = (function ():any {
    function DataTransfer (this:simulatedDataTransfer) {
      this._dropEffect = 'move'
      this._effectAllowed = 'all'
      this._data = {}
    }

    Object.defineProperty(DataTransfer.prototype, "dropEffect", {
      enumerable:true, configurable:true,
      get: function ()                 { return this._dropEffect },
      set: function (value:DropEffect) { this._dropEffect = value },
    })

    Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
      enumerable:true, configurable:true,
      get: function ()                    { return this._effectAllowed },
      set: function (value:allowedEffect) { this._effectAllowed = value },
    })

    Object.defineProperty(DataTransfer.prototype, "types", {
      enumerable:true, configurable:true,
      get: function () { return Object.keys(this._data) },
    })

    DataTransfer.prototype.clearData = function (type:string):void {
      if (type == null) {
        this._data = {}
      } else {
        delete this._data[type.toLowerCase()]
      }
    }

    DataTransfer.prototype.getData = function (type:string):any {
      return this._data[type.toLowerCase()] || ''
    }

    DataTransfer.prototype.setData = function (type:string, value:string):void {
      this._data[type.toLowerCase()] = value
    }

    DataTransfer.prototype.setDragImage = function (
      img:Element, offsetX:number,offsetY:number
    ) {
      let ddt = DragDropTouchSingleton._instance
      ddt._imgCustom = img
      ddt._imgOffset = { x:offsetX, y:offsetY }
    }

    return DataTransfer
  }())

  DragDropTouchExport.DataTransfer = DataTransfer

  type DragDropTouchInstance = {
    _instance:DragDropTouchInstance,
    getInstance: () => DragDropTouchInstance,

    _lastClick:number,
    _touchstart:(e:Event) => any,
    _touchmove:(e:Event) => any,
    _touchend:(e:Event) => any,

    _imgCustom:Element,
    _imgOffset: { x:number, y:number },

    _THRESHOLD:number,
    _OPACITY:number,
    _DBLCLICK:number,
    _CTXMENU:number,
    _ISPRESSHOLDMODE:boolean,
    _PRESSHOLDAWAIT:number,
    _PRESSHOLDMARGIN:number,
    _PRESSHOLDTHRESHOLD:number,

    _rmvAtts:string[],
    _kbdProps:string[],
    _ptProps:string[],
  }

  let DragDropTouchSingleton:DragDropTouchInstance = (function () {
    function DragDropTouch (this:DragDropTouchInstance) {
      this._lastClick = 0

      if (
        (DragDropTouchSingleton != null) &&
        (DragDropTouchSingleton._instance != null)
      ) {
        throw new Error('DragDropTouch instance already created.')
      }

      // https://github.com/Modernizr/Modernizr/issues/1894
      let supportsPassive:boolean = false
      document.addEventListener('test', function () {}, {
        get passive() { supportsPassive = true; return true }
      })

      if (navigator.maxTouchPoints > 0) {
        let touchstart = this._touchstart.bind(this)
        let touchmove  = this._touchmove.bind(this)
        let touchend   = this._touchend.bind(this)

        let Options = (
          supportsPassive ? { passive:false, capture:false } : false
        )

        document.addEventListener('touchstart',  touchstart, Options)
        document.addEventListener('touchmove',   touchmove,  Options)
        document.addEventListener('touchend',    touchend)
        document.addEventListener('touchcancel', touchend)
      }
    }

    DragDropTouch.getInstance = function ():DragDropTouchInstance {
      return DragDropTouchSingleton._instance
    }

  /**** Event Handlers ****/

    DragDropTouch.prototype._touchstart = function (e:Event) {
      let _this = this
      if (this._shouldHandle(e)) {
        if (Date.now() - this._lastClick < DragDropTouchSingleton._DBLCLICK) {
          if (this._dispatchEvent(e, 'dblclick', e.target)) {
            e.preventDefault()
            this._reset()
            return
          }
        }

        this._reset()

        let src = this._closestDraggable(e.target)
        if (src != null) {
          if (
            ! this._dispatchEvent(e, 'mousemove', e.target) &&
            ! this._dispatchEvent(e, 'mousedown', e.target)
          ) {
            this._dragSource = src
            this._ptDown     = this._getPoint(e)
            this._lastTouch  = e
            e.preventDefault()

            setTimeout(function () {
              if ((_this._dragSource === src) && (_this._img == null)) {
                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                  _this._reset()
                }
              }
            }, DragDropTouchSingleton._CTXMENU)

            if (DragDropTouchSingleton._ISPRESSHOLDMODE) {
              this._pressHoldInterval = setTimeout(function () {
                _this._isDragEnabled = true
                _this._touchmove(e)
              }, DragDropTouchSingleton._PRESSHOLDAWAIT)
            }
          }
        }
      }
    }

    DragDropTouch.prototype._touchmove = function (e:Event) {
      if (this._shouldCancelPressHoldMove(e)) {
        this._reset()
        return
      }

      if (this._shouldHandleMove(e) || this._shouldHandlePressHoldMove(e)) {
        let target = this._getTarget(e)
        if (this._dispatchEvent(e, 'mousemove', target)) {
          this._lastTouch = e
          e.preventDefault()
          return
        }

        let lastPointOnPage = this._getPoint(this._lastTouch,true)
        let curPointOnPage  = this._getPoint(e,true)
          this._lastMovementX = curPointOnPage.x - lastPointOnPage.x
          this._lastMovementY = curPointOnPage.y - lastPointOnPage.y
        let Extras = { movementX:this._lastMovementX, movementY:this._lastMovementY }

        if (this._dragSource && (this._img == null) && this._shouldStartDragging(e)) {
          this._dispatchEvent(e, 'dragstart', this._dragSource, Extras)
          this._createImage(e)
          this._dispatchEvent(e, 'dragenter', target, Extras)
        }

        if (this._img != null) {
          this._lastTouch = e
          e.preventDefault()

          this._dispatchEvent(e, 'drag', this._dragSource, Extras)

          if (target != this._lastTarget) {
            this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget, Extras)
            this._dispatchEvent(e, 'dragenter', target, Extras)
            this._lastTarget = target
          }

          this._moveImage(e)
          this._isDropZone = this._dispatchEvent(e, 'dragover', target, Extras)
        }
      }
    }

    DragDropTouch.prototype._touchend = function (e:Event) {
      if (this._shouldHandle(e)) {
        if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
          e.preventDefault()
          return
        }

        if (this._img == null) {
          this._dragSource = null
          this._dispatchEvent(this._lastTouch, 'click', e.target)
          this._lastClick = Date.now()
        }

        this._destroyImage()
        if (this._dragSource) {
          let Extras = { movementX:this._lastMovementX, movementY:this._lastMovementY }

          if (e.type.indexOf('cancel') < 0 && this._isDropZone) {
            this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget, Extras)
          }
          this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource, Extras)
          this._reset()
        }
      }
    }

  /**** Utility Functions ****/

    DragDropTouch.prototype._shouldHandle = function (e:Event):boolean {
      return (
        (e != null) && ! e.defaultPrevented &&
        ((e as TouchEvent).touches != null) && ((e as TouchEvent).touches.length < 2)
      )
    }

    DragDropTouch.prototype._shouldHandleMove = function (e:Event):boolean {
      return ! DragDropTouchSingleton._ISPRESSHOLDMODE && this._shouldHandle(e)
    }

    DragDropTouch.prototype._shouldHandlePressHoldMove = function (e:Event):boolean {
      return (
        DragDropTouchSingleton._ISPRESSHOLDMODE && this._isDragEnabled &&
        (e != null) && ((e as TouchEvent).touches != null) && ((e as TouchEvent).touches.length > 0)
      )
    }

    DragDropTouch.prototype._shouldCancelPressHoldMove = function (e:Event):boolean {
      return (
        DragDropTouchSingleton._ISPRESSHOLDMODE && ! this._isDragEnabled &&
        (this._getDelta(e) > DragDropTouchSingleton._PRESSHOLDMARGIN)
      )
    }

    DragDropTouch.prototype._shouldStartDragging = function (e:Event):boolean {
      let delta = this._getDelta(e)
      return (
        (delta > DragDropTouchSingleton._THRESHOLD) ||
        DragDropTouchSingleton._ISPRESSHOLDMODE && (delta >= DragDropTouchSingleton._PRESSHOLDTHRESHOLD)
      )
    }

    DragDropTouch.prototype._reset = function ():void {
      this._destroyImage()
      this._dragSource = null
      this._lastTouch  = null
      this._lastTarget = null
      this._ptDown = null
      this._isDragEnabled = false
      this._isDropZone = false
      this._dataTransfer = new DataTransfer()
      this._lastMovementX = 0
      this._lastMovementY = 0
      clearInterval(this._pressHoldInterval)
    }

    DragDropTouch.prototype._getPoint = function (e:MouseEvent|TouchEvent, page:boolean):any {
      if (
        (e != null) && ((e as TouchEvent).touches != null) &&
        ((e as TouchEvent).touches.length > 0)
      ) {
        let Touch = (e as TouchEvent).touches[0]
        return { x: page ? Touch.pageX : Touch.clientX, y: page ? Touch.pageY : Touch.clientY }
      } else {
        let Event = e as MouseEvent
        return { x: page ? Event.pageX : Event.clientX, y: page ? Event.pageY : Event.clientY }
      }
    }

    DragDropTouch.prototype._getDelta = function (e:Event) {
      if (DragDropTouchSingleton._ISPRESSHOLDMODE && ! this._ptDown) { return 0 }
      let p = this._getPoint(e)
      return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y)
    }

    DragDropTouch.prototype._getTarget = function (e:Event) {
      let pt = this._getPoint(e)
      let el = document.elementFromPoint(pt.x, pt.y)

      while ((el != null) && (getComputedStyle(el).pointerEvents == 'none')) {
        el = el.parentElement
      }
      return el
    }

    DragDropTouch.prototype._createImage = function (e:Event):void {
      if (this._img != null) { this._destroyImage() }

      let src = this._imgCustom || this._dragSource
      this._img = src.cloneNode(true)
      this._copyStyle(src, this._img)
      this._img.style.top = this._img.style.left = '-9999px'

      if (this._imgCustom == null) {
        let rc = src.getBoundingClientRect()
        let pt = this._getPoint(e)

        this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top }
        this._img.style.opacity = DragDropTouchSingleton._OPACITY.toString()
      }

      this._moveImage(e)
      document.body.appendChild(this._img)
    }

    DragDropTouch.prototype._destroyImage = function ():void {
      if ((this._img != null) && (this._img.parentElement != null)) {
        this._img.parentElement.removeChild(this._img)
      }
      this._img = null
      this._imgCustom = null
    }

    DragDropTouch.prototype._moveImage = function (e:Event) {
      let _this = this
      requestAnimationFrame(function () {
        if (_this._img != null) {
          let pt = _this._getPoint(e, true), s = _this._img.style
          s.position = 'absolute'
          s.pointerEvents = 'none'
          s.zIndex = '999999'
          s.left = Math.round(pt.x - _this._imgOffset.x) + 'px'
          s.top = Math.round(pt.y - _this._imgOffset.y) + 'px'
        }
      })
    }

    DragDropTouch.prototype._copyProps = function (
      dst:any, src:any, props:string[]
    ):void {
      for (let i = 0; i < props.length; i++) {
        let p = props[i]
        dst[p] = src[p]
      }
    }

    DragDropTouch.prototype._copyStyle = function (src:any, dst:any):void {
      DragDropTouchSingleton._rmvAtts.forEach(function (att:string) {
        dst.removeAttribute(att)
      })

      if (src instanceof HTMLCanvasElement) {
        let cSrc = src, cDst = dst
        cDst.width = cSrc.width
        cDst.height = cSrc.height
        cDst.getContext('2d').drawImage(cSrc, 0, 0)
      }

      let cs = getComputedStyle(src) as any // poor trick to satisfy compiler
      for (let i = 0; i < cs.length; i++) {
        let key = cs[i]
        if (key.indexOf('transition') < 0) {
          dst.style[key] = cs[key]
        }
      }
      dst.style.pointerEvents = 'none'

      for (let i = 0; i < src.children.length; i++) {
        this._copyStyle(src.children[i], dst.children[i])
      }
    }

    DragDropTouch.prototype._dispatchEvent = function (
      e:any /* poor TypeScript trick */, type:string, target:Element,
      Extras?:{ movementX:number, movementY:number }
    ):boolean {
      if ((e != null) && (target != null)) {
        let evt = document.createEvent('Event') as any // poor trick to satisfy compiler
        let t = (e['touches'] != null) ? e['touches'][0] : e
          evt.initEvent(type, true, true)
          evt['button'] = 0
          evt['which'] = evt['buttons'] = 1
          this._copyProps(evt, e, DragDropTouchSingleton._kbdProps)
          this._copyProps(evt, t, DragDropTouchSingleton._ptProps)
          evt['dataTransfer'] = this._dataTransfer

          if (Extras != null) {
            evt['movementX'] = Extras.movementX
            evt['movementY'] = Extras.movementY
          }
        target.dispatchEvent(evt)
        return evt.defaultPrevented
      }
      return false
    }

    DragDropTouch.prototype._closestDraggable = function (e:Element|null) {
      for (; e; e = e.parentElement) {
        if (e.hasAttribute('draggable') && e.getAttribute('draggable')) {
          return e
        }
      }
      return null
    }

// @ts-ignore
    let Singleton = new DragDropTouch()
      Singleton._instance = Singleton
    return Singleton
  }())

  DragDropTouchExport.DragDropTouch = DragDropTouchSingleton

  let Singleton = DragDropTouch.DragDropTouch

  Singleton._THRESHOLD = 5; // pixels to move before drag starts
  Singleton._OPACITY = 0.5; // drag image opacity
  Singleton._DBLCLICK = 500; // max ms between clicks in a double click
  Singleton._CTXMENU = 900; // ms to hold before raising 'contextmenu' event
  Singleton._ISPRESSHOLDMODE = false; // decides of press & hold mode presence
  Singleton._PRESSHOLDAWAIT = 400; // ms to wait before press & hold is detected
  Singleton._PRESSHOLDMARGIN = 25; // pixels that finger might shiver while pressing
  Singleton._PRESSHOLDTHRESHOLD = 0; // pixels to move before drag starts

  Singleton._rmvAtts = 'id,class,style,draggable'.split(',')

  Singleton._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',')
  Singleton._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY,offsetX,offsetY'.split(',')
})(DragDropTouch || (DragDropTouch = {}))

export default DragDropTouch

