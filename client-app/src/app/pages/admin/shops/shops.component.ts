import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { environment } from '../../../environment/environment';

interface ShopRow {
    id: number;
    name: string;
    ownerName: string;
    city: string;
    rating: number;
    reviewCount: number;
    isOpen: boolean;
    isVerified: boolean;
    ordersCount: number;
    revenue: string;
    createdAt: string;
}

@Component({
    selector: 'app-admin-shops',
    standalone: true,
    imports: [CommonModule, FormsModule, AdminLayoutComponent, DropdownComponent],
    templateUrl: './shops.component.html',
    styleUrl: './shops.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShopsComponent implements OnInit {
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly title = inject(Title);
    private readonly adminApi = inject(AdminApiService);

    shops: ShopRow[] = [];
    filteredShops: ShopRow[] = [];
    searchQuery = '';
    filterStatus: 'all' | 'verified' | 'unverified' = 'all';
    readonly filterStatusOptions: DropdownOption[] = [
        { label: 'All Shops', value: 'all' },
        { label: 'Verified', value: 'verified' },
        { label: 'Unverified', value: 'unverified' },
    ];

    ngOnInit(): void {
        this.title.setTitle('Shop Management – SmartPrint Admin');
        this.loadData();
    }

    private loadData(): void {
        if (environment.useMockData) {
            this.shops = this.getMockShops();
            this.applyFilters();
            return;
        }

        this.adminApi.getShops().subscribe(data => {
            this.shops = data.map(s => ({
                id: s.id,
                name: s.name,
                ownerName: s.ownerName,
                city: s.city || '',
                rating: s.rating,
                reviewCount: s.reviewCount,
                isOpen: s.open,
                isVerified: s.verified,
                ordersCount: 0,
                revenue: '₹0',
                createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
            }));
            this.applyFilters();
        });
    }

    applyFilters(): void {
        let list = this.shops;
        if (this.filterStatus === 'verified') list = list.filter(s => s.isVerified);
        if (this.filterStatus === 'unverified') list = list.filter(s => !s.isVerified);
        
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.ownerName.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q)
            );
        }
        this.filteredShops = list;
        this.cdr.markForCheck();
    }

    toggleVerification(shop: ShopRow): void {
        const newStatus = !shop.isVerified;
        if (!environment.useMockData) {
            this.adminApi.toggleShopVerification(shop.id, newStatus).subscribe();
        }
        shop.isVerified = newStatus;
        this.cdr.markForCheck();
    }

    private getMockShops(): ShopRow[] {
        return [
            { id: 1, name: 'PrintPro Express', ownerName: 'Suresh Kumar', city: 'Delhi', rating: 4.8, reviewCount: 142, isOpen: true, isVerified: true, ordersCount: 1240, revenue: '₹3,45,000', createdAt: 'Dec 2025' },
            { id: 2, name: 'QuickPrint Hub', ownerName: 'Ramesh Jain', city: 'Delhi', rating: 4.5, reviewCount: 89, isOpen: true, isVerified: true, ordersCount: 870, revenue: '₹2,18,000', createdAt: 'Jan 2026' },
            { id: 3, name: 'Digital Café & Print', ownerName: 'Priya Mehta', city: 'Mumbai', rating: 4.3, reviewCount: 56, isOpen: true, isVerified: true, ordersCount: 420, revenue: '₹1,05,000', createdAt: 'Nov 2025' },
            { id: 4, name: 'Campus Prints', ownerName: 'Vikram Singh', city: 'Delhi', rating: 4.6, reviewCount: 201, isOpen: true, isVerified: true, ordersCount: 2100, revenue: '₹5,60,000', createdAt: 'Nov 2025' },
            { id: 5, name: 'PrintZone Express', ownerName: 'Rajesh Gupta', city: 'Mumbai', rating: 0, reviewCount: 0, isOpen: false, isVerified: false, ordersCount: 0, revenue: '₹0', createdAt: 'Apr 2026' },
            { id: 6, name: 'DocuPrint Hub', ownerName: 'Anjali Mehta', city: 'Pune', rating: 0, reviewCount: 0, isOpen: false, isVerified: false, ordersCount: 0, revenue: '₹0', createdAt: 'Apr 2026' },
        ];
    }
}