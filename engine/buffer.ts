/**
 * Buffer 创建与上传工具
 */

import type { BufferOptions } from "./types";

/**
 * 创建 GPU 缓冲区
 */
export function createBuffer(device: GPUDevice, options: BufferOptions & { label?: string }): GPUBuffer {
  const { data, size, usage, mappedAtCreation = false, label } = options;

  const byteLength = data
    ? data instanceof ArrayBuffer
      ? data.byteLength
      : data.byteLength
    : size;

  if (byteLength == null || byteLength <= 0) {
    throw new Error("Buffer size must be positive. Provide 'data' or 'size'.");
  }

  const buffer = device.createBuffer({
    label: label ?? "Buffer",
    size: byteLength,
    usage,
    mappedAtCreation: mappedAtCreation ?? !!data,
  });

  if (data) {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    device.queue.writeBuffer(buffer, 0, bytes);
  }

  return buffer;
}

/**
 * 创建顶点缓冲区（带 usage 与可选数据）
 */
export function createVertexBuffer(
  device: GPUDevice,
  data: ArrayBuffer | ArrayBufferView,
  label?: string
): GPUBuffer {
  return createBuffer(device, {
    data,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    label: label ?? "VertexBuffer",
  });
}

/**
 * 创建索引缓冲区
 */
export function createIndexBuffer(
  device: GPUDevice,
  data: ArrayBuffer | ArrayBufferView,
  label?: string
): GPUBuffer {
  return createBuffer(device, {
    data,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    label: label ?? "IndexBuffer",
  });
}

/**
 * 创建 Uniform 缓冲区
 */
export function createUniformBuffer(
  device: GPUDevice,
  data: ArrayBuffer | ArrayBufferView,
  label?: string
): GPUBuffer {
  return createBuffer(device, {
    data,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    label: label ?? "UniformBuffer",
  });
}

/**
 * 更新 buffer 内容（从偏移 0 开始写入）
 */
export function writeBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  data: ArrayBuffer | ArrayBufferView,
  offset = 0
): void {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  device.queue.writeBuffer(buffer, offset, bytes);
}
