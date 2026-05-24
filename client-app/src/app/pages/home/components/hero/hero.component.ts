import { Component } from '@angular/core';
import { ShopService } from '../../../../core/services/shop.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  constructor(private _shopService: ShopService) { }

  onSearch(value: string): void{
    this._shopService.setSearch(value);
  }
}
