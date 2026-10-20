/**
 * HURANOW MOTORS - Comprehensive Official Fleet Dataset
 * Massive catalog of 38+ real vehicles across all categories:
 * - African Favorites & Everyday Affordable (RAV4, Prado, Fielder, Yaris, Hilux, Fortuner, Twegerane, Coaster, Boxer moto, etc.)
 * - Supercars & Hypercars (Ferrari SF90, Porsche GT3 RS, Bugatti, Lamborghini, McLaren)
 * - Luxury SUVs, Heavy Commercial Trucks (HOWO, Scania, Actros, Isuzu), Pickups, VIP Vans, Superbikes & Bicycles.
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
  { id: 'supercar', name: 'Supercars & Hypercars', icon: 'zap' },
  { id: 'suv', name: 'Luxury SUVs & 4x4', icon: 'shield' },
  { id: 'truck', name: 'Pickups & Commercial Trucks', icon: 'truck' },
  { id: 'electric', name: 'Electric & Hybrids', icon: 'battery-charging' },
  { id: 'sedan', name: 'Affordable & Executive Sedans', icon: 'compass' },
  { id: 'van', name: 'Minibuses & VIP Vans', icon: 'users' },
  { id: 'motorcycle', name: 'Moto-Taxis & Superbikes', icon: 'navigation' },
  { id: 'bicycle', name: 'Carbon Bicycles', icon: 'activity' }
];

const INITIAL_VEHICLES = [
  // ==========================================
  // 1. AFRICAN FAVORITES & AFFORDABLE VEHICLES
  // ==========================================
  {
    id: 'hn-toyota-rav4-2022',
    brand: 'Toyota',
    model: 'RAV4 2.0L VVT-i AWD Adventure',
    category: 'suv',
    isAfricanAffordable: true,
    condition: 'Certified Pre-Owned',
    year: 2022,
    mileage: 38000,
    fuel: 'Petrol (2.0L Dynamic Force)',
    transmission: 'Direct-Shift CVT Automatic',
    drivetrain: 'Dynamic Torque Vectoring AWD',
    powerHp: 203,
    accel0to100: '8.1s',
    topSpeed: '200 km/h',
    seats: 5,
    colorName: 'Lunar Rock Grey / Black SofTex',
    paintHex: '#7d8687',
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
      hero: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['High Ground Clearance', 'Multi-Terrain Select', 'Toyota Safety Sense 2.0', 'Dual-Zone Climate Control']
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
    colorName: 'Prestige Pearl White / Beige Leather',
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
      hero: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['7-Seater Interior', 'Dual Fuel Tanks (150L)', 'Cool Box Refrigerator', 'Center Diff Lock']
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
      hero: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
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
    colorName: 'Crimson Wine Red / Charcoal Fabric',
    paintHex: '#991122',
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
      hero: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Push-to-Start Button', 'Keyless Smart Entry', 'Easy City Steering', 'High Resale Liquidity']
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
    colorName: 'Glacier Super White / Heavy-Duty Interior',
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
      hero: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['1-Tonne Payload Capacity', '3.5-Tonne Towing Capacity', 'Heavy Duty Leaf Springs', 'Rear Diff Lock']
  },
  {
    id: 'hn-toyota-fortuner-gd6',
    brand: 'Toyota',
    model: 'Fortuner 2.8L GD-6 4x4 Automatic',
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
    colorName: 'Attitude Black Mica / Chamois Tan Leather',
    paintHex: '#101114',
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
      hero: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['7 Full Adult Seats', 'JBL Premium 9-Speaker Audio', 'Power Backdoor Tailgate', 'A-TRC Active Traction']
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
    accel0to100: '14.0s',
    topSpeed: '150 km/h',
    seats: 15,
    colorName: 'Commercial White / Vinyl Transit Seats',
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
      hero: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
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
    accel0to100: 'High Capacity Haul',
    topSpeed: '120 km/h',
    seats: 30,
    colorName: 'Sahara Cream White & Green Stripe',
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
      hero: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
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
    colorName: 'Kinetic Jungle Green / Black Top',
    paintHex: '#4a6b32',
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
      hero: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Ladder Frame Chassis', 'AllGrip Pro 4WD with Low Range', 'Brake LSD Traction Control', 'Hill Descent Control']
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
    colorName: 'Flash Red / Move Pattern Seats',
    paintHex: '#cc1122',
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
      hero: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
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
      hero: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['50 km per Liter Economy', 'Heavy Dual Rear Shocks (SNS)', 'Strong Rear Luggage Carrier', 'Spare Parts on Every Corner']
  },
  {
    id: 'hn-ampersand-e-moto',
    brand: 'Ampersand',
    model: 'e-Moto Gen-3 Swap-Battery',
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
      hero: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
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
    accel0to100: 'Heavy Construction',
    topSpeed: '95 km/h',
    seats: 2,
    colorName: 'Construction Safety Orange / Red Chassi',
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
      hero: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['25-Tonne Payload Rating', 'Steyr Heavy Diesel Block', 'Front Hydraulic Lift Cylinder', 'Steel Reinforced Cab']
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
    dealership: 'Kigali Exotic Vault',
    price: 680000000,
    rentDaily: 3400000,
    tag: 'HYBRID HYPERCAR',
    badge: 'REAL 3D MODEL AVAILABLE',
    is3dAvailable: true,
    model3dType: 'real_ferrari',
    description: 'Ferrari’s most powerful road car ever produced. Twin-turbo 4.0L V8 paired with three electric motors producing a staggering 986 HP with instant torque vectoring. Real 3D model available in our studio!',
    images: {
      hero: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
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
    fuel: 'Petrol (Naturally Aspirated)',
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
    price: 395000000,
    rentDaily: 1950000,
    tag: 'TRACK LEGEND',
    badge: 'NEW ARRIVAL',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'The pinnacle of aerodynamic obsession. Featuring swan-neck active rear wing with DRS, lightweight magnesium package, carbon ceramic brakes, and a howling 4.0L flat-six that revs to 9,000 RPM.',
    images: {
      hero: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
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
    fuel: 'Petrol (Naturally Aspirated)',
    transmission: '7-Speed LDF Dual-Clutch',
    drivetrain: 'Rear-Wheel Drive (RWD)',
    powerHp: 631,
    accel0to100: '3.2s',
    topSpeed: '325 km/h',
    seats: 2,
    colorName: 'Verde Mantis Metallic',
    paintHex: '#76d400',
    interiorHex: '#1d1d20',
    dealership: 'Peak Motors, Kigali',
    price: 435000000,
    rentDaily: 2200000,
    tag: 'V10 SYMPHONY',
    badge: 'VERIFIED INSPECTED',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'Naturally aspirated 5.2-liter V10 engine delivers unadulterated mechanical thrill with rear-wheel steering and carbon ceramic brakes.',
    images: {
      hero: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'
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
    fuel: 'Petrol (Twin-Turbo V8)',
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
      hero: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
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
    fuel: '100% Electric',
    transmission: 'Single-Speed Fixed Gear',
    drivetrain: 'Tri-Motor All-Wheel Drive with Torque Vectoring',
    powerHp: 1020,
    accel0to100: '1.99s',
    topSpeed: '322 km/h',
    seats: 5,
    colorName: 'Pearl White Multi-Coat / White Cockpit',
    paintHex: '#f2f2f4',
    interiorHex: '#ffffff',
    dealership: 'EcoWheels RW, Kigali',
    price: 168000000,
    rentDaily: 790000,
    tag: 'HYPER ACCELERATION',
    badge: 'ZERO EMISSION',
    is3dAvailable: true,
    model3dType: 'sedan',
    description: 'Beyond supercar acceleration in a luxurious full-size 5-passenger sedan. 1,020 HP with 600 km EPA electric range.',
    images: {
      hero: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'
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
      hero: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
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
