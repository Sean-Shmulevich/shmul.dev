// see https://github.com/rozek/build-configuration-study

import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/DragDropTouch.ts',
  output: [
    {
      file:     './dist/DragDropTouch.js',
      format:    'umd', // builds for both Node.js and Browser
      name:      'DragDropTouch', // required for UMD modules
      noConflict:true,
      sourcemap: true,
      exports:   'default',
      plugins:   [terser({ format:{ comments:false, safari10:true } })],
    },{
      file:     './dist/DragDropTouch.esm.js',
      format:   'esm',
      sourcemap:true,
    }
  ],
  plugins: [
    typescript(),
  ],
};
