import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environment/environment';

interface Verification {
  id: number;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  city: string;
  services: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  address: string;
}

@Component({
  selector: 'app-admin-verifications',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: './verifications.component.html',
  styleUrl: './verifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminVerificationsComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly title = inject(Title);

  verifications: Verification[] = [];
  filteredList: Verification[] = [];
  filterStatus: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';
  selectedItem: Verification | null = null;
  showModal = false;
  rejectReason = '';

  ngOnInit(): void {
    this.title.setTitle('Shop Verifications - SmartPrint Admin');
    if (environment.useMockData) {
      this.verifications = this.getMockData();
    }
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredList = this.verifications;
    } else {
      this.filteredList = this.verifications.filter(v => v.status === this.filterStatus);
    }
    this.cdr.markForCheck();
  }

  openDetail(v: Verification): void {
    this.selectedItem = v;
    this.showModal = true;
    this.rejectReason = '';
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
    this.cdr.markForCheck();
  }

  approve(): void {
    if (this.selectedItem) {
      this.selectedItem.status = 'approved';
      this.closeModal();
      this.applyFilter();
    }
  }

  reject(): void {
    if (this.selectedItem) {
      this.selectedItem.status = 'rejected';
      this.closeModal();
      this.applyFilter();
    }
  }

  getPendingCount(): number {
    return this.verifications.filter(v => v.status === 'pending').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-green';
      case 'rejected': return 'status-red';
      default: return 'status-amber';
    }
  }

  private getMockData(): Verification[] {
    return [
      { id: 1, shopName: 'PrintZone Express', ownerName: 'Rajesh Gupta', ownerEmail: 'rajesh@printzone.co', city: 'Mumbai', services: ['B&W Printing', 'Color Printing', 'Binding'], status: 'pending', submittedAt: '2 hours ago', address: '12, Andheri E...' },
      { id: 2, shopName: 'DocuPrint Hub', ownerName: 'Anjali Mehta', ownerEmail: 'anjali.m@gmail.com', city: 'Pune', services: ['B&W Printing', 'Scanning', 'Lamination'], status: 'pending', submittedAt: '5 hours ago', address: '45, FC Road, Pune' },
      { id: 3, shopName: 'FastCopy Center', ownerName: 'Vikram Singh', ownerEmail: 'vikram@fastcopy.in', city: 'Delhi', services: ['B&W Printing', 'Color Printing', 'Photocopying', 'Binding'], status: 'pending', submittedAt: '1 day ago', address: '...' },
      { id: 4, shopName: 'QuickPrint Hub', ownerName: 'Ramesh Jain', ownerEmail: 'ramesh@quickprint.in', city: 'Delhi', services: ['B&W Printing', 'Color Printing'], status: 'approved', submittedAt: '3 days ago', address: 'Janpath Market, New Delhi' },
      { id: 5, shopName: 'Spam Shop 123', ownerName: 'Test User', ownerEmail: 'test@spam.com', city: 'Unknown', services: ['Printing'], status: 'rejected', submittedAt: '5 days ago', address: 'Invalid address' },
    ];
  }
}