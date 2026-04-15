import React from 'react';

const RentoraLogo = ({ size = 40, showText = true }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Logo SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background Circle */}
        <circle cx="24" cy="24" r="22" fill="url(#gradient1)" opacity="0.1" />

        {/* Main Geometric Shape - Stylized "R" */}
        <g>
          {/* Vertical Line */}
          <rect x="12" y="8" width="4" height="32" fill="url(#gradient1)" rx="2" />

          {/* Top Curve */}
          <path
            d="M 16 10 Q 24 10 24 18 Q 24 24 16 24"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Diagonal Leg */}
          <path
            d="M 24 24 L 32 40"
            stroke="url(#gradient1)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Circular Element - representing Loop/Connection */}
        <circle
          cx="32"
          cy="16"
          r="4"
          fill="url(#gradient2)"
          opacity="0.8"
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text Logo */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rentora
          </span>
          <span className="text-xs text-gray-500 font-medium">Smart Rental</span>
        </div>
      )}
    </div>
  );
};

export default RentoraLogo;
