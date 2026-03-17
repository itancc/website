/**
 * WebGPU 引擎公共类型定义
 */

export interface EngineOptions {
  /** 画布元素 */
  canvas: HTMLCanvasElement;
  /** 是否开启抗锯齿 (默认 true) */
  antialias?: boolean;
  /** 是否开启深度缓冲 (默认 true) */
  depth?: boolean;
  /** 首选 GPU 功率: "high" | "low" (默认 "high") */
  powerPreference?: GPUPowerPreference;
  /** 设备丢失时的回调 */
  onDeviceLost?: (info: GPUDeviceLostInfo) => void;
}

export interface ResizeOptions {
  /** 宽度 (默认 canvas 客户端宽度) */
  width?: number;
  /** 高度 (默认 canvas 客户端高度) */
  height?: number;
  /** 设备像素比 (默认 devicePixelRatio) */
  devicePixelRatio?: number;
}

export interface BufferOptions {
  /** 数据或字节长度 */
  data?: ArrayBuffer | ArrayBufferView;
  /** 若未传 data，则必须传 size（字节数） */
  size?: number;
  /** 用途 */
  usage: GPUBufferUsageFlags;
  /** 是否映射可写 (默认 false) */
  mappedAtCreation?: boolean;
}

export interface TextureOptions {
  width: number;
  height: number;
  depthOrArrayLayers?: number;
  mipLevelCount?: number;
  sampleCount?: number;
  dimension?: GPUTextureDimension;
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
}

export type RenderCallback = (encoder: GPUCommandEncoder, view: GPUTextureView) => void;
