import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/madster456"
            className="text-muted-foreground hover:text-primary"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/madison-kennedy-b9285b219/"
            className="text-muted-foreground hover:text-primary"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Madster. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
