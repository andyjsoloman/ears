//Breakpoint values in pixels:
const BREAKPOINTS = {
  mobileMax: 550,
  tabletMax: 1100,
  laptopMax: 1500,
};

// Converted to rems:
export const QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobileMax / 16}rem)`,
  tablet: `(max-width: ${BREAKPOINTS.tabletMax / 16}rem)`,
  laptop: `(max-width: ${BREAKPOINTS.laptopMax / 16}rem)`,
};
