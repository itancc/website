/**
 * 渲染通道封装：简化 render pass 与 present
 */

import type { WebGPUContext } from "./context";
import type { RenderCallback } from "./types";

export interface RenderPassOptions {
  /** 清除颜色 [r, g, b, a]，不传则不 clear */
  clearColor?: [number, number, number, number];
  /** 清除深度，不传则不 clear */
  clearDepth?: number;
  /** 深度纹理视图（若需深度测试） */
  depthView?: GPUTextureView;
}

/**
 * 在默认的 canvas 纹理上执行一次渲染
 */
export function render(
  ctx: WebGPUContext,
  callback: RenderCallback,
  options: RenderPassOptions = {}
): void {
  const { device } = ctx;
  const view = ctx.getCurrentTextureView();
  const encoder = device.createCommandEncoder({ label: "RenderEncoder" });

  callback(encoder, view);

  device.queue.submit([encoder.finish()]);
}

/**
 * 创建并执行一个完整的 RenderPass（clear + 用户绘制）
 */
export function renderPass(
  ctx: WebGPUContext,
  callback: (pass: GPURenderPassEncoder) => void,
  options: RenderPassOptions = {}
): void {
  const { device } = ctx;
  const view = ctx.getCurrentTextureView();
  const { clearColor, clearDepth, depthView } = options;

  const encoder = device.createCommandEncoder({ label: "RenderPassEncoder" });

  const passDesc: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view,
        clearValue: clearColor ? { r: clearColor[0], g: clearColor[1], b: clearColor[2], a: clearColor[3] } : undefined,
        loadOp: clearColor != null ? "clear" : "load",
        storeOp: "store",
      },
    ],
  };

  if (depthView) {
    passDesc.depthStencilAttachment = {
      view: depthView,
      depthClearValue: clearDepth ?? 1,
      depthLoadOp: clearDepth != null ? "clear" : "load",
      depthStoreOp: "store",
    };
  }

  const pass = encoder.beginRenderPass(passDesc);
  callback(pass);
  pass.end();

  device.queue.submit([encoder.finish()]);
}
