# svelte-coordinate-conversion #

converts coordinates between viewport, document and element coordinate systems (not only in Svelte)
 
**NPM users**: please consider the [Github README](https://github.com/rozek/svelte-viewport-info/blob/main/README.md) for the latest description of this package (as updating the docs would otherwise always require a new NPM package version)

## Installation ##

```
npm install svelte-coordinate-conversion
```

## Usage ##

```
<script>
  import Conversion from 'svelte-coordinate-conversion'

  let TargetElement // element, whose local position is to be read or set
  let localPosition, ViewportPosition, DocumentPosition
  
  localPosition    = { left:0, top:0 } // local position to be converted
  ViewportPosition = Conversion.fromLocalTo('viewport',localPosition,TargetElement)
  DocumentPosition = Conversion.fromLocalTo('document',localPosition,TargetElement)

  ViewportPosition = { left:0, top:0 } // viewport position to be converted
  localPosition    = Conversion.fromViewportTo('local',   ViewportPosition,TargetElement)
  DocumentPosition = Conversion.fromViewportTo('document',ViewportPosition)

  DocumentPosition = { left:0, top:0 } // document position to be converted
  localPosition    = Conversion.fromDocumentTo('local',   DocumentPosition,TargetElement)
  ViewportPosition = Conversion.fromDocumentTo('viewport',DocumentPosition)
</script>
```

## Example ##

An example is available on the Svelte REPL - feel free to play with it!

* [svelte-coordinate-conversion](https://svelte.dev/repl/269fa097ebfb4175990b129b25e9dafa)

## Background Information ##

From time to time it becomes necessary to covert browser coordinates between various coordinate systems, e.g., from relative to an element to relative to the current viewport or the whole document. This package simplifies such conversions.

### JavaScript API ###

The package offers a JavaScript `default` export, which may be imported as follows

  `import Conversion from 'svelte-coordinate-conversion'`

With such an import, the JavaScript API can be used as follows:

* **`Conversion.fromLocalTo('viewport',localPosition,TargetElement)`**<br>converts `localPosition` (which is relative to the `TargetElement`) into a position relative to the current viewport
* **`Conversion.fromLocalTo('document',localPosition,TargetElement)`**<br>converts `localPosition` (which is relative to the `TargetElement`) into a position relative to the document
* **`Conversion.fromViewportTo('local',ViewportPosition,TargetElement)`**<br>converts `ViewportPosition` (which is relative to the current viewport) into a position relative to element `TargetElement`
* **`Conversion.fromViewportTo('document',ViewportPosition)`**<br>converts `ViewportPosition` (which is relative to the current viewport) into a position relative to the document
* **`Conversion.fromDocumentTo('local',DocumentPosition,TargetElement)`**<br>converts `DocumentPosition` (which is relative to the document) into a position relative to element `TargetElement`
* **`Conversion.fromDocumentTo('viewport',DocumentPosition)`**<br>converts `DocumentPosition` (which is relative to the document) into a position relative to the current viewport

## Build Instructions ##

You may easily build this package yourself.

Just install [NPM](https://docs.npmjs.com/) according to the instructions for your platform and follow these steps:

1. either clone this repository using [git](https://git-scm.com/) or [download a ZIP archive](https://github.com/rozek/svelte-coordinate-conversion/archive/refs/heads/main.zip) with its contents to your disk and unpack it there 
2. open a shell and navigate to the root directory of this repository
3. run `npm install` in order to install the complete build environment
4. execute `npm run build` to create a new build

## License ##

[MIT License](LICENSE.md)
