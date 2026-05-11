import { computed, Injectable, signal } from '@angular/core';
import { PrintFileConfig } from '../../models/print/print-file-config';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private filesSignal = signal<File[]>([]);
  files = computed(() => this.filesSignal());

  printFilesConfig = signal<PrintFileConfig[]>([]);

  currentStep = signal(3);

  constructor() { }

  addFiles(newFiles: FileList | File[]) {
    const current = this.filesSignal();

    const incoming = Array.from(newFiles);

    const filtered = incoming.filter(file =>
      !current.some(f =>
        f.name === file.name &&
        f.size === file.size &&
        f.lastModified === file.lastModified
      )
    );

    this.filesSignal.set([...current, ...filtered]);

    this.printFilesConfig.set(this.getDefaultSettings(this.filesSignal()));
  }

  getDefaultSettings(files: File[]): PrintFileConfig[] {
    return files.map(file => ({
      name: file.name,
      printMode: 1,
      paperSize: 1,
      sides: 1,
      binding: 0,
      pageRange: 'All',
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      noOfCopies: 1,
      orientation: 1
    }));
  }

  removeFile(file: File) {
    this.filesSignal.update(files =>
      files.filter(f => f !== file)
    );
  }

  next(): void{
    if(this.currentStep() <= 3){
      this.currentStep.update(step => step + 1);
    }
  }

  back(): void{
    if(this.currentStep() > 1){
      this.currentStep.update(step => step - 1);
    }
  }

  setCurrentStep(step: number): void {
    this.currentStep.set(step);
  }
}
