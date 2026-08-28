export default function useExportCSV() {

  /**
   * Descarga el contenido CSV generando un Blob y forzando la descarga nativa.
   * @param contenidoCSV - Texto CSV completo (cabeceras + filas).
   * @param filename - Nombre del archivo descargado.
   */
  const descargarCSV = (contenidoCSV: string, filename: string): void => {
    // BOM UTF-8: sin él Excel interpreta el archivo como ANSI y rompe las tildes.
    const contenidoConBOM = `\uFEFF${contenidoCSV}`;
    const blob = new Blob([contenidoConBOM], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.setAttribute('href', url);
    enlace.setAttribute('download', filename);
    enlace.style.visibility = 'hidden';

    document.body.appendChild(enlace);
    enlace.click();

    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  };

  /**
   * Escapa un valor para que sea seguro en una celda CSV:
   * envuelve en comillas dobles si contiene comas, comillas o saltos de línea.
   * @param valor - Valor crudo de la celda.
   * @returns Texto listo para insertar en el CSV.
   */
  const escaparCelda = (valor: string): string => {
    if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
      return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
  };

  /**
   * Exporta a CSV una lista de objetos (Record<string, any>).
   *
   * OBSERVACIÓN DE USO: esta función estaba pensada para datos que llegan como
   * lista de objetos con propiedades nombradas (ej. `{ codigo, objetivo, ... }`).
   * Actualmente las solicitudes se manejan como listas de listas fijas (tuplas),
   * por lo que para ese formato debe usarse `exportCSVTuplas`. Esta función queda
   * disponible por si en el futuro se vuelve a trabajar con objetos.
   *
   * @param fields - Cabeceras separadas por comas. Cada cabecera puede incluir
   *                 un alias con "as", ej. "codigo as Codigo". Si se pasa '*'
   *                 o se omite, se usan las claves del primer objeto.
   * @param data - Lista de objetos a exportar.
   * @param filename - Nombre del archivo descargado (default 'admred.csv').
   */
  const exportCSV = <T extends Record<string, any>>(fields: string, data: T[], filename = 'admred.csv'): void => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    let cabeceras: string[] = [];

    if (!fields || fields.trim() === '*') {
      cabeceras = Object.keys(data[0]);
    } else {
      cabeceras = fields.split(',').map(campo => campo.trim());
    }

    const filas = data.map((fila) => {
      return cabeceras.map((cabecera) => {
        const valorOriginal = fila[cabecera as keyof T];
        let valorTexto = valorOriginal !== null && valorOriginal !== undefined ? String(valorOriginal) : '';
        valorTexto = escaparCelda(valorTexto);
        return valorTexto;
      }).join(',');
    });

    const contenidoCSV = [cabeceras.join(','), ...filas].join('\n');
    descargarCSV(contenidoCSV, filename);
  };

  /**
   * Exporta a CSV una lista de listas fijas (tuplas).
   *
   * Pensada para datos de tipo fila-array con posiciones fijas (ej. los que usa
   * `fields.ts` de solicitudes), donde cada columna define qué índice de la tupla
   * mostrar y un formateador opcional.
   *
   * @param columns - Definición de columnas: `{ label, value }`, donde `value`
   *                  recibe la fila completa y devuelve el valor de la celda
   *                  (puede usarse para formatear fechas, etc.).
   * @param data - Lista de filas (arrays) a exportar.
   * @param filename - Nombre del archivo descargado (default 'admred.csv').
   */
  const exportCSVTuplas = <T extends readonly unknown[]>(
    columns: { label: string; value: (fila: T) => string | number | null | undefined }[],
    data: T[],
    filename = 'admred.csv'
  ): void => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    const cabeceras = columns.map(col => col.label);

    const filas = data.map((fila) => {
      return columns.map((col) => {
        const valorOriginal = col.value(fila);
        let valorTexto = valorOriginal !== null && valorOriginal !== undefined ? String(valorOriginal) : '';
        valorTexto = escaparCelda(valorTexto);
        return valorTexto;
      }).join(',');
    });

    const contenidoCSV = [cabeceras.join(','), ...filas].join('\n');
    descargarCSV(contenidoCSV, filename);
  };

  return { exportCSV, exportCSVTuplas };
}
