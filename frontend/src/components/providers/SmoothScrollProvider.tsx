'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis buttery-smooth momentum scroll
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // 2. Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Drive GSAP ticker with Lenis requestAnimationFrame
    const updateGsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGsapTicker);
    gsap.ticker.lagSmoothing(0); // Prevent lag jumps

    // 4. Staggered reveal animation on initial load for .neo-card elements
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.neo-card, .neo-card-yellow, .neo-card-mint, .neo-card-navy',
        {
          opacity: 0,
          y: 24,
          scale: 0.985,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.1,
          clearProps: 'transform,opacity',
        }
      );
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateGsapTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
};
