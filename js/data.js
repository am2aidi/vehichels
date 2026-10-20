/**
 * HURANOW MOTORS - Official Fleet Dataset
 * Real public high-definition automotive imagery, authentic specifications,
 * multi-currency pricing (RWF & USD), buying & rental rates.
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
  { id: 'supercar', name: 'Supercars & Hypercars', icon: 'zap' },
  { id: 'suv', name: 'Luxury SUVs & 4x4', icon: 'shield' },
  { id: 'electric', name: 'Electric & Hybrids', icon: 'battery-charging' },
  { id: 'sedan', name: 'Performance Sedans', icon: 'compass' },
  { id: 'truck', name: 'Pickups & Haulers', icon: 'truck' },
  { id: 'van', name: 'VIP Vans & Shuttles', icon: 'users' },
  { id: 'motorcycle', name: 'Superbikes & Scooters', icon: 'navigation' },
  { id: 'bicycle', name: 'Carbon Bicycles', icon: 'activity' }
];

const INITIAL_VEHICLES = [
  {
    id: 'hn-porsche-911-gt3rs',
    brand: 'Porsche',
    model: '911 GT3 RS (992)',
    category: 'supercar',
    condition: 'Brand New',
    year: 2026,
    mileage: 18,
    fuel: 'Petrol (Naturally Aspirated)',
    transmission: '7-Speed PDK Dual-Clutch',
    drivetrain: 'Rear-Wheel Drive (RWD)',
    powerHp: 518,
    accel0to100: '3.0s',
    topSpeed: '296 km/h',
    seats: 2,
    colorName: 'Apex Guards Red / Carbon Aero',
    dealership: 'Apex Prestige Motors, Kigali',
    price: 395000000, // ~ $296,250
    rentDaily: 1950000, // ~ $1,460/day
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
    features: ['Active Aero DRS', 'Weissach Package', 'Carbon Bucket Seats', 'Front-Axle Lift', 'PCCB Ceramic Brakes', 'Sport Chrono Dial']
  },
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
    dealership: 'Kigali Exotic Vault',
    price: 680000000,
    rentDaily: 3400000,
    tag: 'HYBRID HYPERCAR',
    badge: 'MEMBER EXCLUSIVE',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'Ferrari’s most powerful road car ever produced. Twin-turbo 4.0L V8 paired with three electric motors producing a staggering 986 HP with instant torque vectoring.',
    images: {
      hero: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Assetto Fiorano Package', 'Titanium Exhaust', 'Multimatic Dampers', 'Carbon Wheels', 'Full HUD Cockpit']
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
    dealership: 'Peak Motors, Kigali',
    price: 435000000,
    rentDaily: 2200000,
    tag: 'V10 SYMPHONY',
    badge: 'VERIFIED INSPECTED',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'Designed as a bridge between road comfort and track aggression. Naturally aspirated 5.2-liter V10 engine delivers unadulterated mechanical thrill with rear-wheel steering.',
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
    model: 'AMG G63 Night Edition',
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
    colorName: 'Obsidian Black Metallic / Nappa Bengal Red',
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
    drivetrain: 'Tri-Motor All-Wheel Drive',
    powerHp: 1020,
    accel0to100: '1.99s',
    topSpeed: '322 km/h',
    seats: 5,
    colorName: 'Pearl White Multi-Coat / White Cockpit',
    dealership: 'EcoWheels RW, Kigali',
    price: 168000000,
    rentDaily: 790000,
    tag: 'HYPER ACCELERATION',
    badge: 'ZERO EMISSION',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'Beyond supercar acceleration in a luxurious full-size 5-passenger sedan. Carbon-sleeved rotors maintain peak power output all the way to top speed, with 600 km EPA range.',
    images: {
      hero: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Full Self-Driving Capable', 'Tri-Motor Torque Vectoring', '17-inch Cinematic Display', 'Yoke Steering Option']
  },
  {
    id: 'hn-range-rover-sv',
    brand: 'Land Rover',
    model: 'Range Rover SV Long Wheelbase',
    category: 'suv',
    condition: 'Brand New',
    year: 2026,
    mileage: 35,
    fuel: 'Petrol (Twin-Turbo V8)',
    transmission: '8-Speed Automatic with CommandShift',
    drivetrain: 'Intelligent All-Wheel Drive (iAWD)',
    powerHp: 606,
    accel0to100: '4.3s',
    topSpeed: '261 km/h',
    seats: 4,
    colorName: 'Charente Grey / Semi-Aniline Caraway',
    dealership: 'Kigali Auto Hub',
    price: 310000000,
    rentDaily: 1350000,
    tag: 'FIRST CLASS LUXURY',
    badge: 'FLAGSHIP',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'Unrivaled peerless prestige. Featuring SV Signature Suite with deployable club table, refrigerated console, 24-way heated massage executive seats, and active noise-cancellation speakers in headrests.',
    images: {
      hero: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Executive Class Comfort Plus', 'Ceramic Controls Finish', 'Meridian Signature Sound', 'All-Wheel Steering']
  },
  {
    id: 'hn-bmw-m4-competition',
    brand: 'BMW',
    model: 'M4 Competition xDrive',
    category: 'sedan',
    condition: 'Certified Pre-Owned',
    year: 2024,
    mileage: 12400,
    fuel: 'Petrol (Twin-Turbocharged)',
    transmission: '8-Speed M Steptronic Drivelogic',
    drivetrain: 'M xDrive AWD with 2WD Drift Mode',
    powerHp: 503,
    accel0to100: '3.4s',
    topSpeed: '290 km/h',
    seats: 4,
    colorName: 'Isle of Man Green Metallic',
    dealership: 'Rwanda Rides Ltd',
    price: 152000000,
    rentDaily: 680000,
    tag: 'ULTIMATE DRIVING MACHINE',
    badge: 'VERIFIED INSPECTED',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'Precision engineered for heart-racing dynamics. M TwinPower Turbo inline 6-cylinder engine with carbon bucket racing seats and rear-biased configurable all-wheel drive.',
    images: {
      hero: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['M Carbon Ceramic Brakes', 'M Carbon Bucket Seats', 'Harmon Kardon Audio', 'M Drift Analyser']
  },
  {
    id: 'hn-audi-rs-etron-gt',
    brand: 'Audi',
    model: 'RS e-tron GT Carbon Black',
    category: 'electric',
    condition: 'Brand New',
    year: 2026,
    mileage: 10,
    fuel: '100% Electric (800V Architecture)',
    transmission: '2-Speed Rear / 1-Speed Front',
    drivetrain: 'quattro Electric All-Wheel Drive',
    powerHp: 637,
    accel0to100: '3.1s',
    topSpeed: '250 km/h',
    seats: 4,
    colorName: 'Daytona Grey Pearl Effect',
    dealership: 'EcoWheels RW, Kigali',
    price: 215000000,
    rentDaily: 920000,
    tag: 'ELECTRIC GRAN TURISMO',
    badge: 'NEW ARRIVAL',
    is3dAvailable: true,
    model3dType: 'hypercar',
    description: 'Sculpted by wind tunnel aerodynamics. 800-volt high-speed charging system charges 5% to 80% in just 22.5 minutes, with emotional RS e-sound electronic acoustic sound tuning.',
    images: {
      hero: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['800-Volt Architecture', 'All-Wheel Steering', 'Carbon Roof Package', 'Matrix Laser LED Lights']
  },
  {
    id: 'hn-toyota-lc300',
    brand: 'Toyota',
    model: 'Land Cruiser 300 GR Sport',
    category: 'suv',
    condition: 'Brand New',
    year: 2026,
    mileage: 65,
    fuel: 'Twin-Turbo V6 Diesel',
    transmission: 'Direct Shift 10-Speed Automatic',
    drivetrain: 'Full-Time 4WD with Center & Rear Locks',
    powerHp: 409,
    accel0to100: '6.7s',
    topSpeed: '210 km/h',
    seats: 7,
    colorName: 'Prestige Super White / GR Black Accents',
    dealership: 'Kigali Auto Hub',
    price: 198000000,
    rentDaily: 850000,
    tag: 'UNSTOPPABLE EXPEDITION',
    badge: 'POPULAR CHOICE',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'The master of every African terrain. E-KDSS electronically controlled kinetic dynamic suspension system maximizes wheel articulation across rocky tracks and river crossings.',
    images: {
      hero: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['E-KDSS Suspension System', 'Multi-Terrain Monitor 3D', 'Cool Box Center Console', 'Crawl Control']
  },
  {
    id: 'hn-ford-raptor-r',
    brand: 'Ford',
    model: 'F-150 Raptor R 5.2L V8',
    category: 'truck',
    condition: 'Certified Pre-Owned',
    year: 2025,
    mileage: 8900,
    fuel: 'Supercharged V8 Petrol',
    transmission: '10-Speed SelectShift Automatic',
    drivetrain: 'Electronic Shift-on-Fly 4x4 with 4A',
    powerHp: 700,
    accel0to100: '3.6s',
    topSpeed: '190 km/h',
    seats: 5,
    colorName: 'Code Orange Metallic / Recaro Alcantara',
    dealership: 'Lakeside Motors',
    price: 178000000,
    rentDaily: 750000,
    tag: 'BAJA MONSTER',
    badge: 'VERIFIED INSPECTED',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'Supercharged 5.2L predator V8 engine transplanted from the Mustang Shelby GT500. Features Fox 3.0 Live Valve internal bypass shocks ready to launch over sand dunes and dirt.',
    images: {
      hero: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Fox 3.0 Live Valve Shocks', '37-inch All-Terrain Tires', 'B&O Unleashed 18-Speaker Audio', 'Panther Grille']
  },
  {
    id: 'hn-rivian-r1t',
    brand: 'Rivian',
    model: 'R1T Quad-Motor Adventure',
    category: 'truck',
    condition: 'Brand New',
    year: 2026,
    mileage: 12,
    fuel: '100% Electric Quad-Motor',
    transmission: 'Direct-Drive Dual Gearboxes',
    drivetrain: 'Individual 4-Wheel Motor Torque Vectoring',
    powerHp: 835,
    accel0to100: '3.0s',
    topSpeed: '201 km/h',
    seats: 5,
    colorName: 'Rivian Blue / Ocean Coast Wood',
    dealership: 'EcoWheels RW, Kigali',
    price: 158000000,
    rentDaily: 690000,
    tag: 'ELECTRIC EXPLORER',
    badge: 'ZERO EMISSION',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'The world’s first electric adventure truck. Features a pass-through gear tunnel, built-in air compressor, pull-out camp kitchen, and 3-foot wading depth capability.',
    images: {
      hero: 'https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Pass-Through Gear Tunnel', 'Air Suspension 15" Clearance', 'Built-in Air Compressor', 'Camp Kitchen Capable']
  },
  {
    id: 'hn-mercedes-v-class',
    brand: 'Mercedes-Benz',
    model: 'V300d Maybach Executive VIP',
    category: 'van',
    condition: 'Brand New',
    year: 2026,
    mileage: 80,
    fuel: 'Diesel Biturbo',
    transmission: '9G-TRONIC Automatic',
    drivetrain: 'Rear-Wheel Drive with AIRMATIC',
    powerHp: 239,
    accel0to100: '7.8s',
    topSpeed: '220 km/h',
    seats: 6,
    colorName: 'Obsidian Black / Porcelain Silk Leather',
    dealership: 'Kigali Auto Hub',
    price: 145000000,
    rentDaily: 580000,
    tag: 'PRIVATE JET ON WHEELS',
    badge: 'MEMBER EXCLUSIVE',
    is3dAvailable: true,
    model3dType: 'suv',
    description: 'Configured for heads of state, VIP delegations, and business executives. Features first-class fully reclining captain chairs with footrests, champagne cooler, and fiber-optic starlight headliner.',
    images: {
      hero: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Starlight Fiber Optic Ceiling', 'First-Class Recliner Seats', 'Champagne Chiller', '4K Privacy Partition']
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
    dealership: 'Peak Motors, Kigali',
    price: 43000000,
    rentDaily: 230000,
    tag: 'MOTOGP SOUL',
    badge: 'TRACK READY',
    is3dAvailable: false,
    description: 'Direct transfer of MotoGP technology to the street. Equipped with aerodynamic double-profile carbon winglets that generate 37 kg of downforce at 300 km/h and electronically managed Öhlins suspension.',
    images: {
      hero: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Öhlins Smart EC 2.0', 'Cornering ABS EVO', 'Ducati Traction Control DTC EVO 3', 'Carbon Wings']
  },
  {
    id: 'hn-bmw-r1250gs',
    brand: 'BMW Motorrad',
    model: 'R 1250 GS Adventure Trophy',
    category: 'motorcycle',
    condition: 'Certified Pre-Owned',
    year: 2024,
    mileage: 10400,
    fuel: 'Petrol (Boxer Twin)',
    transmission: '6-Speed with Shift Assistant Pro',
    drivetrain: 'Shaft Drive',
    powerHp: 136,
    accel0to100: '3.6s',
    topSpeed: '220 km/h',
    seats: 2,
    colorName: 'Gravity Blue Metallic / Racing Red',
    dealership: 'Peak Motors, Kigali',
    price: 29500000,
    rentDaily: 150000,
    tag: 'GLOBETROTTER',
    badge: 'VERIFIED INSPECTED',
    is3dAvailable: false,
    description: 'The king of globe-trotting adventure travel. 30-liter fuel capacity gives 600 km touring range, paired with Dynamic Electronic Suspension Adjustment and aluminum pannier cases.',
    images: {
      hero: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['Dynamic ESA Suspension', 'Shift Assistant Pro', 'Aluminum Touring Panniers', 'Heated Grips & Seats']
  },
  {
    id: 'hn-vespa-elettrica',
    brand: 'Vespa',
    model: 'Elettrica 70 km/h Special',
    category: 'motorcycle',
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: '100% Electric',
    transmission: 'Automatic Twist & Go',
    drivetrain: 'Direct Hub Motor',
    powerHp: 5.4,
    accel0to100: 'N/A (70 km/h Top)',
    topSpeed: '70 km/h',
    seats: 2,
    colorName: 'Azzurro Elettrico Italian Blue',
    dealership: 'Urban Cycle Co.',
    price: 9800000,
    rentDaily: 48000,
    tag: 'ICONIC COMMUTER',
    badge: 'ZERO EMISSION',
    is3dAvailable: false,
    description: 'Silent, zero emission Italian style. Kinetic energy recovery system (KERS) recharges battery during deceleration, offering 100 km range per charge from standard home socket.',
    images: {
      hero: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['KERS Regenerative Braking', '4.3-inch Color TFT Display', 'Under-Seat Helmet Storage', 'Bluetooth Connectivity']
  },
  {
    id: 'hn-trek-supercaliber',
    brand: 'Trek',
    model: 'Supercaliber 9.9 XX1 AXS',
    category: 'bicycle',
    condition: 'Brand New',
    year: 2026,
    mileage: 0,
    fuel: 'Human Power',
    transmission: 'Wireless SRAM XX1 Eagle AXS 12-Speed',
    drivetrain: 'Carbon Chain Drive',
    powerHp: 0.5,
    accel0to100: 'Pure Athlete',
    topSpeed: '60 km/h',
    seats: 1,
    colorName: 'Viper Red / Radioactive Yellow Fade',
    dealership: 'Urban Cycle Co.',
    price: 14800000,
    rentDaily: 65000,
    tag: 'WORLD CUP WINNER',
    badge: 'NEW ARRIVAL',
    is3dAvailable: false,
    description: 'The revolutionary World Cup cross-country race bike. Features Trek’s exclusive IsoStrut structural rear suspension shock integrated directly into the OCLV Mountain Carbon frame.',
    images: {
      hero: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['OCLV Mountain Carbon', 'IsoStrut Integrated Shock', 'Bontrager Kovee XXX Carbon Wheels', 'Wireless Electronic Shifting']
  },
  {
    id: 'hn-mercedes-actros',
    brand: 'Mercedes-Benz',
    model: 'Actros 3340 Heavy Tipper 6x4',
    category: 'truck',
    condition: 'Pre-Owned',
    year: 2023,
    mileage: 82000,
    fuel: 'Heavy Turbo Diesel',
    transmission: 'Mercedes PowerShift 3',
    drivetrain: '6x4 Heavy Dual Axle',
    powerHp: 394,
    accel0to100: 'Heavy Haul',
    topSpeed: '110 km/h',
    seats: 2,
    colorName: 'Steel Silver / Heavy-Duty Armor',
    dealership: 'Lakeside Motors',
    price: 118000000,
    rentDaily: 420000,
    tag: 'HEAVY COMMERCIAL',
    badge: 'COMMERCIAL GRADE',
    is3dAvailable: false,
    description: 'Engineered for major construction, mining, and continental transport. 20-tonne payload capacity with reinforced tipper bed, retarder brake system, and sleeper cabin.',
    images: {
      hero: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['20-Tonne Tipper Capacity', 'Mercedes PowerShift 3', 'Retarder Engine Brake', 'Reinforced Chassis Rails']
  },
  {
    id: 'hn-toyota-hiace-vip',
    brand: 'Toyota',
    model: 'HiAce Executive VIP 12-Seater',
    category: 'van',
    condition: 'Brand New',
    year: 2026,
    mileage: 110,
    fuel: 'Turbo Diesel',
    transmission: '6-Speed Automatic',
    drivetrain: 'Rear-Wheel Drive',
    powerHp: 177,
    accel0to100: '11.5s',
    topSpeed: '165 km/h',
    seats: 12,
    colorName: 'Super White / Executive Beige Leather',
    dealership: 'Rwanda Rides Ltd',
    price: 69000000,
    rentDaily: 195000,
    tag: 'TOUR & TRAVEL',
    badge: 'POPULAR CHOICE',
    is3dAvailable: false,
    description: 'The golden standard for African safari tours, airport transfers, and corporate shuttles. Configured with 12 reclining captain leather seats with high-roof headroom and individual AC vents.',
    images: {
      hero: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rear: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    },
    features: ['12 Individual Recliners', 'Dual High-Output Climate Control', 'Large Luggage Bay', 'Electric Sliding Door']
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
