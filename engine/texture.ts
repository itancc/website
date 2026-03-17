/**
 * 纹理创建与拷贝工具
 */

import type { TextureOptions } from "./types";

/**
 * 创建 2D 纹理
 */
export function createTexture(
  device: GPUDevice,
  options: TextureOptions & { label?: string }
): GPUTexture {
  const {
    width,
    height,
    depthOrArrayLayers = 1,
    mipLevelCount = 1,
    sampleCount = 1,
    dimension = "2d",
    format,
    usage,
    label = "Texture",
  } = options;

  return device.createTexture({
    label,
    size: [width, height, depthOrArrayLayers],
    mipLevelCount,
    sampleCount,
    dimension,
    format,
    usage,
  });
}

/**
 * 创建可作为渲染目标的 2D 纹理（RENDER_ATTACHMENT + COPY_SRC）
 */
export function createRenderTexture(
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat = "bgra8unorm",
  options: { sampleCount?: number; label?: string } = {}
): GPUTexture {
  return createTexture(device, {
    width,
    height,
    format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    sampleCount: options.sampleCount ?? 1,
    label: options.label ?? "RenderTexture",
  });
}

/**
 * 从 ImageBitmap 创建纹理并上传
 */
export async function createTextureFromImage(
  device: GPUDevice,
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  options: { label?: string; mipLevelCount?: number } = {}
): Promise<GPUTexture> {
  const image = source instanceof ImageBitmap ? source : await createImageBitmap(source);
  const texture = device.createTexture({
    label: options.label ?? "TextureFromImage",
    size: [image.width, image.height, 1],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    mipLevelCount: options.mipLevelCount ?? 1,
  });

  device.queue.copyExternalImageToTexture(
    { source: image },
    { texture },
    [image.width, image.height, 1]
  );

  if (!(source instanceof ImageBitmap)) {
    image.close();
  }
  return texture;
}
