/**
 * WebGPU 引擎主类：上下文 + 渲染循环 +  resize
 */

import { WebGPUContext } from "./context";
import type { EngineOptions, ResizeOptions, RenderCallback } from "./types";
import { render as renderToContext } from "./renderer";
import { renderPass } from "./renderer";

export class Engine {
  private _ctx: WebGPUContext | null = null;
  private _running = false;
  private _frameId: number | null = null;
  private _onFrame: ((engine: Engine) => void) | null = null;
  private _clearColor: [number, number, number, number] = [0, 0, 0, 1];
  private _clearDepth: number | undefined = 1;
  private _depthView: GPUTextureView | null = null;

  /** 是否已初始化 */
  get ready(): boolean {
    return this._ctx != null;
  }

  /** 是否正在运行渲染循环 */
  get running(): boolean {
    return this._running;
  }

  /** WebGPU 上下文（初始化后可用） */
  get context(): WebGPUContext {
    if (!this._ctx) throw new Error("Engine not initialized. Call engine.init() first.");
    return this._ctx;
  }

  /** 设备 */
  get device(): GPUDevice {
    return this.context.device;
  }

  /** 画布宽度（像素） */
  get width(): number {
    return this._ctx?.width ?? 0;
  }

  /** 画布高度（像素） */
  get height(): number {
    return this._ctx?.height ?? 0;
  }

  /** 设置每帧清除颜色 */
  setClearColor(r: number, g: number, b: number, a = 1): this {
    this._clearColor = [r, g, b, a];
    return this;
  }

  /** 设置每帧清除深度（不设则不 clear 深度） */
  setClearDepth(depth: number): this {
    this._clearDepth = depth;
    return this;
  }

  /** 设置深度附件（用于 3D 深度测试） */
  setDepthView(view: GPUTextureView | null): this {
    this._depthView = view;
    return this;
  }

  /**
   * 异步初始化引擎
   */
  async init(options: EngineOptions): Promise<this> {
    if (this._ctx) {
      this.destroy();
    }
    this._ctx = await WebGPUContext.create(options);

    const resize = () => this.resize();
    window.addEventListener("resize", resize);
    this._resizeHandler = resize;

    return this;
  }

  private _resizeHandler: (() => void) | null = null;

  /**
   * 调整画布与上下文尺寸
   */
  resize(options?: ResizeOptions): void {
    this._ctx?.resize(options);
  }

  /**
   * 设置渲染循环回调（每帧调用）
   */
  onFrame(callback: (engine: Engine) => void): this {
    this._onFrame = callback;
    return this;
  }

  /**
   * 启动渲染循环
   */
  run(): this {
    if (!this._ctx) throw new Error("Engine not initialized. Call engine.init() first.");
    this._running = true;
    const loop = () => {
      if (!this._running || !this._ctx) return;
      this._frameId = requestAnimationFrame(loop);
      this._tick();
    };
    loop();
    return this;
  }

  /**
   * 停止渲染循环
   */
  stop(): this {
    this._running = false;
    if (this._frameId != null) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
    return this;
  }

  /**
   * 手动渲染一帧（不启动循环时可用）
   */
  tick(): void {
    if (!this._ctx) return;
    this._tick();
  }

  private _tick(): void {
    const ctx = this._ctx!;
    ctx.resize();

    if (this._onFrame) {
      this._onFrame(this);
      return;
    }

    renderPass(
      ctx,
      () => {},
      {
        clearColor: this._clearColor,
        clearDepth: this._clearDepth ?? undefined,
        depthView: this._depthView ?? undefined,
      }
    );
  }

  /**
   * 在引擎上下文中执行一次自定义渲染（获得完整 CommandEncoder 与当前纹理 View，由调用方自行编码并提交）
   */
  render(callback: RenderCallback): void {
    if (!this._ctx) return;
    renderToContext(this._ctx, callback);
  }

  /**
   * 销毁引擎并释放资源
   */
  destroy(): void {
    this.stop();
    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
      this._resizeHandler = null;
    }
    this._ctx?.destroy();
    this._ctx = null;
    this._onFrame = null;
  }
}
