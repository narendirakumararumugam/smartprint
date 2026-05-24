import { PrintAddon, UploadedFile } from "../models/upload.model";

export function estimateFile(f: UploadedFile): number {
  const perPage = f.color ? 10 : 1.5;
  const sides = f.sides === 'double' ? 0.9 : 1;
  return Math.round(f.pages * f.copies * perPage * sides);
}

export function estimateTotal(
  files: UploadedFile[],
  selectedAddons: Set<string>,
  allAddons: PrintAddon[]
): number {
  const fileTotal = files.reduce((s, f) => s + estimateFile(f), 0);
  const addonTotal = Array.from(selectedAddons)
    .reduce((s, id) => s + (allAddons.find(a => a.id === id)?.price ?? 0), 0);
  return fileTotal + addonTotal;
}

export function totalPages(files: UploadedFile[]): number {
  return files.reduce((s, f) => s + f.pages * f.copies, 0);
}

export function fileIconBgClass(ext: string): string {
  if (ext === 'pdf') return 'fi-pdf';
  if (['doc', 'docx'].includes(ext)) return 'fi-doc';
  if (['ppt', 'pptx'].includes(ext)) return 'fi-ppt';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'fi-img';
  return 'fi-doc';
}

export function fileIconBxClass(ext: string): string {
  if (ext === 'pdf') return 'bx bxs-file-pdf';
  if (['doc', 'docx'].includes(ext)) return 'bx bxs-file-doc';
  if (['ppt', 'pptx'].includes(ext)) return 'bx bxs-slideshow';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'bx bxs-file-image';
  return 'bx bx-file';
}