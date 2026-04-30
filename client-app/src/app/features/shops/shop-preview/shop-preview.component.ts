import { Component, Input } from '@angular/core';
import { ShopPreviewDetails } from '../../../models/shop-preview-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-preview.component.html',
  styleUrl: './shop-preview.component.css',
})
export class ShopPreviewComponent {
  @Input() shopPreviewDetails!: ShopPreviewDetails;
  floorRating: number = 0;
  ceilRating: number = 0;

  ngOnInit(){
    this.floorRating = Math.floor(this.shopPreviewDetails.rating);
    this.ceilRating = Math.ceil(this.shopPreviewDetails.rating);
  }

  check(star: number): boolean{
    console.log("star: " + star + ", check: " + this.floorRating);
    return star <= this.floorRating;
  }
}
