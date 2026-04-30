export interface ShopPreviewDetails{
    shopId: number,
    shopName: string,
    isFavourite: boolean,
    shopAddress: string,
    rating: number,
    waitTime: number,
    services: string[],
    fromCost: number,
    distance: number,
    isOpen: boolean,
    coverImage: string
}