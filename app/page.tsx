import Scene from "@/components/scene";
import { Welcome } from "@/components/view/Welcome";

export default function Home() {
  return (
    <div className="relative w-full h-full">
      <Welcome></Welcome>
      <Scene></Scene>
    </div>
  );
}
