import { Input } from "@heroui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import PhotoCard from "./PhotoCard";

export default function MenuList() {
  return (
    <div className="p-6 w-[400px] h-full overflow-auto">
      <Input
        variant="bordered"
        label="Search"
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focus=true]:bg-default-200/50",
            "dark:group-data-[focus=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        placeholder="Type to search..."
        startContent={
          <MagnifyingGlassIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />

      {/* Menu */}
      <div className="mt-3 flex flex-col gap-6 ">
        {[...Array(10)].map((_, i) => (
          <PhotoCard key={i}></PhotoCard>
        ))}
      </div>
    </div>
  );
}
