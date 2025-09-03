// Hungarian Delivery Service Integration

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  provider: 'foxpost' | 'posta' | 'packeta' | 'own';
  type: 'pickup_point' | 'home_delivery' | 'express';
  price: number; // in HUF
  estimatedDays: string;
  enabled: boolean;
  logo?: string;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  openingHours: string;
  provider: string;
}

// Default delivery options configuration
export const DELIVERY_OPTIONS: DeliveryOption[] = [
  // Own delivery service
  {
    id: 'own-delivery',
    name: 'Saját kézbesítés',
    description: 'Saját futárszolgálattal házhoz szállítás',
    provider: 'own',
    type: 'home_delivery',
    price: 1500,
    estimatedDays: '1-2 munkanap',
    enabled: true,
  },
  
  // Foxpost
  {
    id: 'foxpost-pickup',
    name: 'Foxpost csomagautomata',
    description: 'Átvétel Foxpost csomagautomatából',
    provider: 'foxpost',
    type: 'pickup_point',
    price: 890,
    estimatedDays: '1-3 munkanap',
    enabled: true,
    logo: 'https://foxpost.hu/images/logo.png',
  },
  {
    id: 'foxpost-home',
    name: 'Foxpost házhoz szállítás',
    description: 'Foxpost futár házhoz szállítás',
    provider: 'foxpost',
    type: 'home_delivery',
    price: 1690,
    estimatedDays: '1-3 munkanap',
    enabled: true,
    logo: 'https://foxpost.hu/images/logo.png',
  },
  
  // Magyar Posta
  {
    id: 'posta-pickup',
    name: 'Posta pont átvétel',
    description: 'Átvétel postahivatalban vagy posta ponton',
    provider: 'posta',
    type: 'pickup_point',
    price: 1200,
    estimatedDays: '2-4 munkanap',
    enabled: true,
    logo: 'https://www.posta.hu/static/images/posta_logo.png',
  },
  {
    id: 'posta-home',
    name: 'Posta házhoz szállítás',
    description: 'Magyar Posta házhoz szállítás',
    provider: 'posta',
    type: 'home_delivery',
    price: 1890,
    estimatedDays: '2-4 munkanap',
    enabled: true,
    logo: 'https://www.posta.hu/static/images/posta_logo.png',
  },
  
  // Packeta
  {
    id: 'packeta-pickup',
    name: 'Packeta Z-BOX',
    description: 'Átvétel Packeta Z-BOX csomagautomatából',
    provider: 'packeta',
    type: 'pickup_point',
    price: 990,
    estimatedDays: '1-3 munkanap',
    enabled: true,
    logo: 'https://www.zasilkovna.cz/images/page/logo.svg',
  },
  {
    id: 'packeta-home',
    name: 'Packeta házhoz szállítás',
    description: 'Packeta futár házhoz szállítás',
    provider: 'packeta',
    type: 'home_delivery',
    price: 1590,
    estimatedDays: '1-3 munkanap',
    enabled: true,
    logo: 'https://www.zasilkovna.cz/images/page/logo.svg',
  },
];

// Delivery calculation functions
export function calculateDeliveryFee(
  subtotal: number,
  selectedDeliveryId: string,
  freeDeliveryThreshold: number = 15000
): number {
  // Free delivery above threshold for own delivery
  if (selectedDeliveryId === 'own-delivery' && subtotal >= freeDeliveryThreshold) {
    return 0;
  }

  const deliveryOption = DELIVERY_OPTIONS.find(option => 
    option.id === selectedDeliveryId && option.enabled
  );

  return deliveryOption?.price || 1500; // Default fallback
}

export function getAvailableDeliveryOptions(): DeliveryOption[] {
  return DELIVERY_OPTIONS.filter(option => option.enabled);
}

export function getDeliveryOption(id: string): DeliveryOption | undefined {
  return DELIVERY_OPTIONS.find(option => option.id === id);
}

// Mock pickup points data (in production, these would come from APIs)
export const MOCK_PICKUP_POINTS: PickupPoint[] = [
  // Foxpost points
  {
    id: 'foxpost-1',
    name: 'Foxpost - Westend City Center',
    address: 'Váci út 1-3',
    city: 'Budapest',
    postalCode: '1062',
    openingHours: 'H-V: 10:00-22:00, Sz-V: 10:00-22:00',
    provider: 'foxpost',
  },
  {
    id: 'foxpost-2',
    name: 'Foxpost - Árkád Budapest',
    address: 'Örs vezér tere 25/A',
    city: 'Budapest',
    postalCode: '1148',
    openingHours: 'H-V: 10:00-21:00, Sz-V: 10:00-21:00',
    provider: 'foxpost',
  },
  
  // Posta points
  {
    id: 'posta-1',
    name: 'Budapest 62 Postahivatal',
    address: 'Váci út 47',
    city: 'Budapest',
    postalCode: '1134',
    openingHours: 'H-P: 8:00-18:00, Sz: 8:00-12:00',
    provider: 'posta',
  },
  {
    id: 'posta-2',
    name: 'Budapest 13 Postahivatal',
    address: 'Szent István körút 22',
    city: 'Budapest',
    postalCode: '1137',
    openingHours: 'H-P: 8:00-19:00, Sz: 8:00-13:00',
    provider: 'posta',
  },
  
  // Packeta points
  {
    id: 'packeta-1',
    name: 'Packeta Z-BOX - Tesco Hypermarket',
    address: 'Pesti út 237',
    city: 'Budapest',
    postalCode: '1173',
    openingHours: '24/7',
    provider: 'packeta',
  },
  {
    id: 'packeta-2',
    name: 'Packeta Z-BOX - ALDI',
    address: 'Váci út 178',
    city: 'Budapest',
    postalCode: '1138',
    openingHours: '24/7',
    provider: 'packeta',
  },
];

export function getPickupPoints(provider?: string, city?: string): PickupPoint[] {
  let points = MOCK_PICKUP_POINTS;
  
  if (provider) {
    points = points.filter(point => point.provider === provider);
  }
  
  if (city) {
    points = points.filter(point => 
      point.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  return points;
}

// Delivery settings management
export interface DeliverySettings {
  freeDeliveryThreshold: number;
  enabledProviders: string[];
  defaultDeliveryOption: string;
}

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  freeDeliveryThreshold: 15000,
  enabledProviders: ['own', 'foxpost', 'posta', 'packeta'],
  defaultDeliveryOption: 'own-delivery',
};
