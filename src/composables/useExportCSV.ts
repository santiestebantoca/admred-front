export default function useExportCSV() {

  const exportCSV = <T extends Record<string, any>>(fields: string, data: T[]): void => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    let cabeceras: string[] = [];

    // 1. Procesamos el parámetro "fields"
    if (!fields || fields.trim() === '*') {
      cabeceras = Object.keys(data[0]);
    } else {
      cabeceras = fields.split(',').map(campo => campo.trim());
    }

    // 2. Mapeamos los datos extrayendo las propiedades según las cabeceras
    const filas = data.map((fila) => {
      return cabeceras.map((cabecera) => {
        // 1. Obtenemos el dato original sin mutar su tipo (T[keyof T])
        const valorOriginal = fila[cabecera as keyof T];

        // 2. Creamos una nueva variable explícitamente de tipo string
        let valorTexto = valorOriginal !== null && valorOriginal !== undefined ? String(valorOriginal) : '';

        // 3. Aplicamos las validaciones sobre la variable de texto
        if (valorTexto.includes(',') || valorTexto.includes('"') || valorTexto.includes('\n')) {
          valorTexto = `"${valorTexto.replace(/"/g, '""')}"`;
        }

        return valorTexto;
      }).join(',');
    });

    // 3. Unimos el contenido
    const contenidoCSV = [cabeceras.join(','), ...filas].join('\n');

    // 4. Forzamos la descarga nativa
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.setAttribute('href', url);
    enlace.setAttribute('download', 'admred.csv');
    enlace.style.visibility = 'hidden';

    document.body.appendChild(enlace);
    enlace.click();

    // Limpieza de memoria
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  };

  return { exportCSV };
}