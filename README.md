# HURANOW MOTORS 🏎️⚡
### The Ultimate Nike-Inspired Automotive Marketplace & Interactive 3D Cockpit Studio

> **"Unleash the Extraordinary."** Buy, rent, and sell any vehicle — from track-focused hypercars and rugged 4x4 SUVs to zero-emission electric vehicles, superbikes, and carbon race bicycles.

[![Live WebGL 3D](https://img.shields.io/badge/WebGL-Three.js_r128-red.svg)](https://github.com/am2aidi/vehichels)
[![Design](https://img.shields.io/badge/Aesthetics-Nike.com_Luxury_Automotive-black.svg)](https://github.com/am2aidi/vehichels)
[![Frontend](https://img.shields.io/badge/Architecture-Clean_Zero--Build_Frontend-white.svg)](https://github.com/am2aidi/vehichels)

---

## 🌟 Key Features

### 1. 🏎️ Next-Gen 3D Cockpit & "Scramble / Explode" Studio
- **360° Exterior Orbit & Tilt**: Inspect vehicles with realistic studio reflection floors, soft contact shadows, and ACES Filmic tone mapping.
- **Immersive Interior Cockpit Exploration**: Step inside the driver’s seat, digital telemetry dashboard, passenger seat, or rear cabin with full 360° cabin lookaround.
- **💥 Scramble / Explode Parts Engine**: Click **"💥 Scramble / Explode Parts"** to watch the aerodynamic carbon chassis, butterfly scissor doors, hood, rear swan-neck wing, mid-mounted V8 engine block, glowing 800V hybrid battery pack, and bucket seats separate in fluid 3D animation.
- **Interactive 3D Tech Hotspots**: Floating badges dynamically pinned to the exploded components display detailed telemetry (Twin-Turbo V8 hybrid core, Carbon Ceramic Brakes, Active DRS Aerodynamics, Carbon Cockpit Monocoque).
- **Real-Time Configurator**:
  - Exterior Paint: Apex Guards Red, Frozen Pearl White, Stealth Obsidian, Miami Cyber Cyan, Acid Lime, Nardo Grey, Sunburst Gold.
  - Interior Leather: Onyx Black, Cognac Tan, Crimson Racing Red.
  - Wheels: Forged Sport, Classic Multi-Spoke, Carbon Turbine Aero.
  - Laser LED Headlights On/Off & Auto-Spin controls.

### 2. ⚡ High-Definition Fleet with Real Public Imagery
Curated with authentic, public high-definition automotive photography:
- **Hypercars & Supercars**: Porsche 911 GT3 RS (992), Ferrari SF90 Stradale Assetto Fiorano, Lamborghini Huracán Tecnica V10.
- **Luxury SUVs & Off-Roaders**: Mercedes-AMG G63 "G-Wagon", Range Rover SV Long Wheelbase, Toyota Land Cruiser 300 GR Sport.
- **Electric & Hybrids**: Tesla Model S Plaid Tri-Motor (1,020 HP · 1.99s 0-100), Audi RS e-tron GT Carbon, Rivian R1T Quad-Motor Adventure.
- **Performance Sedans**: BMW M4 Competition xDrive.
- **Pickups & Haulers**: Ford F-150 Raptor R 5.2L Supercharged V8, Mercedes-Benz Actros 3340 Heavy Tipper.
- **VIP Shuttles & Vans**: Mercedes-Benz V-Class Maybach VIP, Toyota HiAce VIP Executive 12-Seater.
- **Superbikes, Scooters & Bicycles**: Ducati Panigale V4 S Corse, BMW R 1250 GS Trophy, Vespa Elettrica, Trek Supercaliber 9.9 XX1 AXS Carbon.

### 3. 🏁 Buy, Rent, and Sell Any Vehicle
- **Buy (Brand New 2026 & Certified Pre-Owned)**: Choose between a 10% VIP reservation deposit or full upfront vehicle payment.
- **Rent (Daily / Weekly / Monthly)**: Interactive rental duration calculator with custom pickup date picker, multi-day discounts, and instant rate estimation.
- **Sell / List Portal**: Individuals and dealerships can list any vehicle with custom specifications, prices, and public photos — instantly live on the marketplace.

### 4. 👟 Nike.com Athletic E-Commerce Aesthetic
- High-impact condensed typography (`Barlow Condensed` 900 + `Poppins`).
- Infinite ticker announcement bar with promotional guarantees.
- Dynamic filtering by purchase type, condition, vehicle category, dealership, and live search.
- Multi-currency switcher (🇷🇼 RWF, 🇺🇸 USD, 🇪🇺 EUR) with real-time recalculation across the entire shop.
- Saved Garage (Wishlist) & Slide-over Cart Drawers.
- Nike-style split diagonal sliding Auth modal (Sign In / Join Huranow Club).
- Multi-method checkout supporting Visa/Mastercard (with Luhn check), MTN Mobile Money (MoMo), Airtel Money, and Apple Pay, culminating in a printable digital certificate receipt with unique allocation reference.

---

## 📁 Repository Structure

```
cars/
├── index.html                   # Master application document (Nike-style shop & 3D embed)
├── css/
│   ├── style.css                # Nike.com styling, typography, layout, modals, drawers
│   └── viewer3d.css             # 3D Studio HUD, hotspots, camera switchers, swatches
├── js/
│   ├── data.js                  # Comprehensive vehicle fleet dataset, specs, pricing, storage
│   ├── three-engine.js          # WebGL Three.js 3D Studio, Scramble engine, Cockpit camera
│   └── app.js                   # Application state, filters, search, auth, cart, checkout
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start / Local Preview

Because this is a zero-dependency, pure front-end application, you can run it immediately without compilation steps:

### Option A: Open Directly
Double-click `index.html` in your file explorer to open it in Google Chrome, Safari, Firefox, or Microsoft Edge.

### Option B: Local HTTP Server (Recommended for WebGL)
Using Node.js:
```bash
npx serve .
# or
npx http-server .
```

Using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

---

## 🛠️ Built With
- **HTML5 & CSS3** (Custom Properties, Flexbox, CSS Grid, Glassmorphism)
- **JavaScript (ES6+)** (Vanilla JS modular architecture, LocalStorage persistence)
- **Three.js (r128)** (WebGL rendering, procedural geometries, PBR Physical materials, Raycasting, ACES Filmic Tone Mapping)
- **Google Fonts** (Barlow Condensed & Poppins)

---

## 📄 License
© 2026 HURANOW MOTORS INC. All rights reserved.
