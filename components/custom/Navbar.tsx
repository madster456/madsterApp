import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold">
              Your Name
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="#about"
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="#projects"
                className="hover:text-primary transition-colors"
              >
                Projects
              </Link>
              <Link
                href="#contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Button>Resume</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
