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
    <div className="sticky top-0 z-400 w-full bg-background border-b border-border flex items-center pt-10 justify-between h-16 px-4">
      <Link href="/" className="flex items-center">
        <img src={"/cclogo1.png"} alt="Logo" className="h-20 w-50 pb-2 mr-3" />
      </Link>
      <Link
        href="/search"
        className="text-2xl sticky font-bold text-primary hover:text-gray-400"
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
