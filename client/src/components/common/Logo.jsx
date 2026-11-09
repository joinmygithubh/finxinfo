import React from 'react';
import BrandLogo from './BrandLogo';

/**
 * Legacy Logo alias - forwards to BrandLogo with FinXinfo branding.
 */
export const Logo = (props) => {
  return <BrandLogo {...props} />;
};

export default Logo;
