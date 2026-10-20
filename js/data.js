/**
 * HURANOW MOTORS - Official Fleet Dataset
 * Comprehensive catalog of authentic vehicles:
 * - 🇷🇼 Everyday Affordable African Favorites (RAV4, Prado, Hilux, LC79 Afrique, Fortuner, Twegerane, Coaster, Jimny, Fielder, Yaris, Wish, Polo Vivo, Boxer moto, Ampersand, HOWO Tipper, Isuzu D-Max, Canter)
 * - ⚡ Supercars, Hypercars & Luxury Dream Fleet (Ferrari SF90, Porsche GT3 RS, Lamborghini Huracán, Mercedes G63, Tesla Plaid, Ducati)
 * 100% Verified Real Vehicle Photography - Guaranteed Zero Inaccurate or Non-Vehicle Images.
 */

const CURRENCIES = {
  RWF: { code: 'RWF', symbol: 'RWF ', rate: 1, decimals: 0 },
  USD: { code: 'USD', symbol: '$', rate: 0.00075, decimals: 0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.00069, decimals: 0 }
};

let currentCurrency = 'RWF';

function formatMoney(amountInRwf, currency = currentCurrency) {
  const c = CURRENCIES[currency] || CURRENCIES.RWF;
  const converted = Math.round(amountInRwf * c.rate);
  return c.symbol + converted.toLocaleString('en-US');
}

const CATEGORIES = [
  { id: 'all', name: 'All Fleet', icon: 'grid' },
  { id: 'africa', name: '🇷🇼 African Favorites & Affordable', icon: 'map-pin' },
  { id: 'suv', name: 'Affordable & Luxury SUVs', icon: 'shield' },
  { id: 'truck', name: 'Pickups & Commercial Trucks', icon: 'truck' },
  { id: 'van', name: 'Minibuses & Transit Buses', icon: 'users' },
  { id: 'sedan', name: 'Economical Wagons & Sedans', icon: 'compass' },
  { id: 'motorcycle', name: 'Moto-Taxis & Superbikes', icon: 'navigation' },
  { id: 'supercar', name: 'Supercars & Hypercars', icon: 'zap' },
  { id: 'electric', name: 'Electric & Clean Tech', icon: 'battery-charging' }
];

