"use client";
import { Tabs, Tab } from "@nextui-org/tabs";

export function Welcome() {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-origin-300/40 flex flex-col items-center justify-center z-10">
      <h1 className="text-5xl">欢迎来到我们的世界</h1>
      <Tabs defaultSelectedKey="and" className="mt-10" size="lg">
        <Tab key="itancc" title="Mr.谭"></Tab>
        <Tab key="and" title="共有"></Tab>
        <Tab key="yao" title="Mrs.瑶"></Tab>
      </Tabs>
    </div>
  );
}
