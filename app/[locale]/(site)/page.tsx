import {Hero} from '@/components/sections/hero';
import {Solutions} from '@/components/sections/solutions';
import {About} from '@/components/sections/about';
import {Projects} from '@/components/sections/projects';
import {Process} from '@/components/sections/process';
import {Skills} from '@/components/sections/skills';
import {Contact} from '@/components/sections/contact';
import {Footer} from '@/components/sections/footer';

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Solutions />
        <Projects />
        <Process />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
