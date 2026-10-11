import { Reservation } from '../types/booking';

type ReservationDto = {
  id: string;
  date: 'today' | 'tomorrow';
  time: string;
  contactPerson: string;
  phone: string;
  withChildren: boolean;
  peopleCount: number;
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

export const adaptReservationToClient = (dto: ReservationDto): Reservation => ({
  id: dto.id,
  date: dto.date,
  time: dto.time,
  contactPerson: dto.contactPerson,
  phone: dto.phone,
  withChildren: dto.withChildren,
  peopleCount: dto.peopleCount,
  address: dto.location.address,
  locationLat: dto.location.coords[0],
  locationLng: dto.location.coords[1],
  questId: dto.quest.id,
  questTitle: dto.quest.title,
  questLevel: dto.quest.level,
  questPreviewImg: dto.quest.previewImg,
});


