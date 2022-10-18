// see https://github.com/rozek/build-configuration-study

import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/javascript-interface-library.ts',
  output: [
    {
      file:     './dist/javascript-interface-library.js',
      format:    'umd', // builds for both Node.js and Browser
      name:      'JIL', // required for UMD modules
      noConflict:true,
      sourcemap: true,
      plugins: [terser({ format:{ comments:false, safari10:true } })],
    },{
      file:     './dist/javascript-interface-library.esm.js',
      format:   'esm',
      sourcemap:true,
    }
  ],
  plugins: [
    typescript(),
  ],
};