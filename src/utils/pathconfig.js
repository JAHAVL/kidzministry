/**
 * pathconfig.js
 * 
 * This file contains all path aliases for the KidzTeamSOPApp.
 * IMPORTANT: All file paths in the app should be referenced from here.
 * DO NOT hardcode paths in components or other files.
 */

const BASE_PATH = '/src';

// Main directory paths
export const PATHS = {
  ROOT: '/',
  SRC: BASE_PATH,
  ASSETS: `${BASE_PATH}/assets`,
  IMAGES: `${BASE_PATH}/assets/images`,
  COMPONENTS: `${BASE_PATH}/components`,
  PAGES: `${BASE_PATH}/pages`,
  HOOKS: `${BASE_PATH}/hooks`,
  UTILS: `${BASE_PATH}/utils`,
  STYLES: `${BASE_PATH}/styles`,
  CONTEXT: `${BASE_PATH}/context`,
};

// Component paths
export const COMPONENT_PATHS = {
  HEADER: `${PATHS.COMPONENTS}/Header`,
  SEARCH: `${PATHS.COMPONENTS}/Search`,
  POLICY_CARD: `${PATHS.COMPONENTS}/PolicyCard`,
  THEME_TOGGLE: `${PATHS.COMPONENTS}/ThemeToggle`,
  MENU: `${PATHS.COMPONENTS}/Menu`,
};

// Page paths
export const PAGE_PATHS = {
  HOME: `${PATHS.PAGES}/Home`,
  POLICY_DETAIL: `${PATHS.PAGES}/PolicyDetail`,
};

// Utils paths
export const UTIL_PATHS = {
  PATHCONFIG: `${PATHS.UTILS}/pathconfig`,
  THEME: `${PATHS.UTILS}/theme`,
  SEARCH: `${PATHS.UTILS}/search`,
};

// Export all paths
export default {
  PATHS,
  COMPONENT_PATHS,
  PAGE_PATHS,
  UTIL_PATHS,
};
