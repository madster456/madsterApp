import Navbar from "@/components/custom/Navbar";
import Hero from "@/components/custom/Hero";
import Footer from "@/components/custom/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
