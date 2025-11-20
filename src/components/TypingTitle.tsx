'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypingTitleProps {
    text: string;
    className?: string;
}

export default function TypingTitle({ text, className = '' }: TypingTitleProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) => text.slice(0, latest));
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        const controls = animate(count, text.length, {
            type: 'tween',
            duration: 1.5,
            ease: 'linear',
            delay: 0.5,
            onComplete: () => {
                // Start blinking cursor after typing is done
            }
        });
        return controls.stop;
    }, [count, text.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCursorVisible((v) => !v);
        }, 530);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className={className}>
            <motion.span>{displayText}</motion.span>
            <span
                className={`inline-block w-[2px] h-[1em] bg-white ml-1 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
            />
        </span>
    );
}
