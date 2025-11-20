'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GradientButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function GradientButton({ children, onClick, className = '' }: GradientButtonProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            mouseX.set(e.clientX / innerWidth);
            mouseY.set(e.clientY / innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Dynamic gradient for the border
    const gradient = useMotionTemplate`linear-gradient(
    ${mouseX.get() * 360}deg, 
    #ff0080, 
    #7928ca, 
    #ff0080
  )`;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group px-6 py-2 rounded-full transition-colors duration-300 backdrop-blur-sm ${className}`}
        >
            {/* Static Border Layer (fades out on hover) */}
            <motion.div
                className="absolute inset-0 rounded-full -z-10 bg-white/20"
                initial={{ margin: -1, opacity: 1 }}
                animate={{
                    margin: -1,
                    opacity: isHovered ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Gradient Border Layer (fades in and expands on hover) */}
            <motion.div
                className="absolute inset-0 rounded-full -z-10"
                style={{ background: gradient }}
                initial={{ margin: -1, opacity: 0 }}
                animate={{
                    margin: isHovered ? -3 : -1,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Inner background to hide the center of the gradient/border */}
            <div className="absolute inset-0 rounded-full bg-black/90 -z-10" />

            <span className="relative z-10 text-sm tracking-wide text-white group-hover:text-white transition-colors">
                {children}
            </span>
        </button>
    );
}
