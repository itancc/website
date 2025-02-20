import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function AboutCard({ name = "Zoey Doe" }: { name: string }) {
  return (
    <Card
      className="max-w-[340px]"
      classNames={{
        header: "p-4",
        footer: "p-4",
      }}
    >
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://nextui.org/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{name}
            </h5>
          </div>
        </div>
        <Button color="primary" radius="full" size="sm" variant="solid">
          Follow
        </Button>
      </CardHeader>
      <CardBody className="px-6 py-2  text-small text-default-400">
        <p>
          Frontend developer and UI/UX enthusiast. Join me on this coding
          adventure!
        </p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
        <div className="flex flex-col gap-4">
          <h3 className="text-default-700 py-2">Contact</h3>
          {new Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex flex-row items-center gap-4">
              <GitHubLogoIcon width={24} height={24}></GitHubLogoIcon>
              <a
                href="https://www.github.com/itancc"
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-500"
              >
                github.com/itancc
              </a>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
}
