import { Metadata } from "next";

export const HomeMetadata: Metadata = {
  title: {
    default: "我们的世界",
    template: "%s | 我们的世界",
  },
  description: "这是我们的世界！",
  icons: {
    icon: "/logo.svg",
  },
};
