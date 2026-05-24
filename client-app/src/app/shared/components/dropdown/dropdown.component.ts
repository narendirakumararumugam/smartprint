import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef, 
  TemplateRef, 
  EmbeddedViewRef, 
  OnDestroy, 
  inject, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  HostListener,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnDestroy {
  @Input() options: DropdownOption[] = [];
  @Input() selected: string = '';
  @Input() placeholder = 'Select';
  @Input() icon = '';
  @Input() variant: 'default' | 'borderless' | 'form' = 'default';
  @Input() disabled = false;
  @Output() selectionChange = new EventEmitter<string>();

  @ViewChild('trigger', { static: true }) triggerRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('menuTpl', { static: true }) menuTpl!: TemplateRef<unknown>;

  isOpen = false;
  menuStyle: { [key: string]: string } = {};

  private readonly el = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  
  private menuView: EmbeddedViewRef<unknown> | null = null;
  private menuHost: HTMLElement | null = null;

  get selectedOption(): DropdownOption | undefined {
    return this.options.find(o => o.value === this.selected);
  }

  get displayLabel(): string {
    return this.selectedOption?.label ?? this.placeholder;
  }

  ngOnDestroy(): void {
    this.detachMenu();
  }

  toggle(): void {
    if (this.disabled) return;
    if (this.isOpen) this.close();
    else this.open();
  }

  private open(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isOpen = true;
    this.updateMenuPosition();
    this.attachMenu();
    this.cdr.markForCheck();
  }

  private close(): void {
    this.isOpen = false;
    this.detachMenu();
    this.cdr.markForCheck();
  }

  select(option: DropdownOption): void {
    this.selectionChange.emit(option.value);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event): void {
    if (!this.isOpen) return;
    const target = event.target as Node;
    if (this.el.nativeElement.contains(target)) return;
    if (this.menuHost && this.menuHost.contains(target)) return;
    this.close();
  }

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onPositionChange(): void {
    if (!this.isOpen) return;
    this.updateMenuPosition();
    if (this.menuView) this.menuView.detectChanges();
  }

  private updateMenuPosition(): void {
    const rect = this.triggerRef.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = 280;

    if (spaceBelow < menuHeight && rect.top > spaceBelow) {
      this.menuStyle = {
        position: 'fixed',
        bottom: `${window.innerHeight - rect.top + 4}px`,
        left: `${rect.left}px`,
        top: 'auto',
        'min-width': `${Math.max(rect.width, 200)}px`
      };
    } else {
      this.menuStyle = {
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        bottom: 'auto',
        'min-width': `${Math.max(rect.width, 200)}px`
      };
    }
  }

  private attachMenu(): void {
    if (this.menuView) return;
    this.menuHost = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(this.menuHost, 'app-dropdown-portal');
    this.renderer.appendChild(this.document.body, this.menuHost);

    this.menuView = this.vcr.createEmbeddedView(this.menuTpl);
    this.menuView.rootNodes.forEach(node => this.renderer.appendChild(this.menuHost, node));
    this.menuView.detectChanges();
  }

  private detachMenu(): void {
    if (this.menuView) {
      this.menuView.destroy();
      this.menuView = null;
    }
    if (this.menuHost && this.menuHost.parentNode) {
      this.renderer.removeChild(this.menuHost.parentNode, this.menuHost);
    }
    this.menuHost = null;
  }

  trackByValue(_: number, opt: DropdownOption): string {
    return opt.value;
  }
}