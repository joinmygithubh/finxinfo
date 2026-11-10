import React from 'react';
import { Link } from 'react-router-dom';
import finxLogo from '../../assets/images/finx-logo.png';

/**
 * Reusable BrandLogo Component
 *
 * Fully clickable FinXinfo brand logo + name lockup:
 * - Navigates to homepage ('/') using React Router DOM Link without page reload
 * - Flexbox alignment: display: flex; align-items: center; cursor: pointer; text-decoration: none
 * - Accessible keyboard focus and hover states
 * - Responsive logo heights: Desktop 55px, Tablet 48px, Mobile 38–42px
 * - Responsive typography: "Fin" (#0A2342) + "X" (#C62835) + "info" (#0A2342)
 * - 10–12px spacing between logo and text
 */
export const BrandLogo = ({
  variant = 'dark', // 'dark' (on light backgrounds) | 'light' (on dark navy background)
  showText = false,
  className = '',
  imgClassName = '',
  textClassName = '',
  to = '/',
  onClick,
}) => {
  const isDarkBackground = variant === 'light';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    // If user is already on homepage, smoothly scroll to the top
    if (window.location.pathname === '/' && !to.includes('#')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`brand-logo flex items-center gap-[10px] sm:gap-[12px] cursor-pointer no-underline select-none transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-americanRed focus-visible:ring-offset-2 rounded-lg ${className}`}
      aria-label="FinXinfo Homepage"
    >
      {/* Logo Image */}
      <div
        className={`flex-shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] ${
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

      {/* Brand Name Text: Fin (#0A2342) + X (#C62835) + info (#0A2342) */}
      {showText && (
        <span
          className={`font-heading font-extrabold tracking-tight leading-none text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] ${textClassName}`}
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
