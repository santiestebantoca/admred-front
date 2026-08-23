import pluginVue from 'eslint-plugin-vue' //[cite: 1]
import tsPlugin from '@typescript-eslint/eslint-plugin' //[cite: 1]
import tsParser from '@typescript-eslint/parser' //[cite: 1]
import vueParser from 'vue-eslint-parser' // <-- 1. Añadimos este import
import { fileURLToPath } from 'node:url' //[cite: 1]

export default [
  {
    ignores: ['dist/**', 'node_modules/**'], //[cite: 1]
  },
  ...pluginVue.configs['flat/base'], //[cite: 1]

  // 2. Bloque EXCLUSIVO para archivos .vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser, // El parser principal DEBE ser el que entiende la estructura de Vue
      parserOptions: {
        parser: tsParser, // Delegamos a TS SOLAMENTE el análisis del interior de la etiqueta <script>
        ecmaVersion: 'latest', //[cite: 1]
        sourceType: 'module', //[cite: 1]
        projectService: true, //[cite: 1]
        tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)), //[cite: 1]
        extraFileExtensions: ['.vue'], //[cite: 1]
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, //[cite: 1]
    },
    rules: {
      // Prohibir styles inline estáticos. Los :style dinámicos con custom[cite: 1]
      // properties (patrón rootStyle de BButton, Drawer, etc.) se permiten.[cite: 1]
      // 'vue/no-inline-styles': ['error', { allowDynamicStyling: true }],[cite: 1]
    },
  },

  // 3. Bloque EXCLUSIVO para archivos .ts puros
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser, // Aquí sí, el parser principal es TypeScript
      parserOptions: {
        ecmaVersion: 'latest', //[cite: 1]
        sourceType: 'module', //[cite: 1]
        projectService: true, //[cite: 1]
        tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)), //[cite: 1]
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, //[cite: 1]
    },
  },
]