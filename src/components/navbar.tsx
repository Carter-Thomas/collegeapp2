import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Home, Search } from "react-feather";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="sticky top-0 z-400 w-full bg-background border-b border-border p-5 flex items-center justify-between px-4">
      <Link href="/" className="flex items-center my-auto">
        <img src={"/cclogo1.png"} alt="Logo" className="h-10 w-30 mr-3 object-fill" />
      </Link>
      <Link
        href="/search"
        className="text-2xl sticky font-semibold text-primary hover:text-gray-400"
      >
        View Colleges
      </Link>
      {/* You can add other navigation items here if needed, 
             they will appear next to the logo */}
      {/* <Link href="/about" className="ml-4">About</Link>
        <Link href="/contact" className="ml-4">Contact</Link> */}
    </div>
  );
}
