import Link from "next/link";
import Image from "next/image";

interface Project {
  title: string;
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "Every IPv6",
    image: "/projects/everyipv6.png",
    link: "/everyip",
  },
];

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto px-4">
      {projects.map((project) => (
        <Link
          key={project.title}
          href={project.link}
          className="relative aspect-square overflow-hidden rounded-xl group"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-xl font-bold">{project.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
