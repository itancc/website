/**
 * WGSL 着色器模块封装
 */

export function createShaderModule(
  device: GPUDevice,
  code: string,
  label?: string
): GPUShaderModule {
  return device.createShaderModule({
    label: label ?? "Shader",
    code,
  });
}

/** 常用全屏三角形顶点着色器 (NDC -1~1, 覆盖屏幕) */
export const FULLSCREEN_VERTEX_WGSL = /* wgsl */ `
  @vertex
  fn main(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
    const pos = array(
      vec2f(-1, -1), vec2f(3, -1), vec2f(-1, 3)
    );
    return vec4f(pos[i], 0.0, 1.0);
  }
`;
