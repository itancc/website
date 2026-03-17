/**
 * 渲染管线与管线布局
 */

import type { WebGPUContext } from "./context";

export interface RenderPipelineOptions {
  /** 顶点着色器模块 */
  vertex: GPUShaderModule;
  /** 片元着色器模块 */
  fragment: GPUShaderModule;
  /** 顶点缓冲布局 */
  vertexBuffers?: GPUVertexBufferLayout[];
  /** 管线布局（若需 uniform/纹理等） */
  layout?: GPUPipelineLayout | "auto";
  /** 图元拓扑 (默认 "triangle-list") */
  topology?: GPUPrimitiveTopology;
  /** 片元目标格式，默认使用 context 的 swapchain 格式 */
  targets?: GPUColorTargetState[];
  /** 深度模板状态 */
  depthStencil?: GPUDepthStencilState;
  /** 多重采样 */
  multisample?: GPUMultisampleState;
  /** 标签 */
  label?: string;
}

/**
 * 创建渲染管线
 */
export function createRenderPipeline(
  device: GPUDevice,
  options: RenderPipelineOptions,
  context?: WebGPUContext
): GPURenderPipeline {
  const {
    vertex,
    fragment,
    vertexBuffers = [],
    layout = "auto",
    topology = "triangle-list",
    targets,
    depthStencil,
    multisample,
    label = "RenderPipeline",
  } = options;

  const colorTargets: GPUColorTargetState[] =
    targets ?? (context ? [{ format: context.format }] : []);

  return device.createRenderPipeline({
    label,
    layout,
    vertex: {
      module: vertex,
      entryPoint: "main",
      buffers: vertexBuffers,
    },
    fragment: {
      module: fragment,
      entryPoint: "main",
      targets: colorTargets,
    },
    primitive: { topology },
    depthStencil: depthStencil ?? undefined,
    multisample: multisample ?? { count: 1 },
  });
}

/**
 * 创建简单的 bind group 布局（常用于 uniform + 纹理）
 */
export function createBindGroupLayout(
  device: GPUDevice,
  entries: GPUBindGroupLayoutEntry[],
  label?: string
): GPUBindGroupLayout {
  return device.createBindGroupLayout({
    label: label ?? "BindGroupLayout",
    entries,
  });
}

/**
 * 创建管线布局
 */
export function createPipelineLayout(
  device: GPUDevice,
  bindGroupLayouts: GPUBindGroupLayout[],
  label?: string
): GPUPipelineLayout {
  return device.createPipelineLayout({
    label: label ?? "PipelineLayout",
    bindGroupLayouts,
  });
}
