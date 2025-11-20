import Background from '@/components/Background';
import FadeIn from '@/components/FadeIn';
import GradientCard from '@/components/GradientCard';
import GradientText from '@/components/GradientText';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function Tools() {
    return (
        <main className="relative min-h-screen flex flex-col items-center p-8 font-sans">
            <Background />

            {/* Header / Back Button */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-12 z-10">
                <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <h1 className="text-3xl font-bold tracking-tighter">
                    <GradientText text="Tools" />
                </h1>
                <div className="w-24" /> {/* Spacer for centering */}
            </div>

            {/* Tools Grid */}
            <FadeIn className="w-full max-w-4xl space-y-8 z-10">

                {/* ExamClockPlus Card */}
                <GradientCard className="p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Image Placeholder */}
                        <div className="w-full md:w-1/3 aspect-video bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-600 border border-white/10">
                            <span>Image Placeholder</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-left space-y-4">
                            <Link href="https://www.ecp.harvo.cloud" target="_blank" className="no-underline hover:no-underline inline-block">
                                <h2 className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                                    ExamClockPlus
                                </h2>
                            </Link>
                            <p className="text-gray-300 leading-relaxed">
                                A customisable presenter for invigilated exams, best used GCSE's/BTECs/AQA and more.
                            </p>
                        </div>
                    </div>
                </GradientCard>

                {/* Filler Card */}
                <GradientCard className="p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Image Placeholder */}
                        <div className="w-full md:w-1/3 aspect-video bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-600 border border-white/10">
                            <span>Image Placeholder</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-left space-y-4">
                            <h2 className="text-2xl font-bold text-white">Future Tool</h2>
                            <p className="text-gray-300 leading-relaxed">
                                More tools coming soon. Watch this space for updates on new projects and utilities.
                            </p>
                        </div>
                    </div>
                </GradientCard>

            </FadeIn>
        </main>
    );
}
