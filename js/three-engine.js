/**
 * HURANOW MOTORS - Advanced 3D Automotive Studio
 * Features:
 * - High-Fidelity 3D Vehicle Models (Hypercar, SUV, Electric Speedster)
 * - 360 Exterior Orbit & Cinematic Lighting
 * - Immersive Interior Cockpit (Driver Seat, Dashboard, Passenger, Free 360 Cabin Look)
 * - "SCRAMBLE / EXPLODE" Mode (Smooth animated parts separation with 3D tech hotspots)
 * - Real-Time Configurator (Body Paint, Interior Leather, Brake Calipers, Wheels, Headlights)
 */

class Huranow3DStudio {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.THREE = window.THREE;
    if (!this.THREE) {
      console.error('Three.js is required for 3D Studio');
      return;
    }

    this.state = {
      modelType: 'hypercar', // 'hypercar', 'suv', 'speedster'
      viewMode: 'outside',   // 'outside', 'cockpit'
      cockpitPreset: 'driver', // 'driver', 'dash', 'passenger', 'rear'
      isExploded: false,
      explodeProgress: 0, // 0 to 1
      autoRotate: true,
      autoRotateSpeed: 0.35,
      headlightsOn: true,
      studioTheme: 'dark', // 'dark', 'light'
      paintColor: '#d4162f',
      interiorColor: '#1d1d20',
      caliperColor: '#ff2233',
      wheelStyle: 'sport', // 'sport', 'classic', 'aero'
      selectedHotspot: null
    };

    // Camera angles
    this.orbit = {
      theta: 0.8,
      phi: 0.32,
      radius: 7.2,
      minRadius: 3.8,
      maxRadius: 13.0
    };

    // Cockpit orientation
    this.cockpitLook = {
      yaw: -Math.PI / 2,
      pitch: -0.05,
      fov: 78
    };

    // Camera positions inside the cabin
    this.cockpitPresets = {
      driver: { pos: [-0.42, 1.12, 0.12], yaw: -Math.PI / 2, pitch: -0.05, fov: 78 },
      dash: { pos: [-0.38, 1.05, 0.25], yaw: -Math.PI / 2 - 0.45, pitch: -0.22, fov: 68 },
      passenger: { pos: [0.42, 1.12, 0.12], yaw: -Math.PI / 2, pitch: -0.05, fov: 78 },
      rear: { pos: [0, 1.16, -0.92], yaw: -Math.PI / 2, pitch: 0.02, fov: 82 }
    };

    this.parts = {};
    this.hotspots = [];
    this.pointerMap = new Map();
    this.pinchDist = 0;
    this.clock = new this.THREE.Clock();

