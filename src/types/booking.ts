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
