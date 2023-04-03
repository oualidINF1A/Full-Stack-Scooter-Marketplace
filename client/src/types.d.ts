export interface Model {
name: string;
}

export interface User{
name?: string,
email?: string,
_id?: string
}

export interface Scooter{
brand: string,
model: string,
yearOfConstruction: string,
mileage:string,
licensePlateType: string,
cylinderCapacity: string,
condition: string,
_id: string,
}

export interface OfferType{
owner:User,
amount: number,
date:string,
_id: string,
}

export interface ScooterPart{
    partCategory: string,
    typeOfPart: string,
    condition: string,
    _id: string,
}

export interface Advert {
date: string,
title: string,
zipCode: string,
description: string,
images: string[],
offers: OfferType[],
offerPrice: number,
houseNumber: number | string,
province: string,
city: string,
showContactInfo: boolean,
showCity: boolean,
price: number,
owner: User,
category: string,
phone: string,
scooter?: Scooter,
scooterPart?: ScooterPart,
saves:string[]
_id: string,
}

export interface ScooterBrand {
name: string;
models: { [key: string]: Model };
}

export interface ScooterCategory {
id: number;
name: string;
subcategories: ScooterBrand[];
}

export interface ScooterExtraInfo {
    condition: string;
    licensePlateType: string;
    cylinderCapacity: string;
    yearOfConstruction: string;
    mileage: string;
}

export interface ScooterPartExtraInfo {
    condition: string;
}

export interface Model {
    name: string;
  }
  
export interface ScooterBrand {
    name: string;
    models: { [key: string]: Model };
  }
export interface ScooterCategory {
    id: number;
    name: string;
    subcategories: ScooterBrand[];
  }