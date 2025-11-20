import Background from '@/components/Background';
import FadeIn from '@/components/FadeIn';
import GradientText from '@/components/GradientText';
import TypingTitle from '@/components/TypingTitle';
import GradientButton from '@/components/GradientButton';
import Link from 'next/link';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <Background />

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl">

        {/* Main Title */}
        <div className="text-5xl md:text-7xl font-bold tracking-tighter mb-2">
          <TypingTitle text="harvo.cloud" />
        </div>

        {/* Description */}
        <FadeIn delay={1.8} className="space-y-4">
          <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
            <GradientText text="CompSci Student" /> at Ulster University with a keen interest in cybersec, AI, networking and everything IT.
          </p>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Belfast, UK
          </p>
        </FadeIn>

        {/* Buttons */}
        <FadeIn delay={2.2} className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/tools">
            <GradientButton>Tools</GradientButton>
          </Link>
          {['CV', 'Projects'].map((item) => (
            <GradientButton key={item}>
              {item}
            </GradientButton>
          ))}
        </FadeIn>

        {/* Links */}
        <FadeIn delay={2.6} className="flex gap-8 pt-8 text-2xl text-gray-400">
          <Link href="mailto:hello@harvo.cloud" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
            <FaEnvelope />
          </Link>
          <Link href="https://github.com/harvooo" target="_blank" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
            <FaGithub />
          </Link>
          <Link href="https://linkedin.com/in/harvey-vance" target="_blank" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
            <FaLinkedin />
          </Link>
        </FadeIn>
      </div>
    </main>
  );
}
