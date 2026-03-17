/**
 * WebGPU 引擎 - 标准易用封装
 *
 * @example
 * ```ts
 * const engine = new Engine();
 * await engine.init({ canvas: document.querySelector('canvas')! });
 * engine.setClearColor(0.1, 0.1, 0.15, 1);
 * engine.onFrame((eng) => {
 *   const { context } = eng;
 *   eng.render((encoder, view) => {
 *     const pass = encoder.beginRenderPass({
 *       colorAttachments: [{ view, loadOp: 'clear', storeOp: 'store' }],
 *     });
 *     // 设置 pipeline、绑定资源、draw...
 *     pass.end();
 *     eng.device.queue.submit([encoder.finish()]);
 *   });
 * });
 * engine.run();
 * ```
 */

export { Engine } from "./engine";
export { WebGPUContext } from "./context";
export { createShaderModule, FULLSCREEN_VERTEX_WGSL } from "./shader";
export {
  createRenderPipeline,
  createBindGroupLayout,
  createPipelineLayout,
} from "./pipeline";
export {
  createBuffer,
  createVertexBuffer,
  createIndexBuffer,
  createUniformBuffer,
  writeBuffer,
} from "./buffer";
export {
  createTexture,
  createRenderTexture,
  createTextureFromImage,
} from "./texture";
export { render, renderPass } from "./renderer";

export type {
  EngineOptions,
  ResizeOptions,
  BufferOptions,
  TextureOptions,
  RenderCallback,
} from "./types";
