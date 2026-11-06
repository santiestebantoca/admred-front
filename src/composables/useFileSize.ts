/** Formatea un tamaño en bytes a B/K/M/G. */
export default function useFileSize() {
  function fileSize(bytes: number): string | undefined {
    if (!Number.isInteger(bytes)) {
      return
    } else if (bytes < 1024) {
      return bytes + ' B'
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + ' K'
    } else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(1) + ' M'
    } else {
      return (bytes / 1073741824).toFixed(1) + ' G'
    }
  }
  return {
    fileSize
  }
}
