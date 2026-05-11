import { Component } from '@angular/core';
import { ShopPreviewComponent } from "../shop-preview/shop-preview.component";
import { ShopDetailsModalComponent } from "../shop-details-modal/shop-details-modal.component";
import { ShopDetails } from '../../../models/shops/shop-details';
import { shopDetailsList } from '../../../testdata/shop-details';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-shop-search',
  standalone: true,
  imports: [ShopPreviewComponent, ShopDetailsModalComponent],
  templateUrl: './shop-search.component.html',
  styleUrl: './shop-search.component.css'
})
export class ShopSearchComponent {
  shopsList: ShopDetails[] = shopDetailsList;

  constructor(private _shopService: ShopService){
    this.getPopularShopsNearby();
  }

  getPopularShopsNearby():void{
    this._shopService.getPopularShopsNearby(40.7128, -74.0060).subscribe({
      next: (response) => {
        console.log('Popular nearby shops:', response.data.getPopularShopsNearby);
        // this.shopsList = response.data.getPopularNearbyShops;
      },
      error: (error) => {
        console.error('Error fetching popular nearby shops:', error);
      }
    });
  }
}
