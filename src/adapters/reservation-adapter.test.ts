import { describe, it, expect } from 'vitest';
import { adaptReservationToClient } from './reservation-adapter';

describe('Reservation Adapter', () => {
  it('should flatten nested ReservationDto into flat Reservation object', () => {
    const dto = {
      id: 'res-1',
      date: 'today' as const,
      time: '14:00',
      contactPerson: 'Иван',
      phone: '+7 (999) 999-99-99',
      withChildren: true,
      peopleCount: 4,
      location: {
        address: 'Санкт-Петербург, наб. реки Карповки, 5П',
        coords: [59.966786, 30.309376] as [number, number],
      },
      quest: {
        id: 'q-1',
        title: 'Маньяк',
        previewImg: '/q.jpg',
        previewImgWebp: '/q.webp',
        level: 'hard' as const,
        type: 'horror' as const,
        peopleMinMax: [2, 6] as [number, number],
      },
    };

    const result = adaptReservationToClient(dto);

    expect(result.id).toBe('res-1');
    expect(result.address).toBe('Санкт-Петербург, наб. реки Карповки, 5П');
    expect(result.locationLat).toBe(59.966786);
    expect(result.locationLng).toBe(30.309376);
    expect(result.questId).toBe('q-1');
    expect(result.questTitle).toBe('Маньяк');
    expect(result.questLevel).toBe('hard');
    expect(result.questPreviewImg).toBe('/q.jpg');
  });
});
