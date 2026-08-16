/// <reference types="vite/client" />

declare module '~icons/*' {
  const component: any
  export default component
}

// Global icon typings
/// <reference types="vite/client" />

declare module '~icons/*' {
  const component: any
  export default component
}

// Augment internal bootstrap-vue-next color/button types so custom "flat-*" variants are accepted
declare module 'bootstrap-vue-next/dist/src/types/ColorTypes' {
  interface BaseButtonVariant {
    flat: unknown
    'flat-primary': unknown
    'flat-secondary': unknown
    'flat-success': unknown
    'flat-danger': unknown
    'flat-warning': unknown
    'flat-info': unknown
    'flat-light': unknown
    'flat-dark': unknown
    'flat-outline-primary': unknown
    'flat-outline-secondary': unknown
    'flat-outline-success': unknown
    'flat-outline-danger': unknown
    'flat-outline-warning': unknown
    'flat-outline-info': unknown
    'flat-outline-light': unknown
    'flat-outline-dark': unknown
    // allow arbitrary keys so third-party variants like 'flat-*' are accepted
    [key: string]: unknown
  }
}

// Fallback module declarations for runtime imports used in SFCs
declare module 'bootstrap-vue-next' {
  export const BButton: any
  export const BModal: any
  export const BAccordion: any
  export const BOffcanvas: any
  export const BCollapse: any
  export const BNav: any
  export const BNavItem: any
  export const BBadge: any
  export const BCard: any
  export const BCardText: any
  export const BPopover: any
  export const BDropdown: any
  export const BDropdownItem: any
  export const BSpinner: any
  export const useToast: any
  export const useTooltip: any
  export const usePopover: any
  export type ButtonVariant = string
}

// Register bootstrap components as global Vue components with permissive any props
declare module 'vue' {
  export interface GlobalComponents {
    BButton: any
    BModal: any
    BPopover: any
    BDropdown: any
    BDropdownItem: any
    BBadge: any
    BCard: any
    BCardText: any
    BOffcanvas: any
    BNav: any
    BNavItem: any
    BSpinner: any
    BCollapse: any
    BAccordion: any
  }
}

export {}
