import appSetJson from './app-set.json';
export const appSet = appSetJson;
// Convierte cada icono del set al formato SVG que unplugin-icons espera en customCollections.
// viewBox sale de width/height del icono (o del set), y unplugin le aplica el escalado 1em/1.2em como al resto.
export const appIcons = Object.fromEntries(Object.entries(appSet.icons).map(([name, icon]) => {
    const width = icon.width ?? appSet.width ?? 16;
    const height = icon.height ?? appSet.height ?? 16;
    return [name, `<svg viewBox="0 0 ${width} ${height}">${icon.body}</svg>`];
}));
