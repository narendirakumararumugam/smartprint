import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../core/services/shop.service';
import { ShopDetails } from '../../../models/shops/shop-details';

@Component({
  selector: 'app-shop-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-preview.component.html',
  styleUrl: './shop-preview.component.css',
})
export class ShopPreviewComponent {
  @Input() shopPreviewDetails!: ShopDetails;
  floorRating: number = 0;
  ceilRating: number = 0;

  constructor(private _shopService: ShopService){}

  ngOnInit(){
    this.floorRating = Math.floor(this.shopPreviewDetails.rating);
    this.ceilRating = Math.ceil(this.shopPreviewDetails.rating);
  }

  check(star: number): boolean{
    console.log("star: " + star + ", check: " + this.floorRating);
    return star <= this.floorRating;
  }

  setModalOpen(): void{
    this._shopService.setShopModalData(this.shopPreviewDetails);
    this._shopService.setIsModalOpen(true);
  }

}
