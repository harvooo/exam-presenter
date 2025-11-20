'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

interface GradientTextProps {
    text: string;
    className?: string;
}

export default function GradientText({ text, className = '' }: GradientTextProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            mouseX.set(e.clientX / innerWidth);
            mouseY.set(e.clientY / innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const background = useMotionTemplate`linear-gradient(
    to bottom right, 
    hsl(${useMotionValue(0).get() + mouseX.get() * 60}, 80%, 50%),
    hsl(${useMotionValue(180).get() + mouseY.get() * 60}, 80%, 50%)
  )`;

    // Dynamic gradient colors based on mouse position
    // We'll use a simpler approach for the template to ensure it updates
    // Mapping 0-1 to hue rotation
    const gradient = useMotionTemplate`linear-gradient(
    ${mouseX.get() * 360}deg, 
    #ff0080, 
    #7928ca, 
    #ff0080
  )`;

    return (
        <div className={`relative inline-block ${className}`}>
            {/* The Gradient Layer (Background) */}
            <motion.span
                className="absolute inset-0 select-none"
                style={{
                    backgroundImage: useMotionTemplate`linear-gradient(
            ${useMotionValue(0).get() + mouseX.get() * 100}deg, 
            #3b82f6, 
            #8b5cf6, 
            #ec4899
          )`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    filter: 'blur(4px)',
                    opacity: 0.7
                }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* The Main Text with Gradient Outline Effect */}
            {/* 
         To achieve a true "outline" that is a gradient, we can use -webkit-text-stroke 
         with a transparent color, but the fill needs to be the background color (black).
         However, text-stroke puts the stroke *centered* on the edge.
      */}
            <motion.span
                className="relative z-10"
                style={{
                    backgroundImage: useMotionTemplate`linear-gradient(
            ${useMotionValue(45).get() + mouseX.get() * 50 + mouseY.get() * 50}deg, 
            #60a5fa, 
            #c084fc, 
            #f472b6
          )`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    // This makes it an outline if we had a solid inner, but here we just make the text itself the gradient
                    // as it looks cleaner and "modern". 
                    // If we strictly want outline:
                    // WebkitTextStroke: '1px transparent', 
                }}
            >
                {text}
            </motion.span>
        </div>
    );
}
