import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Slider } from "@heroui/slider";
import Image from "next/image";
import { PauseIcon, ResumeIcon } from "@radix-ui/react-icons";

export default function VideoPlay({ radndom }: { radndom: number }) {
  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-300/60 max-w-[610px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-rows-11 gap-0.5  items-center justify-center">
          <div className="relative row-span-6 ">
            <Image
              alt="Album cover"
              className="object-cover"
              height={200}
              width={260}
              src={`https://picsum.photos/300/200.webp?random=3${radndom}`}
            />
          </div>

          <div className="flex flex-col row-span-5 ">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="font-semibold text-foreground/90">Daily Mix</h3>
                <p className="text-small text-foreground/80">12 Tracks</p>
              </div>
            </div>

            <div className="flex flex-col mt-3 gap-1">
              <Slider
                aria-label="Music progress"
                classNames={{
                  track: "bg-default-500/30",
                  thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                }}
                color="foreground"
                defaultValue={33}
                size="sm"
              />
              <div className="flex justify-between">
                <p className="text-small">1:23</p>
                <p className="text-small text-foreground/50">4:32</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-2">
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <ResumeIcon width={20} height={20} />
              </Button>

              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <PauseIcon width={20} height={20} />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