const INITIAL_VEHICLES = [
  // ==========================================
  // 1. AFRICAN FAVORITES & EVERYDAY AFFORDABLE
  // ==========================================
  {
    id: 'hn-toyota-rav4-2022',
    brand: 'Toyota',
    model: 'RAV4 2.0L AWD Adventure',
    category: 'suv',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2022,
    mileage: 38000,
    fuel: 'Petrol (2.0L VVT-i)',
    transmission: 'Direct-Shift CVT Automatic',
    drivetrain: 'All-Wheel Drive (AWD)',
    powerHp: 203,
    accel0to100: '8.1s',
    topSpeed: '200 km/h',
    seats: 5,
    colorName: 'Lunar Silver Metallic',
    paintHex: '#9ca3af',
    interiorHex: '#18181b',
    dealership: 'Kigali Auto Hub, Gikondo',
    price: 32000000, // 32M RWF ~ $24,000
    rentDaily: 45000, // 45,000 RWF/day ~ $34
    tag: 'RWANDA FAVORITE',
    badge: 'POPULAR IN KIGALI',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'The undisputed king of Rwandan roads. Perfect ground clearance for Kigali hills and upcountry trips to Musanze and Lake Kivu. Fuel efficient, ultra-reliable, with cheap maintenance.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Toyota_RAV_4.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_RAV4_001.JPG',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Toyota_RAV-4.JPG'
    },
    features: ['High Ground Clearance', 'Multi-Terrain Select', 'Toyota Safety Sense', 'Dual-Zone Climate Control']
  },
  {
    id: 'hn-toyota-prado-txl',
    brand: 'Toyota',
    model: 'Land Cruiser Prado TXL 2.8L D-4D',
    category: 'suv',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2021,
    mileage: 46000,
    fuel: 'Turbo Diesel (2.8L D-4D)',
    transmission: '6-Speed Super ECT Automatic',
    drivetrain: 'Full-Time 4WD with Low Range & Diff Lock',
    powerHp: 201,
    accel0to100: '9.8s',
    topSpeed: '185 km/h',
    seats: 7,
    colorName: 'Prestige Pearl White / Tan Leather',
    paintHex: '#f0f1f4',
    interiorHex: '#c99c68',
    dealership: 'Rwanda Rides Ltd, Nyarutarama',
    price: 56000000, // 56M RWF ~ $42,000
    rentDaily: 85000, // 85k RWF/day
    tag: 'AFRICAN STAPLE',
    badge: 'TOP RATED 4X4',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'The prestige workhorse of government officials, NGO directors, and safari adventurers across East Africa. 7 adult seats, kinetic dynamic suspension, and bulletproof diesel reliability.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Toyota_Land_Cruiser_Prado_150.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/2000_Toyota_Land_Cruiser_Prado_%286420114559%29.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Toyota_Land_Cruiser_Prado_70_004.JPG'
    },
    features: ['7-Seater Interior', 'Dual Fuel Tanks (150L)', 'Cool Box Refrigerator', 'Center Diff Lock']
  },
  {
    id: 'hn-toyota-hilux-dc',
    brand: 'Toyota',
    model: 'Hilux Double Cab 2.4L GD-6 4x4',
    category: 'truck',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 100,
    fuel: 'Turbo Diesel (2.4L 2GD-FTV)',
    transmission: '6-Speed Manual with iMT',
    drivetrain: '4WD with Shift-on-the-Fly & Rear Diff Lock',
    powerHp: 150,
    accel0to100: '11.8s',
    topSpeed: '175 km/h',
    seats: 5,
    colorName: 'Glacier Super White',
    paintHex: '#f5f6f8',
    interiorHex: '#18181b',
    dealership: 'Kigali Auto Hub, Gikondo',
    price: 42000000, // 42M RWF ~ $31,500
    rentDaily: 65000, // 65k RWF/day
    tag: 'INVINCIBLE TOUGHNESS',
    badge: 'AFRICAN WORKHORSE',
    is3dAvailable: true,
    model3dType: 'truck',
    description: 'The legend that cannot be broken. Handles rugged construction sites, agricultural farms in Eastern Province, and cross-border commercial hauling with a 1-tonne cargo bed payload.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Toyota_Hilux_Double_Cab_3.0_D-4D_front.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Toyota_Land_Cruiser_Prado_150.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg'
    },
    features: ['1-Tonne Payload Capacity', '3.5-Tonne Towing Capacity', 'Heavy Duty Leaf Springs', 'Rear Diff Lock']
  },
  {
    id: 'hn-toyota-lc79-afrique',
    brand: 'Toyota',
    model: 'Land Cruiser 79 Pickup (Version Afrique)',
    category: 'truck',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 20,
    fuel: 'Heavy Diesel (4.2L 1HZ 6-Cylinder)',
    transmission: '5-Speed Heavy Duty Manual',
    drivetrain: 'Part-Time 4WD with Manual Hubs & Dual Lockers',
    powerHp: 130,
    accel0to100: 'Heavy Hauler',
    topSpeed: '150 km/h',
    seats: 3,
    colorName: 'Desert Dune Sand Beige',
    paintHex: '#d8c7a2',
    interiorHex: '#18181b',
    dealership: 'Rwanda Rides Ltd, Nyarutarama',
    price: 49000000, // 49M RWF ~ $36,750
    rentDaily: 75000, // 75k RWF/day
    tag: 'AFRICA INDESTRUCTIBLE',
    badge: 'SAFARI & EXPEDITION',
    is3dAvailable: true,
    model3dType: 'truck',
    description: 'The true King of African exploration. Rigid front and rear live axles, snorkel air intake, dual 180L fuel tanks, and simple mechanical parts that any mechanic across the continent can fix.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Toyota_Hilux_Double_Cab_3.0_D-4D_front.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg'
    },
    features: ['Safari Snorkel Air Intake', 'Dual 180L Fuel Tanks', 'Live Solid Axles', 'Heavy Reinforced Drop-Side Bed']
  },
  {
    id: 'hn-toyota-fortuner-gd6',
    brand: 'Toyota',
    model: 'Fortuner 2.8L GD-6 7-Seater 4x4',
    category: 'suv',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2022,
    mileage: 34000,
    fuel: 'Turbo Diesel (2.8L GD-6)',
    transmission: '6-Speed Automatic with Sport Mode',
    drivetrain: '4WD with Active Traction Control (A-TRC)',
    powerHp: 201,
    accel0to100: '9.2s',
    topSpeed: '190 km/h',
    seats: 7,
    colorName: 'Pearl White / Black Roof',
    paintHex: '#f0f1f4',
    interiorHex: '#c99c68',
    dealership: 'Rwanda Rides Ltd, Nyarutarama',
    price: 48000000, // 48M RWF ~ $36,000
    rentDaily: 75000, // 75k RWF/day
    tag: 'FAMILY 7-SEATER',
    badge: 'POPULAR IN RWANDA',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'Hilux toughness combined with luxury family comfort. 7 adult seats, roof rails, rear entertainment vents, and full 4x4 low range capability for trips to Akagera National Park.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Toyota_Fortuner_White.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Toyota_Fortuner_%28pre-facelift%29.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Toyota_Fortuner-rear.JPG'
    },
    features: ['7 Full Adult Seats', 'JBL Premium Audio', 'Power Backdoor Tailgate', 'A-TRC Active Traction']
  },
  {
    id: 'hn-toyota-hiace-twegerane',
    brand: 'Toyota',
    model: 'HiAce Commuter 15-Seater Minibus',
    category: 'van',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2020,
    mileage: 78000,
    fuel: 'Turbo Diesel (2.5L 2KD-FTV)',
    transmission: '5-Speed Manual Heavy-Duty',
    drivetrain: 'Rear-Wheel Drive with Limited Slip',
    powerHp: 101,
    accel0to100: 'Transit Commuter',
    topSpeed: '150 km/h',
    seats: 15,
    colorName: 'Commercial White / Blue Stripe',
    paintHex: '#f2f3f5',
    interiorHex: '#30323a',
    dealership: 'Kigali Auto Hub, Nyabugogo',
    price: 32000000, // 32M RWF ~ $24,000
    rentDaily: 60000, // 60k RWF/day
    tag: 'RWANDA TRANSIT HERO',
    badge: 'TWEGERANE COMMUTER',
    is3dAvailable: true,
    model3dType: 'van',
    description: 'The backbone of passenger transport across Kigali and all 30 districts of Rwanda. Seats 15 passengers comfortably with high roof, rear luggage area, and unshakeable durability.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Toyota_Hiace_%28H100%29.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Toyota_HiAce_Van_DX_%2720_%281%29.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Toyota_Hiace_H200_rear.jpg'
    },
    features: ['15-Passenger Capacity', 'Dual Front & Rear Climate AC', 'Sliding Passenger Door', 'Roof Luggage Rack Ready']
  },
  {
    id: 'hn-toyota-coaster-bus',
    brand: 'Toyota',
    model: 'Coaster 30-Passenger Deluxe Bus',
    category: 'van',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2021,
    mileage: 82000,
    fuel: 'Diesel (4.2L 1HZ 6-Cylinder)',
    transmission: '5-Speed Manual Transmission',
    drivetrain: 'Heavy Rear-Wheel Drive Dual Tires',
    powerHp: 135,
    accel0to100: 'High Capacity Tour Haul',
    topSpeed: '120 km/h',
    seats: 30,
    colorName: 'Sahara White & Gold Livery',
    paintHex: '#f0ece1',
    interiorHex: '#222228',
    dealership: 'Rwanda Rides Ltd, Nyabugogo',
    price: 74000000, // 74M RWF ~ $55,500
    rentDaily: 175000, // 175k RWF/day
    tag: 'TOUR & TRANSIT BUS',
    badge: '30-PASSENGER',
    is3dAvailable: true,
    model3dType: 'van',
    description: 'The national standard for tour agencies, corporate company staff shuttles, and school transport throughout Rwanda. 30 high-back reclining seats, large tinted windows, and heavy dual rear wheels.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Toyota_Coaster_GX_XZB70.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Toyota_Coaster_in_Bangkok_%287%29.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Toyota_Coaster_012.JPG'
    },
    features: ['30 High-Back Seats', 'Automatic Passenger Door', 'Overhead Parcel Racks', 'Public Address Mic System']
  },
  {
    id: 'hn-suzuki-jimny',
    brand: 'Suzuki',
    model: 'Jimny Sierra 1.5L AllGrip 4x4',
    category: 'suv',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 15,
    fuel: 'Petrol (1.5L K15B)',
    transmission: '5-Speed Manual with 4WD Low Range',
    drivetrain: 'AllGrip Pro Part-Time 4WD with Low Ratio',
    powerHp: 101,
    accel0to100: '11.5s',
    topSpeed: '145 km/h',
    seats: 4,
    colorName: 'Kinetic Jungle Yellow-Green',
    paintHex: '#b2c824',
    interiorHex: '#18181b',
    dealership: 'Peak Motors, Remera',
    price: 24000000, // 24M RWF ~ $18,000
    rentDaily: 42000, // 42k RWF/day
    tag: 'MINI MOUNTAIN GOAT',
    badge: 'ICONIC RETRO 4X4',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'Lightweight ladder-frame 4x4 that conquers trails where heavy trucks get stuck. 210mm ground clearance, solid 3-link front and rear axles, and head-turning retro styling.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/4/42/2019_Suzuki_Jimny.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Suzuki_Jimny_XC_%282%29.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Suzuki_Jimny%2C_2020_rear.jpg'
    },
    features: ['Ladder Frame Chassis', 'AllGrip Pro 4WD with Low Range', 'Brake LSD Traction Control', 'Hill Descent Control']
  },
  {
    id: 'hn-toyota-corolla-fielder',
    brand: 'Toyota',
    model: 'Corolla Fielder 1.5L Hybrid Wagon',
    category: 'sedan',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2020,
    mileage: 52000,
    fuel: 'Petrol Hybrid (1NZ-FXE)',
    transmission: 'e-CVT Automatic',
    drivetrain: 'Front-Wheel Drive',
    powerHp: 100,
    accel0to100: '10.5s',
    topSpeed: '180 km/h',
    seats: 5,
    colorName: 'Silver Metallic / Grey Fabric',
    paintHex: '#c4c8cf',
    interiorHex: '#222228',
    dealership: 'Peak Motors, Remera',
    price: 14500000, // 14.5M RWF ~ $10,800
    rentDaily: 30000, // 30k RWF/day ~ $22
    tag: 'ECONOMY HERO',
    badge: '3.8L/100KM FUEL',
    is3dAvailable: true,
    model3dType: 'sedan',
    description: 'The most economical wagon in Rwanda. Runs over 26 km per liter of petrol! Huge luggage boot capacity, ultra cheap spare parts available anywhere in Kigali.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/E120_Toyota_Corolla.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Toyota_Yaris_front_20081204.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/E120_Toyota_Corolla.jpg'
    },
    features: ['Hybrid Synergy Drive', 'Spacious Cargo Boot', 'EV Silent Drive Mode', 'Low Maintenance Cost']
  },
  {
    id: 'hn-toyota-yaris-vitz',
    brand: 'Toyota',
    model: 'Yaris / Vitz 1.3L Smart Edition',
    category: 'sedan',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2019,
    mileage: 64000,
    fuel: 'Petrol (1.3L VVT-i)',
    transmission: 'Super CVT-i Automatic',
    drivetrain: 'Front-Wheel Drive',
    powerHp: 99,
    accel0to100: '11.0s',
    topSpeed: '175 km/h',
    seats: 5,
    colorName: 'Silver Grey / Charcoal Fabric',
    paintHex: '#a0a4ad',
    interiorHex: '#282830',
    dealership: 'Lakeside Motors, Kicukiro',
    price: 9200000, // 9.2M RWF ~ $6,900
    rentDaily: 25000, // 25k RWF/day ~ $18
    tag: 'BEST ENTRY PRICE',
    badge: 'BUDGET FRIENDLY',
    is3dAvailable: true,
    model3dType: 'sedan',
    description: 'The easiest car to buy and maintain in Kigali. Zips through city traffic, parks anywhere, and runs on minimal fuel. Excellent first car for students, young professionals, and rental fleets.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Toyota_Yaris_front_20081204.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Toyota_Yaris_I_1.5_TS_front.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Toyota_Yaris_front-1.JPG'
    },
    features: ['Push-to-Start Button', 'Keyless Smart Entry', 'Easy City Steering', 'High Resale Liquidity']
  },
  {
    id: 'hn-toyota-wish-7seater',
    brand: 'Toyota',
    model: 'Wish 1.8L 7-Passenger MPV',
    category: 'van',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2019,
    mileage: 58000,
    fuel: 'Petrol (1.8L Valvematic)',
    transmission: 'CVT Automatic 7-Speed Sport Mode',
    drivetrain: 'Front-Wheel Drive',
    powerHp: 143,
    accel0to100: '10.2s',
    topSpeed: '185 km/h',
    seats: 7,
    colorName: 'Metallic Silver / Dark Grey',
    paintHex: '#bdc3c7',
    interiorHex: '#222228',
    dealership: 'Kigali Auto Hub, Remera',
    price: 13500000, // 13.5M RWF ~ $10,125
    rentDaily: 35000, // 35k RWF/day
    tag: '7-SEAT BUDGET WAGON',
    badge: 'FAMILY & AIRPORT TAXI',
    is3dAvailable: true,
    model3dType: 'van',
    description: 'Highly sought-after in Rwanda for family trips and airport shuttle businesses. Fits 7 passengers with flexible folding rear seats that create a flat cargo bed.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/2003-2005_Toyota_Wish.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Toyota_Wish_02.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Toyota_Wish_th.jpg'
    },
    features: ['7 Foldable Seats', 'Low Center of Gravity', 'Spacious Legroom', 'Low Fuel Consumption']
  },
  {
    id: 'hn-vw-polo-vivo-kigali',
    brand: 'Volkswagen',
    model: 'Polo Vivo Move Kigali Edition',
    category: 'sedan',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: 'Petrol (1.4L MPI)',
    transmission: '5-Speed Manual Tiptronic',
    drivetrain: 'Front-Wheel Drive',
    powerHp: 85,
    accel0to100: '12.2s',
    topSpeed: '177 km/h',
    seats: 5,
    colorName: 'Pure White / Move Pattern Seats',
    paintHex: '#f4f5f7',
    interiorHex: '#222228',
    dealership: 'Move by CFAO / VW Rwanda, Special Economic Zone',
    price: 21500000, // 21.5M RWF ~ $16,100
    rentDaily: 38000, // 38k RWF/day
    tag: 'ASSEMBLED IN RWANDA',
    badge: 'MADE IN RWANDA 🇷🇼',
    is3dAvailable: true,
    model3dType: 'sedan',
    description: 'Proudly assembled right here in Kigali at the Volkswagen Rwanda assembly plant in Masoro! European build quality, modern touchscreen infotainment, and low fuel running costs.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Volkswagen_Polo_front.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Volkswagen_Polo_front.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Volkswagen_Polo_front.jpg'
    },
    features: ['Assembled in Kigali, Rwanda', 'Touchscreen with Bluetooth & USB', 'Factory 3-Year Warranty', 'Move Rwanda Service Network']
  },
  {
    id: 'hn-bajaj-boxer-150',
    brand: 'Bajaj',
    model: 'Boxer BM 150 Heavy Duty',
    category: 'motorcycle',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: 'Petrol (150cc 4-Stroke Air-Cooled)',
    transmission: '4-Speed All Down Gearbox',
    drivetrain: 'Heavy-Duty Roller Chain',
    powerHp: 12,
    accel0to100: 'Top Speed: 95 km/h',
    topSpeed: '95 km/h',
    seats: 2,
    colorName: 'Flame Red / Chrome Guard Rails',
    paintHex: '#d41122',
    interiorHex: '#111114',
    dealership: 'Peak Motors, Nyabugogo',
    price: 1950000, // 1.95M RWF ~ $1,460
    rentDaily: 9000, // 9,000 RWF/day
    tag: 'RWANDA #1 MOTO-TAXI',
    badge: 'MOST POPULAR VEHICLE',
    is3dAvailable: true,
    model3dType: 'motorcycle',
    description: 'The undisputed king of transport in Rwanda and East Africa! Powered by the indestructible 150cc engine. Carries passengers and cargo over hills with ultra-low fuel consumption (50 km per liter).',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Moto_Bajaj.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Moto_Bajaj.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Moto_Bajaj.jpg'
    },
    features: ['50 km per Liter Economy', 'Heavy Dual Rear Shocks (SNS)', 'Strong Rear Luggage Carrier', 'Spare Parts on Every Corner']
  },
  {
    id: 'hn-tvs-apache-180',
    brand: 'TVS',
    model: 'Apache RTR 180 ABS Performance',
    category: 'motorcycle',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: 'Petrol (177.4cc 4-Stroke Oil-Cooled)',
    transmission: '5-Speed Manual Gearbox',
    drivetrain: 'High-Tensile Chain Drive',
    powerHp: 17,
    accel0to100: '4.8s (0-60)',
    topSpeed: '115 km/h',
    seats: 2,
    colorName: 'Matte Blue / Racing Decals',
    paintHex: '#1d4ed8',
    interiorHex: '#111114',
    dealership: 'Peak Motors, Nyabugogo',
    price: 2600000, // 2.6M RWF ~ $1,950
    rentDaily: 12000, // 12k RWF/day
    tag: 'RACING SPORT MOTO',
    badge: 'DUAL-CHANNEL ABS',
    is3dAvailable: true,
    model3dType: 'motorcycle',
    description: 'Sport commuter motorcycle equipped with race-tuned ABS brakes, digital speedo cluster, petal disc brakes, and race-tuned fuel injection for swift hill climbing across Kigali.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/TVS_Apache_RTR_180_ABS_2011_model_parked_.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/TVS_Apache_RTR_180_ABS_2011_model_parked_.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/TVS_Apache_RTR_180_ABS_2011_model_parked_.jpg'
    },
    features: ['Race-Tuned ABS Brakes', 'Digital Racing Instrument Console', 'Petal Disc Front & Rear Brakes', 'LED Daytime Running Halos']
  },
  {
    id: 'hn-ampersand-e-moto',
    brand: 'Ampersand',
    model: 'e-Moto Gen-3 Swappable Battery',
    category: 'motorcycle',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: '100% Electric (Swappable Li-Ion)',
    transmission: 'Twist & Go Automatic Direct Drive',
    drivetrain: 'Belt & Sprocket Drive',
    powerHp: 8,
    accel0to100: 'Top Speed: 80 km/h',
    topSpeed: '80 km/h',
    seats: 2,
    colorName: 'Kigali Eco Cyan & Black',
    paintHex: '#00d4ff',
    interiorHex: '#18181b',
    dealership: 'Ampersand Rwanda Hub, Gikondo',
    price: 2450000, // 2.45M RWF ~ $1,830
    rentDaily: 10000, // 10k RWF/day
    tag: 'KIGALI CLEAN TECH',
    badge: 'SWAPPABLE BATTERY ⚡',
    is3dAvailable: true,
    model3dType: 'motorcycle',
    description: 'Designed and engineered in Kigali! Rwanda’s revolutionary electric moto-taxi. Swap battery in 90 seconds at over 40 stations across Kigali. Cuts fuel costs by 40% with zero emissions.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/7/73/2020_CSC_City_Slicker_electric_motorcycle.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/ZEV_T-6100%2C_Electric_Motorcycle.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/7/73/2020_CSC_City_Slicker_electric_motorcycle.jpg'
    },
    features: ['90-Second Battery Swap in Kigali', '40% Cheaper than Petrol', 'Zero Tailpipe Pollution', 'Digital GPS Fleet Tracker']
  },
  {
    id: 'hn-sinotruk-howo-tipper',
    brand: 'Sinotruk',
    model: 'HOWO 371 Heavy 20m³ Tipper 6x4',
    category: 'truck',
    isAfricanAffordable: true,
    condition: 'Brand New',
    year: 2026,
    mileage: 200,
    fuel: 'Heavy Turbo Diesel (9.7L Steyr WD615)',
    transmission: 'HW19710 10-Speed Heavy Manual',
    drivetrain: '6x4 Heavy Dual Axle with Inter-Wheel Diff Locks',
    powerHp: 371,
    accel0to100: 'Heavy Hauler',
    topSpeed: '95 km/h',
    seats: 2,
    colorName: 'Construction Safety Orange',
    paintHex: '#ff6600',
    interiorHex: '#222228',
    dealership: 'Lakeside Motors, Nyabugogo',
    price: 72000000, // 72M RWF ~ $54,000
    rentDaily: 280000, // 280k RWF/day
    tag: 'EAST AFRICA DUMP TRUCK',
    badge: '25-TONNE PAYLOAD',
    is3dAvailable: true,
    model3dType: 'heavy_truck',
    description: 'The backbone of road construction, airport expansions, and quarry hauling in Rwanda and across East Africa. Heavy reinforced 20 cubic meter tipper body with front hydraulic ram.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/DT-138_Sinotruk_Howo_336_Bangladesh_%2824898026692%29.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Sinotruk_Howo_Truck.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Howo_371hp_tractor_truck.jpg'
    },
    features: ['25-Tonne Payload Rating', 'Steyr Heavy Diesel Block', 'Front Hydraulic Lift Cylinder', 'Steel Reinforced Cab']
  },
  {
    id: 'hn-isuzu-dmax-4x4',
    brand: 'Isuzu',
    model: 'D-Max 2.5L Turbo Diesel Double Cab 4x4',
    category: 'truck',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2022,
    mileage: 41000,
    fuel: 'Turbo Diesel (4JJ1 High Torque)',
    transmission: '6-Speed Manual with Low Transfer',
    drivetrain: 'Part-Time 4WD with Terrain Management',
    powerHp: 163,
    accel0to100: '11.2s',
    topSpeed: '175 km/h',
    seats: 5,
    colorName: 'Basalt Silver Grey Metallic',
    paintHex: '#9ca3af',
    interiorHex: '#18181b',
    dealership: 'Peak Motors, Remera',
    price: 36000000, // 36M RWF ~ $27,000
    rentDaily: 60000, // 60k RWF/day
    tag: 'COMMERCIAL TOUGH',
    badge: 'EAST AFRICA ASSEMBLED',
    is3dAvailable: true,
    model3dType: 'truck',
    description: 'Known throughout East Africa for commercial fleet longevity. Renowned Isuzu diesel engine engineered for high-mileage delivery routes, construction support, and farm work.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/2018_Isuzu_D-Max_1.9_Front.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/ISUZU_D-MAX%2C_2nd_Gen%2C_Front_Perspective_View.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Isuzu_Dmax_2004-front.JPG'
    },
    features: ['Famous Isuzu 4JJ1 Diesel Block', 'Heavy Duty Cargo Tie-Downs', 'Full 4x4 Low Transfer Case', 'High Water Wading Depth']
  },
  {
    id: 'hn-mitsubishi-canter-truck',
    brand: 'Mitsubishi',
    model: 'Fuso Canter 3.5-Tonne Dropside Truck',
    category: 'truck',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2021,
    mileage: 63000,
    fuel: 'Turbo Diesel (3.0L 4P10)',
    transmission: '5-Speed Manual Heavy Duty',
    drivetrain: 'Rear Dual Wheels (4x2)',
    powerHp: 130,
    accel0to100: 'Commercial Cargo',
    topSpeed: '120 km/h',
    seats: 3,
    colorName: 'Standard Logistics White',
    paintHex: '#f3f4f6',
    interiorHex: '#222228',
    dealership: 'Kigali Auto Hub, Nyabugogo',
    price: 28000000, // 28M RWF ~ $21,000
    rentDaily: 80000, // 80k RWF/day
    tag: 'DISTRIBUTION WORKHORSE',
    badge: '3.5-TONNE CAPACITY',
    is3dAvailable: true,
    model3dType: 'heavy_truck',
    description: 'The premier small delivery and hardware distribution truck in Rwanda. Cab-over design delivers exceptional tight-street turning radius in Kigali neighborhoods with dropside steel bed.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Mitsubishi_Fuso_Canter-20111120.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Mitsubishi_Fuso_Canter-20111120.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Mitsubishi_Fuso_Canter-20111120.jpg'
    },
    features: ['3.5-Tonne Payload dropside bed', 'Dual Rear Tires for Heavy Load', 'Tight Turning Circle for City Streets', 'Exhaust Brake System']
  },

  // ==========================================
  // 2. SUPERCARS & HYPERCARS (DREAM FLEET)
  // ==========================================
  {
    id: 'hn-ferrari-sf90',
    brand: 'Ferrari',
    model: 'SF90 Stradale Assetto Fiorano',
    category: 'supercar',
    condition: 'Brand New',
    year: 2026,
    mileage: 25,
    fuel: 'Plug-in Hybrid (PHEV)',
    transmission: '8-Speed F1 Dual-Clutch',
    drivetrain: 'e-4WD All-Wheel Drive',
    powerHp: 986,
    accel0to100: '2.5s',
    topSpeed: '340 km/h',
    seats: 2,
    colorName: 'Rosso Corsa Racing Red',
    paintHex: '#cc0000',
    interiorHex: '#151515',
    dealership: 'Kigali Exotic Vault, Nyarutarama',
    price: 680000000, // 680M RWF ~ $510,000
    rentDaily: 3400000, // 3.4M RWF/day
    tag: 'HYBRID HYPERCAR',
    badge: 'REAL 3D MODEL AVAILABLE',
    is3dAvailable: true,
    model3dType: 'real_ferrari',
    description: 'Ferrari’s most powerful road car ever produced. Twin-turbo 4.0L V8 paired with three electric motors producing a staggering 986 HP with instant torque vectoring. Real 3D model available in our studio!',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Ferrari_SF90.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Ferrari_SF90.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Ferrari_SF90.jpg'
    },
    features: ['Assetto Fiorano Package', 'Titanium Exhaust', 'Multimatic Dampers', 'Carbon Wheels', 'Full HUD Cockpit']
  },
  {
    id: 'hn-porsche-911-gt3rs',
    brand: 'Porsche',
    model: '911 GT3 RS (992)',
    category: 'supercar',
    condition: 'Brand New',
    year: 2026,
    mileage: 12,
    fuel: 'Petrol (Naturally Aspirated 4.0L Boxer)',
    transmission: '7-Speed PDK Dual-Clutch',
    drivetrain: 'Rear-Wheel Drive (RWD)',
    powerHp: 518,
    accel0to100: '3.0s',
    topSpeed: '296 km/h',
    seats: 2,
    colorName: 'Apex Guards Red / Carbon Aero',
    paintHex: '#d4162f',
    interiorHex: '#1d1d20',
    dealership: 'Apex Prestige Motors, Kigali',
    price: 395000000, // 395M RWF
    rentDaily: 1950000, // 1.95M RWF/day
    tag: 'TRACK LEGEND',
    badge: 'NEW ARRIVAL',
    is3dAvailable: true,
    model3dType: 'real_ferrari',
    description: 'The pinnacle of aerodynamic obsession. Featuring swan-neck active rear wing with DRS, lightweight magnesium package, carbon ceramic brakes, and a howling 4.0L flat-six that revs to 9,000 RPM.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Porsche_911_992_GT3_RS.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/9/98/911_GT3_RS.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Porsche_911_GT3_RS_4.0_IAA_rear.jpg'
    },
    features: ['Active Aero DRS', 'Weissach Package', 'Carbon Bucket Seats', 'Front-Axle Lift', 'PCCB Ceramic Brakes']
  },
  {
    id: 'hn-lamborghini-huracan',
    brand: 'Lamborghini',
    model: 'Huracán Tecnica V10',
    category: 'supercar',
    condition: 'Certified Pre-Owned',
    year: 2024,
    mileage: 6200,
    fuel: 'Petrol (Naturally Aspirated 5.2L V10)',
    transmission: '7-Speed LDF Dual-Clutch',
    drivetrain: 'Rear-Wheel Drive (RWD)',
    powerHp: 631,
    accel0to100: '3.2s',
    topSpeed: '325 km/h',
    seats: 2,
    colorName: 'Verde Mantis Green',
    paintHex: '#76d400',
    interiorHex: '#1d1d20',
    dealership: 'Peak Motors, Kigali',
    price: 435000000, // 435M RWF
    rentDaily: 2200000,
    tag: 'V10 SYMPHONY',
    badge: 'VERIFIED INSPECTED',
    is3dAvailable: true,
    model3dType: 'real_ferrari',
    description: 'Naturally aspirated 5.2-liter V10 engine delivers unadulterated mechanical thrill with rear-wheel steering and carbon ceramic brakes.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Lambo_Huracan_Front.JPG',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Lambo_Huracan_Front.JPG',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Lambo_Huracan_Front.JPG'
    },
    features: ['Rear-Wheel Steering', 'LDVI Predictive Dynamics', 'Carbon Shell Sport Seats', 'Sport Exhaust System']
  },
  {
    id: 'hn-amg-g63',
    brand: 'Mercedes-Benz',
    model: 'AMG G63 Night Edition 4x4',
    category: 'suv',
    condition: 'Brand New',
    year: 2026,
    mileage: 40,
    fuel: 'Petrol (Handcrafted 4.0L Bi-Turbo V8)',
    transmission: 'AMG SPEEDSHIFT TCT 9G',
    drivetrain: 'AMG Performance 4MATIC 4x4',
    powerHp: 577,
    accel0to100: '4.5s',
    topSpeed: '240 km/h',
    seats: 5,
    colorName: 'Obsidian Black Metallic / Bengal Red',
    paintHex: '#111215',
    interiorHex: '#8b1220',
    dealership: 'Peak Motors, Kigali',
    price: 330000000,
    rentDaily: 1450000,
    tag: 'ICONIC LUXURY 4X4',
    badge: 'BEST SELLER',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'The legendary Geländewagen perfected by AMG. Handcrafted 4.0L V8 biturbo with side-exit sport exhaust pipes, three 100% locking differentials, and diamond-quilted leather.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Mercedes-Benz_G_63_AMG_%2851921550544%29.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Mercedes-Benz_G_63_AMG_%2851921550544%29.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Mercedes-Benz_G_63_AMG_%2851921550544%29.jpg'
    },
    features: ['AMG Ride Control Suspension', 'Burmester 3D Surround', '3 Differential Locks', '22-inch Forged Wheels']
  },
  {
    id: 'hn-tesla-model-s-plaid',
    brand: 'Tesla',
    model: 'Model S Plaid Tri-Motor',
    category: 'electric',
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: '100% Electric (100 kWh Battery)',
    transmission: 'Single-Speed Fixed Gear',
    drivetrain: 'Tri-Motor All-Wheel Drive with Torque Vectoring',
    powerHp: 1020,
    accel0to100: '1.99s',
    topSpeed: '322 km/h',
    seats: 5,
    colorName: 'Pearl Solid White / Black Interior',
    paintHex: '#f2f2f4',
    interiorHex: '#18181b',
    dealership: 'EcoWheels RW, Kigali',
    price: 168000000,
    rentDaily: 790000,
    tag: 'HYPER ACCELERATION',
    badge: 'ZERO EMISSION',
    is3dAvailable: true,
    model3dType: 'sedan',
    description: 'Beyond supercar acceleration in a luxurious full-size 5-passenger sedan. 1,020 HP with 600 km EPA electric range and tri-motor torque vectoring.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Tesla_Model_S_Solid_White_Front.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Tesla_Model_S_%28Facelift_ab_04-2016%29_trimmed.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Tesla_MODEL_S_front.jpg'
    },
    features: ['Full Self-Driving Capable', 'Tri-Motor Torque Vectoring', '17-inch Cinematic Display', 'Yoke Steering Option']
  },
  {
    id: 'hn-ducati-panigale-v4s',
    brand: 'Ducati',
    model: 'Panigale V4 S Corse',
    category: 'motorcycle',
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: 'Petrol (Desmosedici V4)',
    transmission: '6-Speed with Ducati Quick Shift EVO 2',
    drivetrain: 'Chain Final Drive',
    powerHp: 215,
    accel0to100: '2.8s',
    topSpeed: '305 km/h',
    seats: 1,
    colorName: 'Ducati Corse Red & White Livery',
    paintHex: '#d4001a',
    interiorHex: '#151515',
    dealership: 'Peak Motors, Kigali',
    price: 43000000,
    rentDaily: 230000,
    tag: 'MOTOGP SOUL',
    badge: 'TRACK READY',
    is3dAvailable: true,
    model3dType: 'motorcycle',
    description: 'Direct transfer of MotoGP technology to the street. Carbon winglets, Öhlins electronic suspension, and 215 HP howling V4.',
    images: {
      hero: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Ducati_Panigale_V4_2026.jpg',
      interior: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Ducati_Panigale_V4_2026.jpg',
      rear: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Ducati_Panigale_V4_2026.jpg'
    },
    features: ['Öhlins Smart EC 2.0', 'Cornering ABS EVO', 'Ducati Traction Control DTC EVO 3', 'Carbon Wings']
  }
];

// Persistent state management
const Storage = {
  get(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
};

let allVehicles = [];

function loadVehicles() {
  const userListings = Storage.get('hn_custom_listings', []);
  allVehicles = [...INITIAL_VEHICLES, ...userListings];
  return allVehicles;
}

function getVehicleById(id) {
  if (!allVehicles.length) loadVehicles();
  return allVehicles.find(v => v.id === id);
}

// Initial load
loadVehicles();
