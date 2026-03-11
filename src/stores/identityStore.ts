import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IdentityModel, PermitType } from '../types/identity.types';

interface IdentityState extends IdentityModel {
  setPermit: (data: {
    qrData: string;
    imageBase64: string;
    permitType: PermitType;
    expiryDate: Date;
    holderName: string;
    nationality: string;
  }) => void;
  setHotelCard: (data: {
    imageUri: string;
    extractedAddress: string | null;
    hotelName: string | null;
    phone: string | null;
  }) => void;
  setNusukId: (id: string) => void;
  reset: () => void;
}

const initialState: IdentityModel = {
  nusukIdNumber: '',
  permitQrData: '',
  permitImageBase64: '',
  permitType: null,
  permitExpiryDate: null,
  permitHolderName: null,
  permitNationality: null,
  hotelCardImageUri: null,
  hotelCardExtractedAddress: null,
  hotelCardHotelName: null,
  hotelCardPhone: null,
};

export const useIdentityStore = create<IdentityState>()(
  persist(
    immer((set) => ({
      ...initialState,

      setPermit: ({ qrData, imageBase64, permitType, expiryDate, holderName, nationality }) =>
        set((state) => {
          state.permitQrData = qrData;
          state.permitImageBase64 = imageBase64;
          state.permitType = permitType;
          state.permitExpiryDate = expiryDate;
          state.permitHolderName = holderName;
          state.permitNationality = nationality;
        }),

      setHotelCard: ({ imageUri, extractedAddress, hotelName, phone }) =>
        set((state) => {
          state.hotelCardImageUri = imageUri;
          state.hotelCardExtractedAddress = extractedAddress;
          state.hotelCardHotelName = hotelName;
          state.hotelCardPhone = phone;
        }),

      setNusukId: (id) =>
        set((state) => {
          state.nusukIdNumber = id;
        }),

      reset: () =>
        set((state) => {
          Object.assign(state, initialState);
        }),
    })),
    {
      name: 'identity-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
