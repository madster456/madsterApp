import ProjectGrid from "./ProjectGrid";

export default function Hero() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
          <span className="block">Hi, I&apos;m Madster.</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl">
          I create weird shit.
        </p>
      </div>
      <ProjectGrid />
    </div>
  );
}
