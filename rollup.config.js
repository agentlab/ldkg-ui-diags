import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

import autoprefixer from 'autoprefixer';
//import cssnano from 'cssnano';
//import { terser } from 'rollup-plugin-terser';

export default {
  preserveModules: true,
  input: 'src/index.ts',
  output: [
    /*{
      dir: './lib',
      //file: 'lib/ldkg-ui-diags.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },*/
    {
      dir: './es',
      //file: 'es/ldkg-ui-diags.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ declaration: true, outDir: './es' }),
    /*postcss({
      plugins: [
        autoprefixer(),
        cssnano({
          preset: 'default',
        }),
      ],
      inject: false,
      minimize: false,
      sourceMap: false,
      //extensions: ['.less', '.css'],
      //use: [['less', { javascriptEnabled: true }]],
    }),*/
    postcss({
      plugins: [autoprefixer()],
      sourceMap: true,
      extract: true,
      minimize: true,
    }),
    //terser(), // minifies generated bundles
  ],
};
