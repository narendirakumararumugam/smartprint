import { Component, effect } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { CommonModule } from '@angular/common';
import { shopDetailsList } from '../../../testdata/shop-details';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-details-modal.component.html',
  styleUrl: './shop-details-modal.component.css'
})
export class ShopDetailsModalComponent {
  isOpen = this._shopService.isModalOpen;
  shopDetails = this._shopService.shopModalData;
  floorRating: number = 0;
  ceilRating: number = 0;
  constructor(private _shopService: ShopService, private _router: Router ){
    effect(() => {
    this.floorRating = Math.floor(this.shopDetails()!.rating);
    this.ceilRating = Math.ceil(this.shopDetails()!.rating);
    });
  }

  isToday(day:string): boolean{
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return day === today;
  }

  closeModal(): void{
    this._shopService.setIsModalOpen(false);
  }

  goToPrintPage(): void{
    console.log("print");
    this._router.navigateByUrl('/print');
  }
}
