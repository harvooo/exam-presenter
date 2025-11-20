'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GradientCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function GradientCard({ children, className = '', onClick }: GradientCardProps) {
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
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group rounded-xl transition-colors duration-300 backdrop-blur-sm ${className}`}
        >
            {/* Static Border Layer (fades out on hover) */}
            <motion.div
                className="absolute inset-0 rounded-xl -z-10 bg-white/20"
                initial={{ margin: -1, opacity: 1 }}
                animate={{
                    margin: -1,
                    opacity: isHovered ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Gradient Border Layer (fades in and expands on hover) */}
            <motion.div
                className="absolute inset-0 rounded-xl -z-10"
                style={{ background: gradient }}
                initial={{ margin: -1, opacity: 0 }}
                animate={{
                    margin: isHovered ? -3 : -1,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Inner background */}
            <div className="absolute inset-0 rounded-xl bg-black/90 -z-10" />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
