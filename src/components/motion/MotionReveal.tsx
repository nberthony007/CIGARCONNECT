"use client";

import React from "react";

interface MotionRevealProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  delay?: number;
}

export const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`transition-all duration-500 ease-out ${className}`}>
      {children}
    </div>
  );
};
