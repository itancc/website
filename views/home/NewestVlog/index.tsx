import Piece from "@/components/Piece";
import { Button } from "@heroui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import VideoPlay from "./VideoPlay";
import SectorLayout from "./SectorLayout";
export default function NewestVlog() {
  return (
    <Piece className="flex flex-col justify-center items-center gap-10">
      <h2 className="text-4xl">The Latest VLOG</h2>

      <SectorLayout>
        <div className="origin-bottom-right -rotate-12">
          <VideoPlay radndom={3}></VideoPlay>
        </div>
        <div>
          <VideoPlay radndom={4}></VideoPlay>
        </div>
        <div className="origin-bottom-left rotate-12">
          <VideoPlay radndom={5}></VideoPlay>
        </div>
      </SectorLayout>

      <Button variant="bordered" endContent={<ArrowRightIcon></ArrowRightIcon>}>
        SEE MORE
      </Button>
    </Piece>
  );
}
