import React from 'react';
import { Link } from 'react-router-dom';
import finxLogo from '../../assets/images/finx-logo.png';

/**
 * Reusable BrandLogo Component
 *
 * Official FinXinfo brand logo with optional brand text:
 * - Desktop logo: 55px height (lg:h-[55px])
 * - Tablet logo: 48px height (md:h-[48px])
 * - Mobile logo: 38–42px height (h-[38px] sm:h-[42px])
 * - "Fin" in Navy Blue (#0A2342)
 * - "X" in American Red (#C62835)
 * - "info" in Navy Blue (#0A2342)
 * - 10–12px spacing between logo and text (gap-[10px] sm:gap-[12px])
 * - Vertically centered flexbox alignment (align-items: center)
 * - Entire combination is clickable and navigates to homepage
 */
export const BrandLogo = ({
  variant = 'dark', // 'dark' (on light backgrounds) | 'light' (on dark navy background)
  showText = false,
  className = '',
  imgClassName = '',
  textClassName = '',
  to = '/',
}) => {
  const isDarkBackground = variant === 'light';

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-[10px] sm:gap-[12px] group transition-opacity duration-200 hover:opacity-95 ${className}`}
      aria-label="FinXinfo Homepage"
    >
      {/* Logo Graphic */}
      <div
        className={`flex-shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02] active:scale-[0.98] ${
          isDarkBackground
            ? 'bg-white rounded-full p-1 shadow-md border border-white/20'
            : ''
        }`}
      >
        <img
          src={finxLogo}
          alt="FinXinfo Logo"
          className={`h-[38px] sm:h-[42px] md:h-[48px] lg:h-[55px] w-auto max-w-full object-contain ${imgClassName}`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Brand Text: Fin (Navy) + X (American Red) + info (Navy) */}
      {showText && (
        <span
          className={`font-heading font-extrabold tracking-tight leading-none text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] select-none transition-transform duration-200 group-hover:translate-x-0.5 ${textClassName}`}
        >
          <span className={isDarkBackground ? 'text-white' : 'text-[#0A2342]'}>Fin</span>
          <span className="text-[#C62835]">X</span>
          <span className={isDarkBackground ? 'text-white' : 'text-[#0A2342]'}>info</span>
        </span>
      )}
    </Link>
  );
};

export default BrandLogo;
