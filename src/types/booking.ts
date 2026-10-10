export interface BookingSlot {
  time: string;
  isAvailable: boolean;
}

export interface BookingPlace {
  id: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  slots: {
    today: BookingSlot[];
    tomorrow: BookingSlot[];
  };
}

export interface Reservation {
  id: string;
  date: 'today' | 'tomorrow';
  time: string;
  contactPerson: string;
  phone: string;
  withChildren: boolean;
  peopleCount: number;
  placeId: string;
  address: string;
  locationLat: number;
  locationLng: number;
  questId: string;
  questTitle: string;
  questLevel: string;
  questPreviewImg: string;
}

export type BookingPlaceDto = {
  id: string;
  location: {
    address: string;
    coords: [number, number];
  };
  slots: {
    today: BookingSlot[];
    tomorrow: BookingSlot[];
  };
};

export type BookingRequestDto = {
  date: 'today' | 'tomorrow';
  time: string;
  contactPerson: string;
  phone: string;
  withChildren: boolean;
  peopleCount: number;
  placeId: string;
};

export type BookingResponseDto = BookingRequestDto & {
  id: string;
  location: {
    address: string;
    coords: [number, number];
  };
  quest: {
    id: string;
    title: string;
    previewImg: string;
    previewImgWebp: string;
    level: string;
    type: string;
    peopleMinMax: [number, number];
  };
};
