import { Injectable, signal } from '@angular/core';
import { ShopDetails } from '../../models/shops/shop-details';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { graphqlQueries } from '../../config/graphql.queries';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  isModalOpen = signal(false);
  shopModalData = signal<ShopDetails | null>(null);

  constructor(
    private _http: HttpClient,
    private _apollo: Apollo,
  ) {}

  setIsModalOpen(value: boolean): void {
    this.isModalOpen.set(value);
  }

  setShopModalData(shopData: ShopDetails | null): void {
    this.shopModalData.set(shopData);
  }

  //#region API calls
  getPopularShopsNearby(userLat: number, userLon: number): Observable<any> {
    return this._apollo.query({
      query: graphqlQueries.GET_POPULAR_NEARBY_SHOPS,
      variables: { userLat: userLat, userLon: userLon },
      context: {
        uri: '/graphql', // Replace with your GraphQL endpoint
      }
    });
  }
  //#endregion
}
