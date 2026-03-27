export const PDF_ACCEPT = '.pdf,application/pdf'

export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return file.type === 'application/pdf' || name.endsWith('.pdf')
}

export function getFileSignature(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}
