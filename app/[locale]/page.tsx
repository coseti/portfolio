import {Hero} from '@/components/sections/hero';
import {About} from '@/components/sections/about';
import {Projects} from '@/components/sections/projects';
import {Skills} from '@/components/sections/skills';
import {Contact} from '@/components/sections/contact';
import {Footer} from '@/components/sections/footer';

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
