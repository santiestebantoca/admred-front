/// <reference types="vite/client" />

declare module '~icons/*' {
  const component: import('vue').DefineComponent
  export default component
}

// Acepta las clases CSS propias que el proyecto pasa por la prop `variant`
// (por ejemplo `flat`, `link link-dark` o `flat wh-34`) además de las de BVN.
declare module 'bootstrap-vue-next/types/ColorTypes' {
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
    [key: string]: unknown
  }
}

export {}