    this.init();
  }

  init() {
    const T = this.THREE;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Canvas & WebGL Renderer
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'studio-webgl-canvas';
    this.container.appendChild(this.canvas);

    try {
      this.renderer = new T.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      this.container.innerHTML = `<div class="studio-fallback-msg">WebGL 3D is not supported on this browser or GPU.</div>`;
      return;
    }

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;

    // Scene
    this.scene = new T.Scene();
    this.scene.background = new T.Color(0x060608);
    this.scene.fog = new T.FogExp2(0x060608, 0.035);

    // Camera
    this.camera = new T.PerspectiveCamera(45, width / height, 0.08, 120);
    this.camera.position.set(6, 3, 5);

    // Car Root Group
    this.carRoot = new T.Group();
    this.scene.add(this.carRoot);

    // Setup Lighting & Studio Environment
    this.setupLighting();
    this.setupEnvironment();

    // Build the 3D Vehicle
    this.buildVehicle(this.state.modelType);

    // Hotspots Overlay Layer
    this.setupHotspotsOverlay();

    // Event Listeners
    this.bindEvents();

    // Start Render Loop
    this.renderLoop();
  }

  setupLighting() {
    const T = this.THREE;
    this.lights = new T.Group();
    this.scene.add(this.lights);

    // Ambient light
    this.ambientLight = new T.AmbientLight(0xffffff, 0.65);
    this.lights.add(this.ambientLight);

    // Main Key Light
    this.keyLight = new T.DirectionalLight(0xffffff, 1.4);
    this.keyLight.position.set(7, 9, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -5;
    this.keyLight.shadow.camera.right = 5;
    this.keyLight.shadow.camera.top = 5;
    this.keyLight.shadow.camera.bottom = -5;
    this.keyLight.shadow.bias = -0.0005;
    this.lights.add(this.keyLight);

    // Rim / Backlight
    this.rimLight = new T.DirectionalLight(0x70aaff, 0.9);
    this.rimLight.position.set(-8, 5, -6);
    this.lights.add(this.rimLight);

    // Soft front fill
    this.fillLight = new T.DirectionalLight(0xfff0dd, 0.5);
    this.fillLight.position.set(0, 3, 8);
    this.lights.add(this.fillLight);

    // Cockpit internal ambient point light
    this.cabinLight = new T.PointLight(0xffffff, 0.35, 4.5);
    this.cabinLight.position.set(0, 1.25, 0.1);
    this.carRoot.add(this.cabinLight);
  }

  setupEnvironment() {
    const T = this.THREE;
    this.envGroup = new T.Group();
    this.scene.add(this.envGroup);

    // Glossy Floor Mirror Plane
    const floorGeo = new T.CircleGeometry(24, 64);
    this.floorMat = new T.MeshStandardMaterial({
      color: 0x08080a,
      roughness: 0.18,
      metalness: 0.75
    });
    this.floorMesh = new T.Mesh(floorGeo, this.floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -0.01;
    this.floorMesh.receiveShadow = true;
    this.envGroup.add(this.floorMesh);

    // High-tech Floor Grid
    this.grid = new T.GridHelper(36, 36, 0x242430, 0x121218);
    this.grid.position.y = 0.002;
    this.envGroup.add(this.grid);

    // Soft Contact Shadow Decal
    const shadowGeo = new T.PlaneGeometry(6.4, 3.2);
    const shadowMat = new T.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    this.contactShadow = new T.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = 0.005;
    this.envGroup.add(this.contactShadow);
  }

  /**
   * Procedural High-Fidelity 3D Car Construction
   * Creates discrete groups for:
   * Chassis, Hood, Doors (L/R), Roof, Active Wing, Splitter,
   * Engine Block + Battery Core, Interior Seats + Dash, 4 Wheels
   */
  buildVehicle(type = 'hypercar') {
    const T = this.THREE;

    // Clear existing car parts
    while (this.carRoot.children.length > 0) {
      const obj = this.carRoot.children[0];
      if (obj === this.cabinLight) {
        this.carRoot.remove(obj);
        continue;
      }
      this.carRoot.remove(obj);
    }
    if (this.cabinLight) this.carRoot.add(this.cabinLight);

    this.parts = {};

    // Base Materials
    this.materials = {
      paint: new T.MeshPhysicalMaterial({
        color: new T.Color(this.state.paintColor),
        metalness: 0.6,
        roughness: 0.22,
        clearcoat: 0.95,
        clearcoatRoughness: 0.12,
        reflectivity: 0.9
      }),
      carbon: new T.MeshStandardMaterial({
        color: 0x141416,
        roughness: 0.45,
        metalness: 0.8
      }),
      glass: new T.MeshPhysicalMaterial({
        color: 0x7eb3d4,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.88,
        transparent: true,
        opacity: 0.38,
        depthWrite: false
      }),
      interior: new T.MeshStandardMaterial({
        color: new T.Color(this.state.interiorColor),
        roughness: 0.85,
        metalness: 0.1
      }),
      leatherStitch: new T.MeshStandardMaterial({
        color: 0xaa2030,
        roughness: 0.7
      }),
      chrome: new T.MeshStandardMaterial({
        color: 0xd8dde4,
        metalness: 0.95,
        roughness: 0.1
      }),
      tireRubber: new T.MeshStandardMaterial({
        color: 0x111113,
        roughness: 0.92,
        metalness: 0.05
      }),
      caliper: new T.MeshStandardMaterial({
        color: new T.Color(this.state.caliperColor),
        roughness: 0.3,
        metalness: 0.5
      }),
      engineBlock: new T.MeshStandardMaterial({
        color: 0x282a30,
        metalness: 0.85,
        roughness: 0.35
      }),
      batteryCore: new T.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 1.4,
        roughness: 0.2
      }),
      headlightEmissive: new T.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.2
      }),
      taillightEmissive: new T.MeshStandardMaterial({
        color: 0xff0020,
        emissive: 0xff0020,
        emissiveIntensity: 2.5
      }),
      screenEmissive: new T.MeshStandardMaterial({
        color: 0x081525,
        emissive: 0x0d72ff,
        emissiveIntensity: 1.1
      })
    };

    // Sub-parts definition with resting and scrambled target offsets
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: 1.5, rotX: 0.35 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 2.1, z: 0 });
    this.createSubPart('doorL', new T.Group(), { x: 0, y: 0, z: 0 }, { x: -1.35, y: 1.25, z: 0.1, rotZ: 0.45, rotY: -0.2 });
    this.createSubPart('doorR', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 1.35, y: 1.25, z: 0.1, rotZ: -0.45, rotY: 0.2 });
    this.createSubPart('spoiler', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.4, z: -1.4, rotX: -0.2 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.6, z: -0.4 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.8, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.42, y: 0.38, z: 1.4 }, { x: -2.3, y: 0.38, z: 1.4 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.42, y: 0.38, z: 1.4 }, { x: 2.3, y: 0.38, z: 1.4 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.42, y: 0.4, z: -1.35 }, { x: -2.4, y: 0.4, z: -1.35 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.42, y: 0.4, z: -1.35 }, { x: 2.4, y: 0.4, z: -1.35 });

    // Geometry Helpers
    const ext = (pts, d) => {
      const sh = new T.Shape();
      pts.forEach((p, i) => i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1]));
      const g = new T.ExtrudeGeometry(sh, {
        depth: d,
        bevelEnabled: true,
        bevelSize: 0.04,
        bevelThickness: 0.04,
        bevelSegments: 3
      });
      g.translate(0, 0, -d / 2);
      return g;
    };

    // 1. CHASSIS LOWER BODY & MONOCOQUE
    const chassisPts = [
      [-2.35, 0.32], [2.35, 0.32], [2.35, 0.65], [1.45, 0.84],
      [-1.8, 0.86], [-2.35, 0.72]
    ];
    // Rotate to match vehicle Z length
    const chassisGeo = ext(chassisPts, 1.82);
    chassisGeo.rotateY(Math.PI / 2);
    const chassisMesh = new T.Mesh(chassisGeo, this.materials.paint);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    this.parts.chassis.group.add(chassisMesh);

    // Front Diffuser & Splitter
    const splitter = new T.Mesh(new T.BoxGeometry(1.95, 0.06, 0.7), this.materials.carbon);
    splitter.position.set(0, 0.22, 2.25);
    this.parts.chassis.group.add(splitter);

    // Rear Aero Diffuser Fins
    const rearDiffuser = new T.Mesh(new T.BoxGeometry(1.88, 0.18, 0.6), this.materials.carbon);
    rearDiffuser.position.set(0, 0.28, -2.25);
    this.parts.chassis.group.add(rearDiffuser);
    for (let f = -0.7; f <= 0.7; f += 0.35) {
      const fin = new T.Mesh(new T.BoxGeometry(0.04, 0.22, 0.55), this.materials.carbon);
      fin.position.set(f, 0.26, -2.25);
      this.parts.chassis.group.add(fin);
    }

    // 2. HOOD (Front nose, vents, headlights)
    const hoodMesh = new T.Mesh(new T.BoxGeometry(1.72, 0.12, 1.45), this.materials.paint);
    hoodMesh.position.set(0, 0.76, 1.48);
    hoodMesh.castShadow = true;
    this.parts.hood.group.add(hoodMesh);

    // Carbon Hood Aero Extractors
    const hoodVent1 = new T.Mesh(new T.BoxGeometry(0.42, 0.04, 0.55), this.materials.carbon);
    hoodVent1.position.set(-0.45, 0.83, 1.4);
    const hoodVent2 = new T.Mesh(new T.BoxGeometry(0.42, 0.04, 0.55), this.materials.carbon);
    hoodVent2.position.set(0.45, 0.83, 1.4);
    this.parts.hood.group.add(hoodVent1, hoodVent2);

    // Sleek LED Laser Headlights
    [-0.72, 0.72].forEach(x => {
      const hl = new T.Mesh(new T.BoxGeometry(0.36, 0.08, 0.22), this.materials.headlightEmissive);
      hl.position.set(x, 0.66, 2.24);
      hl.rotation.y = (x > 0 ? -0.2 : 0.2);
      this.parts.hood.group.add(hl);
    });

    // 3. ROOF & GLASS CANOPY
    const glassPts = [[-1.2, 0.84], [-0.75, 1.46], [0.82, 1.46], [1.32, 0.84]];
    const glassGeo = ext(glassPts, 1.58);
    glassGeo.rotateY(Math.PI / 2);
    const glassMesh = new T.Mesh(glassGeo, this.materials.glass);
    glassMesh.castShadow = true;
    this.parts.roof.group.add(glassMesh);

    // Carbon Roof Spine Panel
    const roofPanel = new T.Mesh(new T.BoxGeometry(1.48, 0.05, 1.45), this.materials.paint);
    roofPanel.position.set(0, 1.48, 0.04);
    this.parts.roof.group.add(roofPanel);

    // 4. SCISSOR DOORS (Left & Right)
    const doorGeo = new T.BoxGeometry(0.12, 0.68, 1.35);
    const doorLMesh = new T.Mesh(doorGeo, this.materials.paint);
    doorLMesh.position.set(-0.89, 0.82, 0.05);
    this.parts.doorL.group.add(doorLMesh);

    // Door Mirror L
    const mirrorL = new T.Mesh(new T.BoxGeometry(0.24, 0.1, 0.12), this.materials.carbon);
    mirrorL.position.set(-1.08, 1.05, 0.65);
    this.parts.doorL.group.add(mirrorL);

    const doorRMesh = new T.Mesh(doorGeo, this.materials.paint);
    doorRMesh.position.set(0.89, 0.82, 0.05);
    this.parts.doorR.group.add(doorRMesh);

    // Door Mirror R
    const mirrorR = new T.Mesh(new T.BoxGeometry(0.24, 0.1, 0.12), this.materials.carbon);
    mirrorR.position.set(1.08, 1.05, 0.65);
    this.parts.doorR.group.add(mirrorR);

    // 5. ACTIVE REAR WING / SPOILER & TAILLIGHTS
    const wingBlade = new T.Mesh(new T.BoxGeometry(1.98, 0.05, 0.44), this.materials.carbon);
    wingBlade.position.set(0, 1.35, -2.15);
    this.parts.spoiler.group.add(wingBlade);

    // Wing Uprights / Pylons (Swan-Neck)
    [-0.55, 0.55].forEach(x => {
      const pylon = new T.Mesh(new T.BoxGeometry(0.04, 0.58, 0.28), this.materials.carbon);
      pylon.position.set(x, 1.08, -2.05);
      pylon.rotation.x = 0.25;
      this.parts.spoiler.group.add(pylon);
    });

    // Continuous Full-Width OLED Rear Lightbar
    const tailBar = new T.Mesh(new T.BoxGeometry(1.82, 0.06, 0.08), this.materials.taillightEmissive);
    tailBar.position.set(0, 0.74, -2.32);
    this.parts.spoiler.group.add(tailBar);

    // Dual Center Titanium Exhaust Pipes
    [-0.09, 0.09].forEach(x => {
      const exhaust = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.28, 20), this.materials.chrome);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(x, 0.52, -2.28);
      this.parts.chassis.group.add(exhaust);
    });

    // 6. MID-MOUNTED ENGINE BLOCK & GLOWING HYBRID CORE
    const engBlock = new T.Mesh(new T.BoxGeometry(0.88, 0.48, 0.95), this.materials.engineBlock);
    engBlock.position.set(0, 0.72, -0.75);
    this.parts.engine.group.add(engBlock);

    // Intake Manifolds
    [-0.24, 0.24].forEach(x => {
      const manifold = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.8, 14), this.materials.chrome);
      manifold.rotation.x = Math.PI / 2;
      manifold.position.set(x, 1.0, -0.75);
      this.parts.engine.group.add(manifold);
    });

    // High-Voltage 800V Hybrid Battery Module (Glowing Core)
    const batt = new T.Mesh(new T.BoxGeometry(0.92, 0.2, 0.7), this.materials.batteryCore);
    batt.position.set(0, 0.38, -0.15);
    this.parts.engine.group.add(batt);

    // 7. DETAILED COCKPIT (Driver & Passenger Racing Seats, Dashboard, Steering Wheel, Displays)
    // Floorpan
    const floorPan = new T.Mesh(new T.BoxGeometry(1.58, 0.06, 1.7), this.materials.interior);
    floorPan.position.set(0, 0.42, 0.08);
    this.parts.cockpit.group.add(floorPan);

    // Center Console
    const consoleMesh = new T.Mesh(new T.BoxGeometry(0.28, 0.32, 1.25), this.materials.carbon);
    consoleMesh.position.set(0, 0.62, 0.1);
    this.parts.cockpit.group.add(consoleMesh);

    // Gear Shifter & Start Engine Button
    const shifter = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.14, 12), this.materials.chrome);
    shifter.position.set(0, 0.82, 0.2);
    const startBtn = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.02, 16), this.materials.caliper);
    startBtn.position.set(0, 0.8, 0.35);
    this.parts.cockpit.group.add(shifter, startBtn);

    // Curved Digital Instrument Cockpit Dashboard
    const dashBase = new T.Mesh(new T.BoxGeometry(1.52, 0.32, 0.58), this.materials.interior);
    dashBase.position.set(0, 0.88, 0.78);
    this.parts.cockpit.group.add(dashBase);

    // Driver Digital Screen Cluster (Speedometer / Tachometer)
    const driverScreen = new T.Mesh(new T.BoxGeometry(0.48, 0.18, 0.04), this.materials.screenEmissive);
    driverScreen.position.set(-0.42, 1.04, 0.68);
    driverScreen.rotation.y = 0.06;
    this.parts.cockpit.group.add(driverScreen);

    // Central Cinematic Touchscreen
    const centerScreen = new T.Mesh(new T.BoxGeometry(0.46, 0.3, 0.04), this.materials.screenEmissive);
    centerScreen.position.set(0, 0.95, 0.74);
    centerScreen.rotation.x = -0.25;
    this.parts.cockpit.group.add(centerScreen);

    // Formula-Style Racing Steering Wheel
    const wheelRim = new T.Mesh(new T.TorusGeometry(0.18, 0.024, 12, 32), this.materials.carbon);
    wheelRim.position.set(-0.42, 1.0, 0.44);
    wheelRim.rotation.x = -0.25;
    const wheelHub = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.04, 16), this.materials.carbon);
    wheelHub.position.set(-0.42, 1.0, 0.44);
    wheelHub.rotation.x = Math.PI / 2 - 0.25;
    const wheelShaft = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 0.35, 12), this.materials.chrome);
    wheelShaft.position.set(-0.42, 0.94, 0.58);
    wheelShaft.rotation.x = Math.PI / 2 - 0.25;
    this.parts.cockpit.group.add(wheelRim, wheelHub, wheelShaft);

    // Two Carbon Bucket Racing Seats (Driver & Passenger)
    const buildSeat = (x) => {
      const seatGroup = new T.Group();
      // Seat Cushion
      const cushion = new T.Mesh(new T.BoxGeometry(0.52, 0.15, 0.56), this.materials.interior);
      cushion.position.set(x, 0.55, 0.1);
      // Backrest
      const back = new T.Mesh(new T.BoxGeometry(0.5, 0.68, 0.12), this.materials.interior);
      back.position.set(x, 0.92, -0.16);
      back.rotation.x = 0.18;
      // Headrest
      const head = new T.Mesh(new T.BoxGeometry(0.28, 0.18, 0.1), this.materials.interior);
      head.position.set(x, 1.34, -0.22);
      // Red Harness Accents
      const harness1 = new T.Mesh(new T.BoxGeometry(0.06, 0.65, 0.02), this.materials.leatherStitch);
      harness1.position.set(x - 0.12, 0.92, -0.09);
      harness1.rotation.x = 0.18;
      const harness2 = new T.Mesh(new T.BoxGeometry(0.06, 0.65, 0.02), this.materials.leatherStitch);
      harness2.position.set(x + 0.12, 0.92, -0.09);
      harness2.rotation.x = 0.18;
      seatGroup.add(cushion, back, head, harness1, harness2);
      return seatGroup;
    };
    this.parts.cockpit.group.add(buildSeat(-0.42)); // Driver seat
    this.parts.cockpit.group.add(buildSeat(0.42));  // Passenger seat

    // 8. FOUR COMPLETE WHEELS (Tire, Rim, Drilled Brake Rotor, Colored Caliper)
    this.spokesList = [];
    const buildWheelAssembly = (isLeft) => {
      const g = new T.Group();
      // Rubber Tire
      const tire = new T.Mesh(new T.CylinderGeometry(0.39, 0.39, 0.28, 36), this.materials.tireRubber);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      g.add(tire);

      // Alloy Rim Barrel
      const rim = new T.Mesh(new T.CylinderGeometry(0.27, 0.27, 0.29, 32), this.materials.chrome);
      rim.rotation.z = Math.PI / 2;
      g.add(rim);

      // Drilled Carbon-Ceramic Brake Disc
      const disc = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.03, 28), this.materials.carbon);
      disc.rotation.z = Math.PI / 2;
      g.add(disc);

      // Monobloc Brake Caliper
      const cal = new T.Mesh(new T.BoxGeometry(0.12, 0.18, 0.08), this.materials.caliper);
      cal.position.set(isLeft ? 0.03 : -0.03, 0.14, 0);
      g.add(cal);

      // Rim Face Spokes
      for (let s = 0; s < 5; s++) {
        const spoke = new T.Mesh(new T.BoxGeometry(0.04, 0.52, 0.3), this.materials.chrome);
        spoke.rotation.x = s * (Math.PI / 5);
        this.spokesList.push(spoke);
        g.add(spoke);
      }

      return g;
    };

    this.parts.wheelFL.group.add(buildWheelAssembly(true));
    this.parts.wheelFR.group.add(buildWheelAssembly(false));
    this.parts.wheelRL.group.add(buildWheelAssembly(true));
    this.parts.wheelRR.group.add(buildWheelAssembly(false));

    // Update Hotspot Positions
    this.updateHotspotAnchors();
  }

  createSubPart(name, group, restPos, explodeDelta) {
    group.position.set(restPos.x, restPos.y, restPos.z);
    this.carRoot.add(group);
    this.parts[name] = {
      group,
      rest: {
        x: restPos.x,
        y: restPos.y,
        z: restPos.z,
        rotX: restPos.rotX || 0,
        rotY: restPos.rotY || 0,
        rotZ: restPos.rotZ || 0
      },
      target: {
        x: restPos.x + (explodeDelta.x || 0),
        y: restPos.y + (explodeDelta.y || 0),
        z: restPos.z + (explodeDelta.z || 0),
        rotX: (restPos.rotX || 0) + (explodeDelta.rotX || 0),
        rotY: (restPos.rotY || 0) + (explodeDelta.rotY || 0),
        rotZ: (restPos.rotZ || 0) + (explodeDelta.rotZ || 0)
      }
    };
  }

  setupHotspotsOverlay() {
    this.hotspotContainer = document.createElement('div');
    this.hotspotContainer.className = 'studio-hotspots-overlay';
    this.container.appendChild(this.hotspotContainer);

    this.hotspotDefs = [
      {
        id: 'powertrain',
        title: 'TWIN-TURBO V8 HYBRID CORE',
        subtitle: '830 HP · 9,000 RPM · 800V Architecture',
        desc: 'Mid-mounted twin-turbocharged power unit paired with triple axial-flux electric motors providing torque vectoring and sub-2.5s acceleration.',
        badge: 'ENGINE',
        pos: [0, 2.4, -0.6]
      },
      {
        id: 'aerodynamics',
        title: 'ACTIVE CARBON DRS WING',
        subtitle: '860 kg Downforce at 285 km/h',
        desc: 'Hydraulically actuated dual-element swan-neck carbon wing with Drag Reduction System (DRS) and active rear diffuser channeling.',
        badge: 'AERODYNAMICS',
        pos: [0, 2.7, -2.1]
      },
      {
        id: 'brakes',
        title: 'CARBON-CERAMIC BRAKE MATRIX',
        subtitle: '410mm Discs · 6-Piston Monobloc Calipers',
        desc: 'Aerospace-grade carbon ceramic rotors drilled for thermal dissipation with extreme fade resistance under relentless track conditions.',
        badge: 'CHASSIS',
        pos: [-2.4, 1.2, 1.4]
      },
      {
        id: 'cockpit',
        title: 'ALCANTARA & CARBON MONOCOQUE',
        subtitle: 'Torsional Rigidity 42,000 Nm/deg',
        desc: 'Formula 1 inspired carbon fiber survival cell wrapped in hand-stitched Italian leather, triple OLED curved telemetry screens, and head-up display.',
        badge: 'COCKPIT',
        pos: [0, 2.2, 0.4]
      },
      {
        id: 'doors',
        title: 'DIHEDRAL SCISSOR DOORS',
        subtitle: 'Carbon Pre-Preg Construction',
        desc: 'Weight-saving carbon fiber doors engineered with aerodynamic side intake channels feeding intercoolers and radiators.',
        badge: 'BODYWORK',
        pos: [-1.8, 2.4, 0.1]
      }
    ];

    this.hotspotElements = this.hotspotDefs.map(def => {
      const el = document.createElement('div');
      el.className = 'studio-hotspot-pin';
      el.innerHTML = `
        <div class="pin-pulse"></div>
        <div class="pin-dot"><span>+</span></div>
        <div class="pin-card">
          <span class="pin-badge">${def.badge}</span>
          <h4>${def.title}</h4>
          <div class="pin-sub">${def.subtitle}</div>
          <p>${def.desc}</p>
        </div>
      `;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleHotspot(def.id);
      });
      this.hotspotContainer.appendChild(el);
      return { def, el };
    });
  }

  toggleHotspot(id) {
    this.hotspotElements.forEach(item => {
      if (item.def.id === id) {
        item.el.classList.toggle('active');
      } else {
        item.el.classList.remove('active');
      }
    });
  }

  updateHotspotAnchors() {
    // Dynamically adjust positions based on vehicle type
  }

  updateHotspotScreenPositions() {
    if (!this.state.isExploded || this.state.viewMode !== 'outside') {
      this.hotspotContainer.style.opacity = '0';
      this.hotspotContainer.style.pointerEvents = 'none';
      return;
    }

    this.hotspotContainer.style.opacity = '1';
    this.hotspotContainer.style.pointerEvents = 'auto';

    const T = this.THREE;
    const v = new T.Vector3();
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.hotspotElements.forEach(({ def, el }) => {
      v.set(def.pos[0], def.pos[1], def.pos[2]);
      v.project(this.camera);

      // Check if behind camera
      if (v.z > 1) {
        el.style.display = 'none';
        return;
      }

      el.style.display = 'block';
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-v.y * 0.5 + 0.5) * height;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }

  /**
   * Scramble / Explode Animation Controller
   * Smoothly animates parts between resting position and exploded configuration
   */
  setExplode(explode) {
    this.state.isExploded = explode;
    if (explode && this.state.viewMode === 'cockpit') {
      this.setViewMode('outside');
    }
  }

  toggleExplode() {
    this.setExplode(!this.state.isExploded);
    return this.state.isExploded;
  }

  /**
   * Exterior vs Cockpit View Mode Switcher
   */
  setViewMode(mode, cockpitPreset = 'driver') {
    this.state.viewMode = mode;
    if (mode === 'cockpit') {
      this.state.cockpitPreset = cockpitPreset;
      this.state.autoRotate = false;
      this.state.isExploded = false; // Cannot be scrambled while sitting inside
      const preset = this.cockpitPresets[cockpitPreset] || this.cockpitPresets.driver;
      this.cockpitLook.yaw = preset.yaw;
      this.cockpitLook.pitch = preset.pitch;
      this.cockpitLook.fov = preset.fov;
    }
  }

  setCockpitPreset(presetName) {
    if (this.cockpitPresets[presetName]) {
      this.setViewMode('cockpit', presetName);
    }
  }

  /**
   * Color & Material Customizer
   */
  setPaintColor(hex) {
    this.state.paintColor = hex;
    if (this.materials.paint) {
      this.materials.paint.color.set(hex);
    }
  }

  setInteriorColor(hex) {
    this.state.interiorColor = hex;
    if (this.materials.interior) {
      this.materials.interior.color.set(hex);
    }
  }

  setCaliperColor(hex) {
    this.state.caliperColor = hex;
    if (this.materials.caliper) {
      this.materials.caliper.color.set(hex);
    }
  }

  setWheelStyle(style) {
    this.state.wheelStyle = style;
    const isSport = style === 'sport';
    const isAero = style === 'aero';
    if (this.spokesList) {
      this.spokesList.forEach(spoke => {
        spoke.visible = isSport || isAero;
        spoke.scale.set(isAero ? 1.4 : 1, 1, 1);
      });
    }
    if (this.materials.chrome) {
      this.materials.chrome.color.set(style === 'classic' ? 0xdddddf : (style === 'aero' ? 0x18181c : 0xa4a8b0));
    }
  }

  toggleHeadlights() {
    this.state.headlightsOn = !this.state.headlightsOn;
    const intensity = this.state.headlightsOn ? 2.5 : 0.15;
    if (this.materials.headlightEmissive) {
      this.materials.headlightEmissive.emissiveIntensity = intensity;
    }
    if (this.materials.taillightEmissive) {
      this.materials.taillightEmissive.emissiveIntensity = intensity;
    }
    return this.state.headlightsOn;
  }

  toggleAutoRotate() {
    this.state.autoRotate = !this.state.autoRotate;
    return this.state.autoRotate;
  }

  setStudioTheme(theme) {
    this.state.studioTheme = theme;
    const isDark = theme === 'dark';
    const bgColor = isDark ? 0x060608 : 0xf0f2f5;
    this.scene.background.set(bgColor);
    if (this.scene.fog) {
      this.scene.fog.color.set(bgColor);
    }
    if (this.floorMat) {
      this.floorMat.color.set(isDark ? 0x08080a : 0xe0e3e8);
      this.floorMat.roughness = isDark ? 0.18 : 0.45;
    }
    if (this.grid) {
      this.grid.visible = isDark;
    }
  }

  /**
   * Pointer & Touch Gestures
   */
  bindEvents() {
    const cv = this.canvas;
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

    const calcPinchDistance = () => {
      const pts = [...this.pointerMap.values()];
      return Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
    };

    const handleZoom = (delta) => {
      if (this.state.viewMode === 'outside') {
        this.orbit.radius = clamp(this.orbit.radius + delta, this.orbit.minRadius, this.orbit.maxRadius);
      } else {
        this.cockpitLook.fov = clamp(this.cockpitLook.fov + delta * 8, 48, 92);
      }
    };

    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId);
      this.pointerMap.set(e.pointerId, [e.clientX, e.clientY]);
      if (this.state.autoRotate) this.state.autoRotate = false;
      if (this.pointerMap.size === 2) {
        this.pinchDist = calcPinchDistance();
      }
    });

    cv.addEventListener('pointermove', (e) => {
      const prev = this.pointerMap.get(e.pointerId);
      if (!prev) return;

      const dx = e.clientX - prev[0];
      const dy = e.clientY - prev[1];
      this.pointerMap.set(e.pointerId, [e.clientX, e.clientY]);

      if (this.pointerMap.size === 2) {
        const d = calcPinchDistance();
        handleZoom((this.pinchDist - d) * 0.018);
        this.pinchDist = d;
        return;
      }

      if (this.state.viewMode === 'outside') {
        this.orbit.theta -= dx * 0.007;
        this.orbit.phi = clamp(this.orbit.phi + dy * 0.005, 0.05, 1.25);
      } else {
        // Cockpit 360 free look inside cabin
        this.cockpitLook.yaw += dx * 0.005;
        this.cockpitLook.pitch = clamp(this.cockpitLook.pitch + dy * 0.004, -1.15, 1.15);
      }
    });

    const removePointer = (e) => this.pointerMap.delete(e.pointerId);
    cv.addEventListener('pointerup', removePointer);
    cv.addEventListener('pointercancel', removePointer);

    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      handleZoom(e.deltaY * 0.004);
    }, { passive: false });

    // Window Resize
    this.resizeHandler = () => this.onResize();
    window.addEventListener('resize', this.resizeHandler);
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Main Animation Loop
   */
  renderLoop() {
    this.animId = requestAnimationFrame(() => this.renderLoop());

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const T = this.THREE;

    // 1. Scramble / Explode lerp interpolation
    const targetProgress = this.state.isExploded ? 1.0 : 0.0;
    this.state.explodeProgress += (targetProgress - this.state.explodeProgress) * Math.min(1, dt * 5.5);

    // Apply interpolated transforms to all vehicle parts
    const p = this.state.explodeProgress;
    for (const key in this.parts) {
      const part = this.parts[key];
      part.group.position.x = T.MathUtils.lerp(part.rest.x, part.target.x, p);
      part.group.position.y = T.MathUtils.lerp(part.rest.y, part.target.y, p);
      part.group.position.z = T.MathUtils.lerp(part.rest.z, part.target.z, p);

      part.group.rotation.x = T.MathUtils.lerp(part.rest.rotX, part.target.rotX, p);
      part.group.rotation.y = T.MathUtils.lerp(part.rest.rotY, part.target.rotY, p);
      part.group.rotation.z = T.MathUtils.lerp(part.rest.rotZ, part.target.rotZ, p);
    }

    // 2. Camera Navigation & Smoothing
    const targetPos = new T.Vector3();
    const targetQuat = new T.Quaternion();
    const matrix = new T.Matrix4();
    const UP = new T.Vector3(0, 1, 0);

    let targetFov = 45;

    if (this.state.viewMode === 'outside') {
      if (this.state.autoRotate) {
        this.orbit.theta += dt * this.state.autoRotateSpeed;
      }
      const x = Math.sin(this.orbit.theta) * Math.cos(this.orbit.phi) * this.orbit.radius;
      const y = 0.85 + Math.sin(this.orbit.phi) * this.orbit.radius;
      const z = Math.cos(this.orbit.theta) * Math.cos(this.orbit.phi) * this.orbit.radius;
      targetPos.set(x, y, z);

      const lookTarget = new T.Vector3(0, 0.85 + p * 0.45, 0);
      matrix.lookAt(targetPos, lookTarget, UP);
      targetQuat.setFromRotationMatrix(matrix);
      targetFov = 45;
    } else {
      // Inside Cockpit
      const preset = this.cockpitPresets[this.state.cockpitPreset] || this.cockpitPresets.driver;
      targetPos.set(preset.pos[0], preset.pos[1], preset.pos[2]);

      const euler = new T.Euler(this.cockpitLook.pitch, this.cockpitLook.yaw, 0, 'YXZ');
      targetQuat.setFromEuler(euler);
      targetFov = this.cockpitLook.fov;
    }

    // Smooth camera transition (lerp / slerp)
    const smoothK = Math.min(1, dt * 6.5);
    this.camera.position.lerp(targetPos, smoothK);
    this.camera.quaternion.slerp(targetQuat, Math.min(1, dt * 7.5));
    this.camera.fov += (targetFov - this.camera.fov) * smoothK;
    this.camera.updateProjectionMatrix();

    // Adjust internal cabin light brightness when inside
    if (this.cabinLight) {
      const targetCabinLight = this.state.viewMode === 'cockpit' ? 1.6 : 0.35;
      this.cabinLight.intensity += (targetCabinLight - this.cabinLight.intensity) * smoothK;
    }

    // 3. Update 3D Hotspot Screen Coordinates
    this.updateHotspotScreenPositions();

    // 4. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

window.Huranow3DStudio = Huranow3DStudio;
