"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Effect,
  Engine,
  MeshBuilder,
  ParticleHelper,
  PostProcess,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { useTheme } from "next-themes";
import { RainFragmentShader } from "./rain.fragment";

export default function HomeScene() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const _scene = useRef<Scene | null>(null);
  useEffect(() => {
    const container = sceneRef.current;
    if (!container) return;

    const engine = new Engine(container, true);
    const scene = new Scene(engine);
    _scene.current = scene;

    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 3,
      8,
      Vector3.Zero(),
      scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(container, true);
    // create environment light
    scene.createDefaultLight();

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
    // create a box
    MeshBuilder.CreateBox("box", { size: 1 }, scene);

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
