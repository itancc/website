/**
 * WebGPU 上下文：适配器、设备、画布与交换链
 */

import type { EngineOptions, ResizeOptions } from "./types";

export class WebGPUContext {
  readonly adapter: GPUAdapter;
  readonly device: GPUDevice;
  readonly context: GPUCanvasContext;
  readonly canvas: HTMLCanvasElement;
  readonly format: GPUTextureFormat;
  private _configured = false;

  static async create(options: EngineOptions): Promise<WebGPUContext> {
    const { canvas, antialias = true, powerPreference = "high", onDeviceLost } = options;

    if (!navigator.gpu) {
      throw new Error("WebGPU is not supported in this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter({ powerPreference });
    if (!adapter) {
      throw new Error("Failed to get WebGPU adapter.");
    }

    const device = await adapter.requestDevice();
    if (onDeviceLost) {
      device.lost.then(onDeviceLost);
    }

    const context = canvas.getContext("webgpu");
    if (!context) {
      throw new Error("Failed to get WebGPU canvas context.");
    }

    const format = navigator.gpu.getPreferredCanvasFormat?.() ?? "bgra8unorm";
    context.configure({
      device,
      format,
      alphaMode: "opaque",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    const ctx = new WebGPUContext(adapter, device, context, canvas, format);
    ctx.resize();
    return ctx;
  }

  private constructor(
    adapter: GPUAdapter,
    device: GPUDevice,
    context: GPUCanvasContext,
    canvas: HTMLCanvasElement,
    format: GPUTextureFormat
  ) {
    this.adapter = adapter;
    this.device = device;
    this.context = context;
    this.canvas = canvas;
    this.format = format;
    this._configured = true;
  }

  /** 根据画布尺寸与 DPR 调整 canvas 与上下文 */
  resize(options: ResizeOptions = {}): void {
    const { canvas, context, device } = this;
    const dpr = options.devicePixelRatio ?? window.devicePixelRatio ?? 1;
    const width = options.width ?? Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = options.height ?? Math.max(1, Math.floor(canvas.clientHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      context.configure({
        device,
        format: this.format,
        alphaMode: "opaque",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      });
    }
  }

  /** 获取当前画布对应的纹理视图，用于作为渲染目标 */
  getCurrentTextureView(): GPUTextureView {
    return this.context.getCurrentTexture().createView();
  }

  /** 获取当前画布纹理 */
  getCurrentTexture(): GPUTexture {
    return this.context.getCurrentTexture();
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  destroy(): void {
    this._configured = false;
    this.device.destroy();
  }
}
