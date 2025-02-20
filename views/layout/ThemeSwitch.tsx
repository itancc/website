"use client";

import { Tab, Tabs } from "@heroui/tabs";
import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Key, useCallback } from "react";

/**
 * 检测系统是否开启动画减弱功能
 */
const isPrefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const onAction = (key: Key) => {
    // 获取当前选中的按钮
    const selectElement = document.querySelector(
      "div[aria-label='theme switch'] > button[tabindex='0']"
    );
    if (
      !selectElement ||
      !document.startViewTransition ||
      isPrefersReducedMotion()
    ) {
      return setTheme(key as string);
    }

    const transition = document.startViewTransition(() => {
      setTheme(key as string);
    });
    const x = selectElement.getBoundingClientRect().x;
    const y = selectElement.getBoundingClientRect().y;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );
    void transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <Tabs
      aria-label="theme switch"
      variant="bordered"
      selectedKey={theme}
      onSelectionChange={onAction}
    >
      <Tab
        key="system"
        aria-selected={true}
        data-selected={true}
        title={<DesktopIcon></DesktopIcon>}
      ></Tab>
      <Tab
        key="light"
        aria-selected={true}
        data-selected={true}
        title={<SunIcon></SunIcon>}
      ></Tab>
      <Tab
        key="dark"
        aria-selected={true}
        data-selected={true}
        title={<MoonIcon></MoonIcon>}
      ></Tab>
    </Tabs>
  );
}
