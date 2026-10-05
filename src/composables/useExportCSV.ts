export interface UseExportCSVOptions {
  /**
   * Preestablecido para compatibilidad directa con Excel (especialmente en locales español/latam).
   * Si es true, cambia el separador por defecto a ';' y sanitiza los saltos de línea.
   * Por defecto false.
   */
  excelReady?: boolean;

  /**
   * Separador de columnas. Por defecto ','.
   * Si excelReady es true, el defecto cambia automáticamente a ';'.
   */
  separator?: string;

  /**
   * Reemplaza \r y \n por espacios en blanco para evitar que Excel rompa las filas
   * al hacer doble clic sobre el archivo.
   * Por defecto false. Si excelReady es true, cambia automáticamente a true.
   */
  sanitizeNewlines?: boolean;
}

export default function useExportCSV(options: UseExportCSVOptions = {}) {
  // Resolución de configuración con valores por defecto inteligentes
  const isExcelReady = options.excelReady ?? false;
  const separador = options.separator ?? (isExcelReady ? ';' : ',');
  const sanitizar = options.sanitizeNewlines ?? isExcelReady;

  const descargarCSV = (contenidoCSV: string, filename: string): void => {
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
   * Sanitiza saltos de línea si la opción está activa.
   */
  const procesarTexto = (valor: string): string => {
    if (sanitizar) {
      // Quita \r\n, \n y \r sueltos, reemplazándolos por un espacio
      return valor.replace(/\r?\n/g, ' ').replace(/\r/g, ' ');
    }
    return valor;
  };

  /**
   * Escapa un valor para que sea seguro en una celda CSV.
   */
  const escaparCelda = (valor: string): string => {
    if (
      valor.includes(separador) ||
      valor.includes('"') ||
      valor.includes('\n') || // Mantenemos la comprobación por si sanitizeNewlines es false
      valor.includes('\r')
    ) {
      return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
  };

  /**
   * Exporta a CSV una lista de objetos (Record<string, any>).
   */
  const exportCSV = <T extends Record<string, any>>(
    fields: string,
    data: T[],
    filename = 'admred.csv'
  ): void => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    let camposExtraer: string[] = [];
    let cabecerasMostrar: string[] = [];

    if (!fields || fields.trim() === '*') {
      camposExtraer = Object.keys(data[0]);
      cabecerasMostrar = [...camposExtraer];
    } else {
      fields.split(',').forEach(campo => {
        const campoTrim = campo.trim();
        const match = campoTrim.match(/^(.+?)\s+as\s+(.+)$/i);
        if (match) {
          camposExtraer.push(match[1].trim());
          cabecerasMostrar.push(match[2].trim());
        } else {
          camposExtraer.push(campoTrim);
          cabecerasMostrar.push(campoTrim);
        }
      });
    }

    const filas = data.map((fila) => {
      return camposExtraer.map((campo) => {
        const valorOriginal = fila[campo as keyof T];
        let valorTexto = valorOriginal !== null && valorOriginal !== undefined ? String(valorOriginal) : '';
        valorTexto = procesarTexto(valorTexto); // Sanitizamos primero
        valorTexto = escaparCelda(valorTexto);  // Escapamos después
        return valorTexto;
      }).join(separador);
    });

    const cabeceraFinal = cabecerasMostrar.map(c => escaparCelda(procesarTexto(c))).join(separador);
    const contenidoCSV = [cabeceraFinal, ...filas].join('\n');

    descargarCSV(contenidoCSV, filename);
  };

  /**
   * Exporta a CSV una lista de listas fijas (tuplas).
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

    const cabeceras = columns.map(col => escaparCelda(procesarTexto(col.label)));

    const filas = data.map((fila) => {
      return columns.map((col) => {
        const valorOriginal = col.value(fila);
        let valorTexto = valorOriginal !== null && valorOriginal !== undefined ? String(valorOriginal) : '';
        valorTexto = procesarTexto(valorTexto); // Sanitizamos primero
        valorTexto = escaparCelda(valorTexto);  // Escapamos después
        return valorTexto;
      }).join(separador);
    });

    const contenidoCSV = [cabeceras.join(separador), ...filas].join('\n');
    descargarCSV(contenidoCSV, filename);
  };

  return { exportCSV, exportCSVTuplas };
}