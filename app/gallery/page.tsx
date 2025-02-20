import Piece from "@/components/Piece";
import { Button } from "@heroui/button";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";

export default function GallyeryPage() {
  const imageList = new Array(20).fill(0).map((_, index) => {
    return {
      url: `https://picsum.photos/400/300.webp?random=${10 + index}`,
      width: 400 + Math.floor((Math.random() + 1) * 600),
      height: 200 + Math.floor((Math.random() + 1) * 100),
      description: `Image ${index + 1}`,
    };
  });
  return (
    <Piece className="flex justify-center py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl justify-center align-middle">
        {imageList.map((image) => (
          <Card isFooterBlurred key={image.url} className="overflow-visible">
            <CardHeader className="absolute z-10 top-1 flex-col  items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                Your day your way
              </p>
            </CardHeader>
            <Image
              src={image.url}
              width={image.width}
              height={image.height}
              alt={image.url}
              className="z-0 w-full  max-h-80"
            />
            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-grow gap-2 items-center">
                <div className="flex flex-col">
                  <p className="text-tiny text-white/60">Breathing App</p>
                  <p className="text-tiny text-white/60">
                    Get a good night is sleep.
                  </p>
                </div>
              </div>
              <Button radius="full" size="sm">
                查看
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Piece>
  );
}
