import { Component } from '@angular/core';
import { ShopPreviewComponent } from "../shop-preview/shop-preview.component";
import { ShopPreviewDetails } from '../../../models/shop-preview-details';
import { shopsTestData } from '../../../testdata/shop-preview-details-test';

@Component({
  selector: 'app-shop-search',
  standalone: true,
  imports: [ShopPreviewComponent],
  templateUrl: './shop-search.component.html',
  styleUrl: './shop-search.component.css'
})
export class ShopSearchComponent {
  shopsList: ShopPreviewDetails[] = shopsTestData;
}
