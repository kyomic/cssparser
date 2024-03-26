// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import terser from "@rollup/plugin-terser";

export default {
  input: 'src/index.ts', // TypeScript 入口文件路径
  output: {
    file: 'lib/index.js', // 输出文件路径
    format: 'cjs', // 输出格式，可选 'amd', 'cjs', 'es', 'iife', 'umd'
    sourcemap: false, // 是否生成源映射文件
  },
  plugins: [
    // 使用 terser 插件压缩代码
    terser(),
    resolve(), // 解析第三方模块路径
    commonjs(), // 将 CommonJS 模块转换为 ES6 模块
    typescript(), // 处理 TypeScript 文件
  ],
};
