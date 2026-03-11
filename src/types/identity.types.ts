export type PermitType = 'umrah' | 'hajj';

export interface IdentityModel {
  nusukIdNumber: string;
  permitQrData: string;           // raw QR string — cached for offline
  permitImageBase64: string;      // QR rendered as image for offline
  permitType: PermitType | null;
  permitExpiryDate: Date | null;
  permitHolderName: string | null;
  permitNationality: string | null;
  hotelCardImageUri: string | null;         // local file URI
  hotelCardExtractedAddress: string | null; // Claude Vision result
  hotelCardHotelName: string | null;
  hotelCardPhone: string | null;
}
