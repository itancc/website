"use client";

import { useEffect, useRef } from "react";
import {
  Engine,
  HavokPlugin,
  Scene,
  SceneLoader,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { useTheme } from "next-themes";
import { Inspector } from "@babylonjs/inspector";
import "@babylonjs/loaders";
import { useAsyncEffect } from "@/hooks/useAsyncEffect";

export default function HomeScene() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const _scene = useRef<Scene | null>(null);
  useAsyncEffect(async () => {
    const container = sceneRef.current;
    if (!container) return;

    const engine = new Engine(container, true);
    const scene = new Scene(engine);
    _scene.current = scene;
    const havokInstance = await HavokPhysics();
    const hk = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

    // 创建一个相机并设置其位置
    const camera = new UniversalCamera(
      "camera",
      new Vector3(8.74, 1.35, -6.36),
      scene
    );
    camera.setTarget(new Vector3(8.32, 0.97, 4.57));
    // 修改相机的步进
    camera.speed = 0.1;

    camera.attachControl(container, true);
    // create environment light
    scene.createDefaultLight();
    scene.collisionsEnabled = true;

    // load glb model to scene
    SceneLoader.AppendAsync("/models/", "house.glb", scene).then((scene) => {
      const house = scene.meshes[0];
      // 相机看向模型
      house.checkCollisions = true;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });
    // Inspector.Show(scene, {});
    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (!_scene.current) return;
    if (theme === "dark") {
      _scene.current.clearColor.set(0, 0, 0, 1.0);
    } else {
      _scene.current.clearColor.set(0.7, 0.7, 0.7, 1.0);
    }
  }, [theme]);

  return (
    <div className="absolute left-0 top-0 bottom-0 right-0">
      <canvas className="w-full h-full" ref={sceneRef}></canvas>
    </div>
  );
}
