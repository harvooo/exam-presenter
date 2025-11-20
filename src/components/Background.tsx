'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function Background() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Subtle movement for the background blobs
    const x1 = useTransform(x, [0, 1], [-20, 20]);
    const y1 = useTransform(y, [0, 1], [-20, 20]);

    const x2 = useTransform(x, [0, 1], [20, -20]);
    const y2 = useTransform(y, [0, 1], [20, -20]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position from 0 to 1
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
            {/* Dark base */}
            <div className="absolute inset-0 bg-neutral-950" />

            {/* Animated Gradient Blobs */}
            <motion.div
                style={{ x: x1, y: y1 }}
                className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]"
            />
            <motion.div
                style={{ x: x2, y: y2 }}
                className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px]"
            />
            <motion.div
                style={{ x: x1, y: y2 }}
                className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"
            />

            {/* Grid overlay for texture (optional, adds a 'developer' feel) */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>
    );
}
