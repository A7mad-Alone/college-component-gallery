export interface ComponentItem {
  Timestamp: string;
  Name: string;
  ProductLink: string;
  State: 'New' | 'Used';
  Usage: string;
  Count: number;
  SellingPrice: number;
  BoughtPrice: number;
  CurrentPrice: number;
  SellerName: string;
  SellerNumber: string;
  ImageUrl: string;
  Notes: string;
}

export type FormData = Omit<ComponentItem, 'Timestamp'> & { key?: string };
