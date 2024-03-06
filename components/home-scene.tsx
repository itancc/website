"use client";

import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  BoundingBoxGizmo,
  Color3,
  Effect,
  Engine,
  FreeCamera,
  HavokPlugin,
  ParticleHelper,
  PhysicsAggregate,
  PhysicsShapeType,
  PostProcess,
  Scene,
  SceneLoader,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { useTheme } from "next-themes";
import { RainFragmentShader } from "./rain.fragment";
import "@babylonjs/loaders";
import { Inspector } from "@babylonjs/inspector";
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
    // Inspector.Show(_scene.current, {});
    const havokInstance = await HavokPhysics();
    const hk = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

    // 创建一个相机并设置其位置
    const camera = new UniversalCamera("camera", new Vector3(0, 1, -10), scene);
    camera.setTarget(Vector3.Zero());
    // 修改相机的步进
    camera.speed = 0.1;
    // Attach the camera to the canvas
    camera.attachControl(container, true);
    camera.checkCollisions = true;

    // create environment light
    scene.createDefaultLight();
    scene.collisionsEnabled = true;
    // use particle system to create rain
    ParticleHelper.CreateAsync("rain", scene, true).then((set) => {
      set.systems[0].updateSpeed = 0.01;
      set.start();
      scene.registerBeforeRender(() => {
        for (const sys of set.systems) {
          (sys.emitter as Vector3).x = camera.position.x;
          (sys.emitter as Vector3).y = camera.position.y;
          (sys.emitter as Vector3).z = camera.position.z;
        }
      });
    });

    // load glb model to scene
    SceneLoader.AppendAsync("/models/", "house.glb", scene).then((scene) => {
      const house = scene.meshes[0];
      // 相机看向模型
      camera.setTarget(house.getAbsolutePosition());
      house.checkCollisions = true;

      // new PhysicsAggregate(house, PhysicsShapeType.BOX, { mass: 0 }, scene);
    });

    Effect.ShadersStore["rainFragmentShader"] = RainFragmentShader;

    const postProcess = new PostProcess(
      "rain post process",
      "rain",
      ["screenSize", "sceneSampler", "u_time"],
      null,
      1.0,
      camera
    );
    postProcess.onApply = function (effect) {
      effect.setFloat2("screenSize", postProcess.width, postProcess.height);
      effect.setFloat("u_time", performance.now() / 1000);
      effect.setTextureFromPostProcess("sceneSampler", postProcess);
    };

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

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
