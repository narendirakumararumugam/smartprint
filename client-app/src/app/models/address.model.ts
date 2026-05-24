export interface Address{
    id?: string;
    type: string;
    name: string;
    line1: string;
    line2?:string;
    city:string;
    pincode:string;
    phone:string;
    latitude?: number;
    longitude?: number;
    isDefault?:boolean;
}