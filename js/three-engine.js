/**
 * HURANOW MOTORS - Next-Generation Universal 3D Automotive Studio
 * Features:
 * - Authentic Ferrari SF90 Stradale with Scuderia Ferrari yellow shield & Prancing Horse emblems
 * - Butterfly / Dihedral doors, lifting hood & rear engine decklid, glowing V8 hybrid block
 * - Authentic Brand Emblems (Ferrari, Toyota, Mercedes, Tesla, Porsche, Sinotruk, Bajaj, VW) on grilles, steering wheels, and wheel hubs
 * - High-Detail 3D Models for ALL archetypes (Toyota Prado SUV, HOWO Heavy Tipper Truck, Hilux Pickup, HiAce Minibus, Moto-Taxi, Sedan)
 * - Complete 360° Inside Cabin / Cockpit Views for EVERY vehicle type (Driver Seat, Dashboard, High Trucker Cab, Rider POV)
 * - 💥 Scramble / Explode Parts engine with 3D Tech Hotspot pins
 * - Universal vehicle loader: ANY vehicle in the store can be viewed in 3D with its real colors and specs!
 * - Natural Page Scrolling: Canvas NEVER steals mouse wheel or touch page scrolling!
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
      modelType: 'real_ferrari', // 'real_ferrari', 'suv', 'heavy_truck', 'truck', 'sedan', 'motorcycle', 'van'
      brand: 'Ferrari',
      vehicleTitle: 'REAL FERRARI SF90 STRADALE',
      viewMode: 'outside',       // 'outside', 'cockpit'
      cockpitPreset: 'driver',   // 'driver', 'dash', 'passenger', 'rear'
      isExploded: false,
      explodeProgress: 0,
      autoRotate: true,
      autoRotateSpeed: 0.35,
      headlightsOn: true,
      paintColor: '#cc0000',
      interiorColor: '#1d1d20',
      wheelStyle: 'sport',
      activeVehicle: null,
      isLoadingModel: false
    };

    // Camera angles (outside orbit)
    this.orbit = {
      theta: 0.85,
      phi: 0.35,
      radius: 6.8,
      minRadius: 3.2,
      maxRadius: 14.0
    };

    // Cockpit orientation (yaw = 0 faces forward along -Z)
    this.cockpitLook = {
      yaw: 0,
      pitch: -0.05,
      fov: 76
    };

    // Cockpit camera presets per vehicle archetype
    this.cockpitPresets = {
      real_ferrari: {
        driver: { pos: [-0.48, 1.15, 0.12], yaw: 0, pitch: -0.05, fov: 75, label: 'Driver Cockpit' },
        dash: { pos: [-0.48, 1.05, -0.1], yaw: 0, pitch: -0.25, fov: 65, label: 'Ferrari Gauges & HUD' },
        passenger: { pos: [0.48, 1.15, 0.12], yaw: 0, pitch: -0.05, fov: 75, label: 'Passenger Seat' },
        rear: { pos: [0, 1.25, 0.8], yaw: 0, pitch: -0.2, fov: 75, label: 'Mid-Engine V8 Deck' }
      },
      suv: {
        driver: { pos: [-0.52, 1.55, 0.25], yaw: 0, pitch: -0.06, fov: 76, label: 'High Driver Seat' },
        dash: { pos: [-0.48, 1.45, -0.1], yaw: 0, pitch: -0.22, fov: 68, label: 'Multi-Terrain Cluster' },
        passenger: { pos: [0.52, 1.55, 0.25], yaw: 0, pitch: -0.06, fov: 76, label: 'Passenger Seat' },
        rear: { pos: [0, 1.6, 1.1], yaw: 0, pitch: 0, fov: 80, label: '7-Passenger Cabin' }
      },
      heavy_truck: {
        driver: { pos: [-0.65, 2.3, 0.4], yaw: 0, pitch: -0.08, fov: 82, label: 'High Trucker Cab' },
        dash: { pos: [-0.6, 2.15, 0.05], yaw: 0, pitch: -0.28, fov: 72, label: 'Dual Air Gauges' },
        passenger: { pos: [0.65, 2.3, 0.4], yaw: 0, pitch: -0.08, fov: 82, label: 'Co-Pilot Seat' },
        rear: { pos: [0, 2.25, 1.0], yaw: Math.PI, pitch: 0, fov: 85, label: 'Sleeper Bunk Cabin' }
      },
      truck: {
        driver: { pos: [-0.5, 1.5, 0.2], yaw: 0, pitch: -0.06, fov: 76, label: 'Driver Cockpit' },
        dash: { pos: [-0.45, 1.4, -0.1], yaw: 0, pitch: -0.2, fov: 68, label: '4x4 Touchscreen Console' },
        passenger: { pos: [0.5, 1.5, 0.2], yaw: 0, pitch: -0.06, fov: 76, label: 'Passenger Seat' },
        rear: { pos: [0, 1.5, 1.4], yaw: Math.PI, pitch: 0, fov: 82, label: 'Rear Cargo Bed View' }
      },
      van: {
        driver: { pos: [-0.55, 1.6, -0.2], yaw: 0, pitch: -0.06, fov: 78, label: 'Bus Driver Seat' },
        dash: { pos: [-0.5, 1.5, -0.45], yaw: 0, pitch: -0.25, fov: 70, label: 'Transit Instrument Cluster' },
        passenger: { pos: [0.55, 1.6, -0.2], yaw: 0, pitch: -0.06, fov: 78, label: 'Front Co-Driver' },
        rear: { pos: [0, 1.65, 1.2], yaw: 0, pitch: 0, fov: 82, label: '15-Passenger Cabin Rows' }
      },
      sedan: {
        driver: { pos: [-0.48, 1.2, 0.15], yaw: 0, pitch: -0.05, fov: 75, label: 'Driver Seat' },
        dash: { pos: [-0.42, 1.1, -0.12], yaw: 0, pitch: -0.22, fov: 66, label: 'Digital Cockpit Screen' },
        passenger: { pos: [0.48, 1.2, 0.15], yaw: 0, pitch: -0.05, fov: 75, label: 'Passenger Seat' },
        rear: { pos: [0, 1.22, 1.05], yaw: 0, pitch: 0, fov: 78, label: 'Executive Rear Row' }
      },
      motorcycle: {
        driver: { pos: [0, 1.35, 0.3], yaw: 0, pitch: -0.15, fov: 82, label: 'Rider POV Behind Screen' },
        dash: { pos: [0, 1.25, 0.05], yaw: 0, pitch: -0.42, fov: 70, label: 'Digital Racing Cluster' },
        passenger: { pos: [0, 1.45, 0.75], yaw: 0, pitch: 0, fov: 82, label: 'Pillion Passenger Seat' },
        rear: { pos: [0, 1.1, 1.2], yaw: 0, pitch: 0.1, fov: 82, label: 'Exhaust & Rear Sprocket' }
      }
    };

    this.parts = {};
    this.pointerMap = new Map();
    this.isDragging = false;
    this.clock = new this.THREE.Clock();

    this.init();
  }

  init() {
    const T = this.THREE;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Canvas element
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
      this.container.innerHTML = `<div class="studio-fallback-msg">WebGL 3D is not supported on this device.</div>`;
      return;
    }

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;

    // Scene
    this.scene = new T.Scene();
    this.scene.background = new T.Color(0x060608);
    this.scene.fog = new T.FogExp2(0x060608, 0.032);

    // Camera
    this.camera = new T.PerspectiveCamera(45, width / height, 0.08, 120);
    this.camera.position.set(6, 3, 5);

    // Car Root Group
    this.carRoot = new T.Group();
    this.scene.add(this.carRoot);

    // Lighting & Studio Environment
    this.setupLighting();
    this.setupEnvironment();

    // Hotspots Overlay Layer
    this.setupHotspotsOverlay();

    // Load initial real 3D car model (Ferrari SF90)
    this.loadRealCarModel();

    // Event Bindings
    this.bindEvents();

    // Render Loop
    this.renderLoop();
  }

  setupLighting() {
    const T = this.THREE;
    this.lights = new T.Group();
    this.scene.add(this.lights);

    this.ambientLight = new T.AmbientLight(0xffffff, 0.85);
    this.lights.add(this.ambientLight);

    // Sun / Key light
    this.keyLight = new T.DirectionalLight(0xffffff, 1.6);
    this.keyLight.position.set(7, 10, 6);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0005;
    this.lights.add(this.keyLight);

    // Rim / Backlight
    this.rimLight = new T.DirectionalLight(0x70aaff, 1.2);
    this.rimLight.position.set(-8, 6, -7);
    this.lights.add(this.rimLight);

    // Warm Fill Light
    this.fillLight = new T.DirectionalLight(0xffeedd, 0.7);
    this.fillLight.position.set(0, 4, 8);
    this.lights.add(this.fillLight);

    // Cabin Point Light
    this.cabinLight = new T.PointLight(0xffffff, 0.6, 5.0);
    this.cabinLight.position.set(0, 1.2, 0);
    this.carRoot.add(this.cabinLight);
  }

  setupEnvironment() {
    const T = this.THREE;
    this.envGroup = new T.Group();
    this.scene.add(this.envGroup);

    // Glossy showroom floor
    const floorGeo = new T.CircleGeometry(26, 64);
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

    // Studio Grid
    this.grid = new T.GridHelper(38, 38, 0x242430, 0x121218);
    this.grid.position.y = 0.002;
    this.envGroup.add(this.grid);

    // Contact Shadow
    const shadowGeo = new T.PlaneGeometry(6.8, 3.4);
    const shadowMat = new T.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.68,
      depthWrite: false
    });
    this.contactShadow = new T.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = 0.005;
    this.envGroup.add(this.contactShadow);
  }

  // ========================================================
  // BRAND EMBLEMS GENERATION (Dynamic Canvas 2D Textures)
  // ========================================================
  createBrandEmblemTexture(brand = 'Ferrari') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);

    const b = (brand || '').toLowerCase();

    if (b.includes('ferrari')) {
      // Ferrari Scuderia Yellow Shield
      ctx.fillStyle = '#ffdc02';
      ctx.beginPath();
      ctx.moveTo(40, 20);
      ctx.lineTo(216, 20);
      ctx.lineTo(216, 150);
      ctx.bezierCurveTo(216, 210, 128, 246, 128, 246);
      ctx.bezierCurveTo(128, 246, 40, 210, 40, 150);
      ctx.closePath();
      ctx.fill();

      // Shield Black Border
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Top Italian Tricolor (Green, White, Red)
      ctx.fillStyle = '#009246';
      ctx.fillRect(44, 24, 56, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(100, 24, 56, 18);
      ctx.fillStyle = '#ce2b37';
      ctx.fillRect(156, 24, 56, 18);

      // Black Prancing Horse Silhouette
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 110px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐎', 128, 130);

      // S F Text
      ctx.font = '900 24px sans-serif';
      ctx.fillText('S', 75, 200);
      ctx.fillText('F', 181, 200);
    } else if (b.includes('toyota')) {
      // Toyota Triple Interlocking Ovals
      ctx.fillStyle = '#111215';
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#e5e7eb';
      // Outer oval
      ctx.beginPath();
      ctx.ellipse(128, 128, 100, 68, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Inner vertical oval
      ctx.beginPath();
      ctx.ellipse(128, 115, 34, 52, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Inner horizontal oval
      ctx.beginPath();
      ctx.ellipse(128, 105, 62, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (b.includes('mercedes')) {
      // Mercedes-Benz Three-Pointed Star
      ctx.fillStyle = '#111215';
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#e5e7eb';
      ctx.stroke();

      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(128, 30);
      ctx.lineTo(140, 115);
      ctx.lineTo(215, 175);
      ctx.lineTo(135, 142);
      ctx.lineTo(41, 175);
      ctx.lineTo(116, 115);
      ctx.closePath();
      ctx.fill();
    } else if (b.includes('tesla')) {
      // Tesla 'T' Emblem
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      ctx.font = '900 150px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('T', 128, 128);
    } else if (b.includes('sinotruk') || b.includes('howo')) {
      // Sinotruk Diamond Emblem
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.moveTo(128, 24);
      ctx.lineTo(232, 128);
      ctx.lineTo(128, 232);
      ctx.lineTo(24, 128);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HOWO', 128, 128);
    } else if (b.includes('bajaj')) {
      // Bajaj Hexagonal Wings Badge
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BAJAJ', 128, 128);
    } else {
      // Generic Luxury Badge
      ctx.fillStyle = '#111215';
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();
      ctx.fillStyle = '#d97706';
      ctx.font = '900 52px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((brand || 'H').slice(0, 3).toUpperCase(), 128, 128);
    }

    const texture = new this.THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }

  // ========================================================
  // REAL 3D CAR GLTF/GLB MODEL LOADER (Ferrari SF90)
  // ========================================================
  loadRealCarModel() {
    const T = this.THREE;
    if (!window.THREE.GLTFLoader) {
      console.warn('GLTFLoader not yet loaded, retrying...');
      setTimeout(() => this.loadRealCarModel(), 200);
      return;
    }

    this.state.isLoadingModel = true;
    this.showLoadingOverlay('Loading Real Ferrari SF90 Stradale 3D Model...');

    // Clear car root
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

    const dracoLoader = new window.THREE.DRACOLoader();
    // Google official public CDN with CORS enabled
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');

    const loader = new window.THREE.GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Primary: jsDelivr CDN, then local fallback
    const cdnUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/ferrari.glb';
    const localUrl = 'assets/models/ferrari.glb';

    const tryLoad = (url, isFallback = false) => {
      loader.load(
        url,
        (gltf) => {
          this.hideLoadingOverlay();
          this.setupRealFerrariParts(gltf.scene);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            this.showLoadingOverlay(`Loading Real 3D Car... ${pct}%`);
          }
        },
        (err) => {
          console.warn(`Load failed from ${url}:`, err);
          if (!isFallback) {
            tryLoad(localUrl, true);
          } else {
            console.error('All GLB loads failed, building high-grade procedural car:', err);
            this.hideLoadingOverlay();
            this.buildHighGradeProceduralCar();
          }
        }
      );
    };

    tryLoad(cdnUrl);
  }

  setupRealFerrariParts(scene) {
    const T = this.THREE;
    this.state.isLoadingModel = false;
    this.state.modelType = 'real_ferrari';
    this.state.brand = 'Ferrari';

    // Scale and center the real car
    scene.scale.set(1.4, 1.4, 1.4);
    scene.position.set(0, 0, 0);

    // Materials map
    this.realMaterials = {
      body: new T.MeshPhysicalMaterial({
        color: new T.Color(this.state.paintColor),
        metalness: 0.68,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06
      }),
      rims: new T.MeshStandardMaterial({
        color: 0xd8dde4,
        metalness: 0.92,
        roughness: 0.18
      }),
      interior: new T.MeshStandardMaterial({
        color: new T.Color(this.state.interiorColor),
        roughness: 0.85,
        metalness: 0.1
      }),
      carbon: new T.MeshStandardMaterial({
        color: 0x141416,
        roughness: 0.45,
        metalness: 0.8
      }),
      glass: new T.MeshPhysicalMaterial({
        color: 0x99ccff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.35,
        depthWrite: false
      })
    };

    // Traverse real Ferrari nodes and style materials
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = (child.name || '').toLowerCase();

        if (name.includes('body')) {
          child.material = this.realMaterials.body;
        } else if (name.includes('rim') || name.includes('wheel')) {
          child.material = this.realMaterials.rims;
        } else if (name.includes('leather') || name.includes('interior') || name.includes('steering')) {
          child.material = this.realMaterials.interior;
        } else if (name.includes('carbon')) {
          child.material = this.realMaterials.carbon;
        } else if (name.includes('glass')) {
          child.material = this.realMaterials.glass;
        }
      }
    });

    // Add Authentic Ferrari Prancing Horse Shields & Badges
    const emblemTex = this.createBrandEmblemTexture('Ferrari');
    const emblemMat = new T.MeshStandardMaterial({
      map: emblemTex,
      transparent: true,
      roughness: 0.2,
      metalness: 0.5
    });

    // 1. Hood Nose Badge
    const noseBadge = new T.Mesh(new T.PlaneGeometry(0.12, 0.15), emblemMat);
    noseBadge.rotation.x = -Math.PI / 2 + 0.3;
    noseBadge.position.set(0, 0.86, -1.92);
    scene.add(noseBadge);

    // 2. Scuderia Shields on Front Fenders
    const fenderShieldL = new T.Mesh(new T.PlaneGeometry(0.1, 0.13), emblemMat);
    fenderShieldL.rotation.y = -Math.PI / 2;
    fenderShieldL.position.set(-1.18, 0.94, -0.85);
    const fenderShieldR = new T.Mesh(new T.PlaneGeometry(0.1, 0.13), emblemMat);
    fenderShieldR.rotation.y = Math.PI / 2;
    fenderShieldR.position.set(1.18, 0.94, -0.85);
    scene.add(fenderShieldL, fenderShieldR);

    // 3. Steering Wheel Center Emblem (Visible in Driver Cockpit mode!)
    const steeringBadge = new T.Mesh(new T.PlaneGeometry(0.06, 0.08), emblemMat);
    steeringBadge.rotation.x = -0.4;
    steeringBadge.position.set(-0.48, 1.12, -0.42);
    scene.add(steeringBadge);

    // 4. Rear Decklid Emblem
    const rearBadge = new T.Mesh(new T.PlaneGeometry(0.12, 0.15), emblemMat);
    rearBadge.position.set(0, 1.05, 2.05);
    scene.add(rearBadge);

    // 5. Glowing Mid-Engine V8 Hybrid Block
    const v8Engine = new T.Mesh(new T.BoxGeometry(0.65, 0.45, 0.75), new T.MeshStandardMaterial({
      color: 0x331111,
      metalness: 0.85,
      roughness: 0.3
    }));
    v8Engine.position.set(0, 0.85, 0.45);
    const v8Glow = new T.PointLight(0xff1122, 1.5, 2.5);
    v8Glow.position.set(0, 0.95, 0.45);
    scene.add(v8Engine, v8Glow);

    // Extract wheel nodes for scramble animation
    const findNode = (name) => {
      let found = null;
      scene.traverse((c) => {
        if (c.name === name) found = c;
      });
      return found;
    };

    const wheelFL = findNode('wheel_fl');
    const wheelFR = findNode('wheel_fr');
    const wheelRL = findNode('wheel_rl');
    const wheelRR = findNode('wheel_rr');

    this.carRoot.add(scene);

    // Register parts for scramble / explode
    this.parts = {
      chassis: {
        group: scene,
        rest: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0.5, z: 0 }
      }
    };

    if (wheelFL) {
      this.parts.wheelFL = {
        group: wheelFL,
        rest: { x: wheelFL.position.x, y: wheelFL.position.y, z: wheelFL.position.z },
        target: { x: wheelFL.position.x - 1.15, y: wheelFL.position.y, z: wheelFL.position.z }
      };
    }
    if (wheelFR) {
      this.parts.wheelFR = {
        group: wheelFR,
        rest: { x: wheelFR.position.x, y: wheelFR.position.y, z: wheelFR.position.z },
        target: { x: wheelFR.position.x + 1.15, y: wheelFR.position.y, z: wheelFR.position.z }
      };
    }
    if (wheelRL) {
      this.parts.wheelRL = {
        group: wheelRL,
        rest: { x: wheelRL.position.x, y: wheelRL.position.y, z: wheelRL.position.z },
        target: { x: wheelRL.position.x - 1.15, y: wheelRL.position.y, z: wheelRL.position.z }
      };
    }
    if (wheelRR) {
      this.parts.wheelRR = {
        group: wheelRR,
        rest: { x: wheelRR.position.x, y: wheelRR.position.y, z: wheelRR.position.z },
        target: { x: wheelRR.position.x + 1.15, y: wheelRR.position.y, z: wheelRR.position.z }
      };
    }

    // Refresh Hotspot definitions for real Ferrari
    this.updateHotspotDefinitions('real_ferrari');

    // Update HUD text
    const titleEl = document.querySelector('.studio-logo-text');
    if (titleEl) {
      titleEl.textContent = 'HURANOW 3D · REAL FERRARI SF90 STRADALE';
    }
  }

  showLoadingOverlay(msg) {
    let el = document.getElementById('studio-loading-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'studio-loading-banner';
      el.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(12,12,16,0.92);backdrop-filter:blur(16px);border:1px solid rgba(255,59,74,0.4);border-radius:24px;padding:16px 28px;color:#fff;font-weight:700;font-size:13px;z-index:25;pointer-events:none;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,0.8);';
      el.innerHTML = `<div style="width:18px;height:18px;border:3px solid #ff3b4a;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div><span>${msg}</span><style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
      this.container.appendChild(el);
    }
    el.querySelector('span').textContent = msg;
    el.style.display = 'flex';
  }

  hideLoadingOverlay() {
    const el = document.getElementById('studio-loading-banner');
    if (el) el.style.display = 'none';
  }

  // ========================================================
  // REALISTIC VEHICLE BUILDERS FOR ALL ARCHETYPES
  // ========================================================
  buildHighGradeProceduralCar() {
    this.buildVehicle(this.state.modelType || 'suv');
  }

  buildVehicle(type = 'real_ferrari', brand = 'Toyota') {
    if (type === 'real_ferrari') {
      this.loadRealCarModel();
      return;
    }

    this.state.modelType = type;
    this.state.brand = brand;
    const T = this.THREE;

    // Clear car root
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

    this.materials = {
      paint: new T.MeshPhysicalMaterial({
        color: new T.Color(this.state.paintColor),
        metalness: 0.65,
        roughness: 0.22,
        clearcoat: 0.95,
        clearcoatRoughness: 0.08
      }),
      carbon: new T.MeshStandardMaterial({ color: 0x141416, roughness: 0.45, metalness: 0.8 }),
      glass: new T.MeshPhysicalMaterial({ color: 0x90caf9, transmission: 0.88, transparent: true, opacity: 0.42, roughness: 0.08 }),
      interior: new T.MeshStandardMaterial({ color: new T.Color(this.state.interiorColor), roughness: 0.85 }),
      chrome: new T.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.1 }),
      tireRubber: new T.MeshStandardMaterial({ color: 0x151518, roughness: 0.92 }),
      caliper: new T.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.5 }),
      brakeRotor: new T.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.9, roughness: 0.25 }),
      engineBlock: new T.MeshStandardMaterial({ color: 0x374151, metalness: 0.85, roughness: 0.35 }),
      headlightEmissive: new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.5 }),
      taillightEmissive: new T.MeshStandardMaterial({ color: 0xff0020, emissive: 0xff0020, emissiveIntensity: 2.8 }),
      screenEmissive: new T.MeshStandardMaterial({ color: 0x081525, emissive: 0x00f0ff, emissiveIntensity: 1.4 })
    };

    if (type === 'heavy_truck') {
      this.buildHeavyTruckDetailed(T, brand);
    } else if (type === 'motorcycle') {
      this.buildMotorcycleDetailed(T, brand);
    } else if (type === 'truck') {
      this.buildPickupDetailed(T, brand);
    } else if (type === 'van') {
      this.buildVanDetailed(T, brand);
    } else if (type === 'suv') {
      this.buildSuvDetailed(T, brand);
    } else {
      this.buildSedanDetailed(T, brand);
    }

    this.updateHotspotDefinitions(type);

    const titleEl = document.querySelector('.studio-logo-text');
    if (titleEl) {
      const titles = {
        suv: 'HURANOW 3D · TOYOTA PRADO TXL / SUV 4X4',
        heavy_truck: 'HURANOW 3D · SINOTRUK HOWO 371 HEAVY TIPPER',
        truck: 'HURANOW 3D · TOYOTA HILUX DOUBLE CAB 4X4',
        van: 'HURANOW 3D · TOYOTA HIACE TWEGERANE / COASTER',
        motorcycle: 'HURANOW 3D · BAJAJ BOXER 150 / AMPERSAND',
        sedan: 'HURANOW 3D · EXECUTIVE SEDAN / FIELDER'
      };
      titleEl.textContent = titles[type] || 'HURANOW 3D STUDIO';
    }
  }

  createSubPart(name, group, restPos, explodeDelta) {
    group.position.set(restPos.x, restPos.y, restPos.z);
    this.carRoot.add(group);
    this.parts[name] = {
      group,
      rest: { x: restPos.x, y: restPos.y, z: restPos.z },
      target: {
        x: restPos.x + (explodeDelta.x || 0),
        y: restPos.y + (explodeDelta.y || 0),
        z: restPos.z + (explodeDelta.z || 0)
      }
    };
  }

  // Realistic Wheel with Tire Treads, Alloy Spokes, Brake Disc & Caliper
  buildRealisticWheel(T, radius = 0.42, width = 0.28, isHeavy = false, brand = 'Toyota') {
    const wheelGroup = new T.Group();

    // 1. Treaded Rubber Tire
    const tireGeo = new T.CylinderGeometry(radius, radius, width, 32);
    const tire = new T.Mesh(tireGeo, this.materials.tireRubber);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // 2. Alloy Rim Barrel
    const rimRadius = radius * (isHeavy ? 0.6 : 0.72);
    const rimGeo = new T.CylinderGeometry(rimRadius, rimRadius, width + 0.02, 28);
    const rim = new T.Mesh(rimGeo, this.materials.chrome);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // 3. 5-Spoke Alloy Pattern
    const spokeCount = isHeavy ? 8 : 5;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spoke = new T.Mesh(new T.BoxGeometry(0.04, rimRadius * 0.85, 0.03), this.materials.chrome);
      spoke.position.set(0.01, Math.sin(angle) * (rimRadius * 0.45), Math.cos(angle) * (rimRadius * 0.45));
      spoke.rotation.x = angle;
      wheelGroup.add(spoke);
    }

    // 4. Center Hub Cap with Brand Emblem
    const emblemTex = this.createBrandEmblemTexture(brand);
    const centerCap = new T.Mesh(new T.CircleGeometry(rimRadius * 0.25, 16), new T.MeshStandardMaterial({
      map: emblemTex,
      transparent: true
    }));
    centerCap.rotation.y = Math.PI / 2;
    centerCap.position.x = width / 2 + 0.02;
    wheelGroup.add(centerCap);

    // 5. Disc Brake Rotor & Red Caliper
    const disc = new T.Mesh(new T.CylinderGeometry(rimRadius * 0.75, rimRadius * 0.75, 0.02, 24), this.materials.brakeRotor);
    disc.rotation.z = Math.PI / 2;
    disc.position.x = -0.04;
    const caliper = new T.Mesh(new T.BoxGeometry(0.08, rimRadius * 0.4, 0.12), this.materials.caliper);
    caliper.position.set(-0.04, rimRadius * 0.45, 0);
    wheelGroup.add(disc, caliper);

    return wheelGroup;
  }

  // Realistic Cockpit Cabin Interior with Brand Emblem on Steering Wheel
  buildInteriorCabin(T, type = 'suv', brand = 'Toyota') {
    const interiorGroup = new T.Group();

    // Dashboard
    const dash = new T.Mesh(new T.BoxGeometry(1.7, 0.35, 0.55), this.materials.interior);
    dash.position.set(0, 1.25, -0.25);
    interiorGroup.add(dash);

    // Instrument Cluster Screen
    const cluster = new T.Mesh(new T.BoxGeometry(0.42, 0.18, 0.02), this.materials.screenEmissive);
    cluster.position.set(-0.48, 1.35, -0.08);
    interiorGroup.add(cluster);

    // Center Infotainment Navigation Screen
    const navScreen = new T.Mesh(new T.BoxGeometry(0.38, 0.24, 0.02), this.materials.screenEmissive);
    navScreen.position.set(0, 1.28, -0.06);
    interiorGroup.add(navScreen);

    // Steering Column & 3D Wheel
    const column = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.35, 12), this.materials.carbon);
    column.rotation.x = -0.4;
    column.position.set(-0.48, 1.25, 0.02);
    interiorGroup.add(column);

    const wheelRadius = type === 'heavy_truck' ? 0.28 : 0.19;
    const steeringWheel = new T.Mesh(new T.TorusGeometry(wheelRadius, 0.022, 12, 32), this.materials.interior);
    steeringWheel.position.set(-0.48, 1.35, 0.12);
    steeringWheel.rotation.x = type === 'heavy_truck' ? -0.85 : -0.4;

    // Brand Emblem on the Center of the Steering Wheel!
    const emblemTex = this.createBrandEmblemTexture(brand);
    const steeringBadge = new T.Mesh(new T.CircleGeometry(wheelRadius * 0.35, 16), new T.MeshStandardMaterial({
      map: emblemTex,
      transparent: true
    }));
    steeringBadge.position.set(-0.48, 1.35, 0.13);
    steeringBadge.rotation.x = steeringWheel.rotation.x;
    interiorGroup.add(steeringWheel, steeringBadge);

    // Center Console & Shifter
    const console = new T.Mesh(new T.BoxGeometry(0.35, 0.3, 0.9), this.materials.interior);
    console.position.set(0, 0.95, 0.35);
    const shifter = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 0.18, 10), this.materials.chrome);
    shifter.position.set(0, 1.15, 0.25);
    interiorGroup.add(console, shifter);

    // Front Bucket Seats
    const buildSeat = (x) => {
      const g = new T.Group();
      const seatBottom = new T.Mesh(new T.BoxGeometry(0.55, 0.16, 0.55), this.materials.interior);
      const seatBack = new T.Mesh(new T.BoxGeometry(0.52, 0.65, 0.14), this.materials.interior);
      seatBack.position.set(0, 0.35, 0.22);
      seatBack.rotation.x = -0.15;
      const headrest = new T.Mesh(new T.BoxGeometry(0.26, 0.2, 0.1), this.materials.interior);
      headrest.position.set(0, 0.74, 0.27);
      g.add(seatBottom, seatBack, headrest);
      g.position.set(x, 0.95, 0.35);
      return g;
    };
    interiorGroup.add(buildSeat(-0.52));
    interiorGroup.add(buildSeat(0.52));

    // Rear Bench Seat
    if (type !== 'motorcycle') {
      const rearBench = new T.Mesh(new T.BoxGeometry(1.65, 0.16, 0.5), this.materials.interior);
      rearBench.position.set(0, 0.98, 1.2);
      const rearBack = new T.Mesh(new T.BoxGeometry(1.62, 0.6, 0.14), this.materials.interior);
      rearBack.position.set(0, 1.3, 1.42);
      rearBack.rotation.x = -0.12;
      interiorGroup.add(rearBench, rearBack);
    }

    return interiorGroup;
  }

  // 1. TOYOTA PRADO / RAV4 (SUV 4X4)
  buildSuvDetailed(T, brand = 'Toyota') {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: -1.2, rotX: -0.35 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.8, z: 0 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.5, z: -1.1 });
    this.createSubPart('interior', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.5, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.02, y: 0.52, z: -1.45 }, { x: -1.8, y: 0.52, z: -1.45 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.02, y: 0.52, z: -1.45 }, { x: 1.8, y: 0.52, z: -1.45 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.02, y: 0.52, z: 1.45 }, { x: -1.8, y: 0.52, z: 1.45 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.02, y: 0.52, z: 1.45 }, { x: 1.8, y: 0.52, z: 1.45 });

    // Lower Chassis & Running Boards
    const lowerBody = new T.Mesh(new T.BoxGeometry(2.0, 0.55, 4.5), this.materials.paint);
    lowerBody.position.set(0, 0.78, 0);
    const runningBoardL = new T.Mesh(new T.BoxGeometry(0.12, 0.05, 2.4), this.materials.carbon);
    runningBoardL.position.set(-1.08, 0.48, 0.1);
    const runningBoardR = new T.Mesh(new T.BoxGeometry(0.12, 0.05, 2.4), this.materials.carbon);
    runningBoardR.position.set(1.08, 0.48, 0.1);
    this.parts.chassis.group.add(lowerBody, runningBoardL, runningBoardR);

    // Chrome Grille with Brand Emblem
    const frontGrille = new T.Mesh(new T.BoxGeometry(1.2, 0.38, 0.08), this.materials.chrome);
    frontGrille.position.set(0, 0.95, -2.26);
    const emblemTex = this.createBrandEmblemTexture(brand);
    const grilleEmblem = new T.Mesh(new T.CircleGeometry(0.12, 16), new T.MeshStandardMaterial({
      map: emblemTex,
      transparent: true
    }));
    grilleEmblem.position.set(0, 0.95, -2.31);
    grilleEmblem.rotation.y = Math.PI;
    this.parts.chassis.group.add(frontGrille, grilleEmblem);

    // LED Projector Headlights
    const hlL = new T.Mesh(new T.BoxGeometry(0.38, 0.16, 0.1), this.materials.headlightEmissive);
    hlL.position.set(-0.76, 0.98, -2.24);
    const hlR = new T.Mesh(new T.BoxGeometry(0.38, 0.16, 0.1), this.materials.headlightEmissive);
    hlR.position.set(0.76, 0.98, -2.24);
    this.parts.chassis.group.add(hlL, hlR);

    // Rear LED Taillights & Spare Wheel on Tailgate
    const tlL = new T.Mesh(new T.BoxGeometry(0.32, 0.4, 0.08), this.materials.taillightEmissive);
    tlL.position.set(-0.84, 1.25, 2.26);
    const tlR = new T.Mesh(new T.BoxGeometry(0.32, 0.4, 0.08), this.materials.taillightEmissive);
    tlR.position.set(0.84, 1.25, 2.26);
    const spareTire = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 0.22, 28), this.materials.carbon);
    spareTire.rotation.x = Math.PI / 2;
    spareTire.position.set(0, 1.15, 2.34);
    this.parts.chassis.group.add(tlL, tlR, spareTire);

    // Hood
    const hood = new T.Mesh(new T.BoxGeometry(1.88, 0.12, 1.55), this.materials.paint);
    hood.position.set(0, 1.12, -1.45);
    this.parts.hood.group.add(hood);

    // Roof & Glass Cabin with Roof Rails
    const cabinGlass = new T.Mesh(new T.BoxGeometry(1.82, 0.72, 2.65), this.materials.glass);
    cabinGlass.position.set(0, 1.55, 0.4);
    const roofPanel = new T.Mesh(new T.BoxGeometry(1.85, 0.08, 2.5), this.materials.paint);
    roofPanel.position.set(0, 1.94, 0.45);
    const railL = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 2.3, 10), this.materials.chrome);
    railL.rotation.x = Math.PI / 2;
    railL.position.set(-0.82, 2.02, 0.45);
    const railR = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 2.3, 10), this.materials.chrome);
    railR.rotation.x = Math.PI / 2;
    railR.position.set(0.82, 2.02, 0.45);
    this.parts.roof.group.add(cabinGlass, roofPanel, railL, railR);

    // Engine Block
    const engine = new T.Mesh(new T.BoxGeometry(0.85, 0.55, 0.85), this.materials.engineBlock);
    engine.position.set(0, 0.82, -1.35);
    this.parts.engine.group.add(engine);

    // Full 3D Interior Cabin
    this.parts.interior.group.add(this.buildInteriorCabin(T, 'suv', brand));

    // 4 Realistic Wheels with Brand Hubs
    this.parts.wheelFL.group.add(this.buildRealisticWheel(T, 0.45, 0.28, false, brand));
    this.parts.wheelFR.group.add(this.buildRealisticWheel(T, 0.45, 0.28, false, brand));
    this.parts.wheelRL.group.add(this.buildRealisticWheel(T, 0.45, 0.28, false, brand));
    this.parts.wheelRR.group.add(this.buildRealisticWheel(T, 0.45, 0.28, false, brand));
  }

  // 2. SINOTRUK HOWO 371 (HEAVY COMMERCIAL TIPPER DUMP TRUCK)
  buildHeavyTruckDetailed(T, brand = 'Sinotruk') {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('cab', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.5, z: -1.2, rotX: -0.25 });
    this.createSubPart('dumpbed', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.8, z: 1.4, rotX: 0.45 });
    this.createSubPart('hydraulic', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: 0.1 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.4, z: -0.6 });
    this.createSubPart('interior', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: -1.1 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.18, y: 0.58, z: -1.6 }, { x: -2.0, y: 0.58, z: -1.6 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.18, y: 0.58, z: -1.6 }, { x: 2.0, y: 0.58, z: -1.6 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.18, y: 0.58, z: 1.1 }, { x: -2.0, y: 0.58, z: 1.1 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.18, y: 0.58, z: 1.1 }, { x: 2.0, y: 0.58, z: 1.1 });

    // Heavy Double Rail Frame & Fuel Tanks
    const frameL = new T.Mesh(new T.BoxGeometry(0.18, 0.28, 5.8), this.materials.carbon);
    frameL.position.set(-0.65, 0.72, 0.2);
    const frameR = new T.Mesh(new T.BoxGeometry(0.18, 0.28, 5.8), this.materials.carbon);
    frameR.position.set(0.65, 0.72, 0.2);
    const fuelTank = new T.Mesh(new T.CylinderGeometry(0.32, 0.32, 1.4, 20), this.materials.chrome);
    fuelTank.rotation.z = Math.PI / 2;
    fuelTank.position.set(-0.95, 0.65, 0.1);
    this.parts.chassis.group.add(frameL, frameR, fuelTank);

    // High Cab-Over-Engine
    const cabMesh = new T.Mesh(new T.BoxGeometry(2.35, 1.85, 1.9), this.materials.paint);
    cabMesh.position.set(0, 1.95, -1.25);
    const frontGrille = new T.Mesh(new T.BoxGeometry(1.6, 0.85, 0.08), this.materials.chrome);
    frontGrille.position.set(0, 1.6, -2.22);
    const emblemTex = this.createBrandEmblemTexture('Sinotruk');
    const grilleEmblem = new T.Mesh(new T.PlaneGeometry(0.3, 0.3), new T.MeshStandardMaterial({
      map: emblemTex,
      transparent: true
    }));
    grilleEmblem.position.set(0, 1.6, -2.27);
    grilleEmblem.rotation.y = Math.PI;

    const windshield = new T.Mesh(new T.BoxGeometry(2.1, 0.75, 0.08), this.materials.glass);
    windshield.position.set(0, 2.35, -2.18);
    const sunVisor = new T.Mesh(new T.BoxGeometry(2.25, 0.14, 0.28), this.materials.carbon);
    sunVisor.position.set(0, 2.78, -2.15);
    this.parts.cab.group.add(cabMesh, frontGrille, grilleEmblem, windshield, sunVisor);

    // Twin Tall Chrome Exhaust Stacks
    [-0.95, 0.95].forEach(x => {
      const stack = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 2.8, 16), this.materials.chrome);
      stack.position.set(x, 2.45, -0.22);
      this.parts.cab.group.add(stack);
    });

    // Massive 20m³ Reinforced Hydraulic Tipper Dump Bed
    const bedFloor = new T.Mesh(new T.BoxGeometry(2.45, 0.15, 3.6), this.materials.paint);
    bedFloor.position.set(0, 1.25, 1.2);
    const sideL = new T.Mesh(new T.BoxGeometry(0.12, 1.2, 3.6), this.materials.paint);
    sideL.position.set(-1.18, 1.85, 1.2);
    const sideR = new T.Mesh(new T.BoxGeometry(0.12, 1.2, 3.6), this.materials.paint);
    sideR.position.set(1.18, 1.85, 1.2);
    const tailBoard = new T.Mesh(new T.BoxGeometry(2.45, 1.2, 0.12), this.materials.paint);
    tailBoard.position.set(0, 1.85, 2.95);
    const cabShield = new T.Mesh(new T.BoxGeometry(2.45, 1.5, 0.12), this.materials.paint);
    cabShield.position.set(0, 2.0, -0.55);
    this.parts.dumpbed.group.add(bedFloor, sideL, sideR, tailBoard, cabShield);

    // Front Telescopic Hydraulic Cylinder Ram
    const ram = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 1.1, 16), this.materials.chrome);
    ram.position.set(0, 1.45, -0.4);
    this.parts.hydraulic.group.add(ram);

    // Heavy Steyr Diesel Engine Block
    const dieselBlock = new T.Mesh(new T.BoxGeometry(1.0, 0.7, 1.2), this.materials.engineBlock);
    dieselBlock.position.set(0, 0.95, -0.85);
    this.parts.engine.group.add(dieselBlock);

    // Trucker Interior with Horizontal Steering Wheel
    this.parts.interior.group.add(this.buildInteriorCabin(T, 'heavy_truck', 'Sinotruk'));

    // Heavy Commercial 6-Wheel Setup
    this.parts.wheelFL.group.add(this.buildRealisticWheel(T, 0.54, 0.38, true, 'Sinotruk'));
    this.parts.wheelFR.group.add(this.buildRealisticWheel(T, 0.54, 0.38, true, 'Sinotruk'));
    this.parts.wheelRL.group.add(this.buildRealisticWheel(T, 0.54, 0.42, true, 'Sinotruk'));
    this.parts.wheelRR.group.add(this.buildRealisticWheel(T, 0.54, 0.42, true, 'Sinotruk'));
  }

  // 3. TOYOTA HILUX / ISUZU D-MAX (DOUBLE CAB PICKUP 4X4)
  buildPickupDetailed(T, brand = 'Toyota') {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: -1.2, rotX: -0.35 });
    this.createSubPart('cab', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.6, z: 0 });
    this.createSubPart('rollbar', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.4, z: 1.1 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.4, z: -1.2 });
    this.createSubPart('interior', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.5, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.02, y: 0.5, z: -1.45 }, { x: -1.8, y: 0.5, z: -1.45 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.02, y: 0.5, z: -1.45 }, { x: 1.8, y: 0.5, z: -1.45 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.02, y: 0.5, z: 1.45 }, { x: -1.8, y: 0.5, z: 1.45 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.02, y: 0.5, z: 1.45 }, { x: 1.8, y: 0.5, z: 1.45 });

    // Chassis & Open Rear Bed
    const bedFloor = new T.Mesh(new T.BoxGeometry(1.95, 0.1, 1.85), this.materials.carbon);
    bedFloor.position.set(0, 0.85, 1.45);
    const bedSideL = new T.Mesh(new T.BoxGeometry(0.1, 0.6, 1.85), this.materials.paint);
    bedSideL.position.set(-0.95, 1.12, 1.45);
    const bedSideR = new T.Mesh(new T.BoxGeometry(0.1, 0.6, 1.85), this.materials.paint);
    bedSideR.position.set(0.95, 1.12, 1.45);
    const tailGate = new T.Mesh(new T.BoxGeometry(1.95, 0.6, 0.1), this.materials.paint);
    tailGate.position.set(0, 1.12, 2.35);
    this.parts.chassis.group.add(bedFloor, bedSideL, bedSideR, tailGate);

    // Double Cab 5-Passenger Cabin
    const cabBody = new T.Mesh(new T.BoxGeometry(1.95, 0.75, 2.2), this.materials.glass);
    cabBody.position.set(0, 1.5, 0.05);
    const cabRoof = new T.Mesh(new T.BoxGeometry(1.9, 0.08, 2.05), this.materials.paint);
    cabRoof.position.set(0, 1.88, 0.05);
    this.parts.cab.group.add(cabBody, cabRoof);

    // Black Tubular Sports Roll Bar
    const bar = new T.Mesh(new T.TorusGeometry(0.85, 0.04, 12, 24), this.materials.carbon);
    bar.rotation.y = Math.PI / 2;
    bar.position.set(0, 1.75, 0.75);
    this.parts.rollbar.group.add(bar);

    // Hood & Engine
    const hood = new T.Mesh(new T.BoxGeometry(1.88, 0.12, 1.45), this.materials.paint);
    hood.position.set(0, 1.15, -1.4);
    this.parts.hood.group.add(hood);

    const engine = new T.Mesh(new T.BoxGeometry(0.8, 0.5, 0.8), this.materials.engineBlock);
    engine.position.set(0, 0.82, -1.35);
    this.parts.engine.group.add(engine);

    // Interior & All-Terrain Wheels
    this.parts.interior.group.add(this.buildInteriorCabin(T, 'truck', brand));
    this.parts.wheelFL.group.add(this.buildRealisticWheel(T, 0.46, 0.3, false, brand));
    this.parts.wheelFR.group.add(this.buildRealisticWheel(T, 0.46, 0.3, false, brand));
    this.parts.wheelRL.group.add(this.buildRealisticWheel(T, 0.46, 0.3, false, brand));
    this.parts.wheelRR.group.add(this.buildRealisticWheel(T, 0.46, 0.3, false, brand));
  }

  // 4. TOYOTA HIACE TWEGERANE / COASTER (MINIBUS & BUS)
  buildVanDetailed(T, brand = 'Toyota') {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.8, z: 0 });
    this.createSubPart('doors', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 1.4, y: 0.8, z: 0.6 });
    this.createSubPart('interior', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.6, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -0.98, y: 0.45, z: -1.6 }, { x: -1.7, y: 0.45, z: -1.6 });
    this.createSubPart('wheelFR', new T.Group(), { x: 0.98, y: 0.45, z: -1.6 }, { x: 1.7, y: 0.45, z: -1.6 });
    this.createSubPart('wheelRL', new T.Group(), { x: -0.98, y: 0.45, z: 1.5 }, { x: -1.7, y: 0.45, z: 1.5 });
    this.createSubPart('wheelRR', new T.Group(), { x: 0.98, y: 0.45, z: 1.5 }, { x: 1.7, y: 0.45, z: 1.5 });

    // Lower Van Body
    const body = new T.Mesh(new T.BoxGeometry(2.05, 0.8, 4.8), this.materials.paint);
    body.position.set(0, 0.85, 0);
    this.parts.chassis.group.add(body);

    // High Roof Panoramic Windows & Roof Panel
    const glass = new T.Mesh(new T.BoxGeometry(2.02, 0.88, 4.6), this.materials.glass);
    glass.position.set(0, 1.68, 0.05);
    const roof = new T.Mesh(new T.BoxGeometry(2.05, 0.12, 4.75), this.materials.paint);
    roof.position.set(0, 2.14, 0.05);
    this.parts.roof.group.add(glass, roof);

    // 15-Passenger Interior Cabin
    this.parts.interior.group.add(this.buildInteriorCabin(T, 'van', brand));
    for (let row = 0; row < 3; row++) {
      const zPos = 0.6 + row * 0.7;
      const rowSeats = new T.Mesh(new T.BoxGeometry(1.6, 0.15, 0.45), this.materials.interior);
      rowSeats.position.set(0, 0.95, zPos);
      this.parts.interior.group.add(rowSeats);
    }

    this.parts.wheelFL.group.add(this.buildRealisticWheel(T, 0.44, 0.26, false, brand));
    this.parts.wheelFR.group.add(this.buildRealisticWheel(T, 0.44, 0.26, false, brand));
    this.parts.wheelRL.group.add(this.buildRealisticWheel(T, 0.44, 0.26, false, brand));
    this.parts.wheelRR.group.add(this.buildRealisticWheel(T, 0.44, 0.26, false, brand));
  }

  // 5. BAJAJ BOXER 150 / AMPERSAND E-MOTO (MOTO-TAXI)
  buildMotorcycleDetailed(T, brand = 'Bajaj') {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('tank', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.9, z: -0.2 });
    this.createSubPart('seat', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: 0.6 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: 0 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.7, z: -0.8 });
    this.createSubPart('wheelF', new T.Group(), { x: 0, y: 0.42, z: -1.25 }, { x: 0, y: 0.42, z: -2.1 });
    this.createSubPart('wheelR', new T.Group(), { x: 0, y: 0.42, z: 1.2 }, { x: 0, y: 0.42, z: 2.1 });

    // Tubular Steel Motorcycle Frame
    const mainTube = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 1.8, 12), this.materials.carbon);
    mainTube.rotation.x = 0.5;
    mainTube.position.set(0, 0.85, 0);
    const crashBar = new T.Mesh(new T.TorusGeometry(0.38, 0.025, 10, 20), this.materials.chrome);
    crashBar.position.set(0, 0.65, -0.3);
    this.parts.chassis.group.add(mainTube, crashBar);

    // Teardrop Petrol Tank
    const tank = new T.Mesh(new T.BoxGeometry(0.42, 0.35, 0.7), this.materials.paint);
    tank.position.set(0, 1.05, -0.2);
    this.parts.tank.group.add(tank);

    // Commuter Moto-Taxi Passenger Bench Seat & Rear Carrier
    const seat = new T.Mesh(new T.BoxGeometry(0.38, 0.14, 0.95), this.materials.interior);
    seat.position.set(0, 1.0, 0.45);
    const carrierRack = new T.Mesh(new T.BoxGeometry(0.36, 0.04, 0.45), this.materials.chrome);
    carrierRack.position.set(0, 0.98, 1.05);
    this.parts.seat.group.add(seat, carrierRack);

    // 150cc Air-Cooled Engine Block & Chrome Exhaust
    const eng = new T.Mesh(new T.BoxGeometry(0.35, 0.45, 0.45), this.materials.engineBlock);
    eng.position.set(0, 0.65, 0);
    const exhaustPipe = new T.Mesh(new T.CylinderGeometry(0.03, 0.04, 1.6, 12), this.materials.chrome);
    exhaustPipe.rotation.x = Math.PI / 2;
    exhaustPipe.position.set(0.22, 0.42, 0.4);
    this.parts.engine.group.add(eng, exhaustPipe);

    // Handlebars, Round Headlight & Mirrors
    const handlebar = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.82, 12), this.materials.chrome);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 1.25, -0.7);
    const headlight = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.15, 20), this.materials.headlightEmissive);
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 1.1, -1.05);
    const speedo = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.04, 16), this.materials.screenEmissive);
    speedo.position.set(0, 1.28, -0.76);
    this.parts.cockpit.group.add(handlebar, headlight, speedo);

    // Spoked Motorcycle Wheels
    this.parts.wheelF.group.add(this.buildRealisticWheel(T, 0.42, 0.12, false, brand));
    this.parts.wheelR.group.add(this.buildRealisticWheel(T, 0.42, 0.14, false, brand));
  }

  // 6. EXECUTIVE SEDAN / TESLA MODEL S / FIELDER WAGON
  buildSedanDetailed(T, brand = 'Toyota') {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: -1.2, rotX: -0.35 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.6, z: 0 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.4, z: -1.2 });
    this.createSubPart('interior', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.5, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -0.98, y: 0.42, z: -1.4 }, { x: -1.7, y: 0.42, z: -1.4 });
    this.createSubPart('wheelFR', new T.Group(), { x: 0.98, y: 0.42, z: -1.4 }, { x: 1.7, y: 0.42, z: -1.4 });
    this.createSubPart('wheelRL', new T.Group(), { x: -0.98, y: 0.42, z: 1.4 }, { x: -1.7, y: 0.42, z: 1.4 });
    this.createSubPart('wheelRR', new T.Group(), { x: 0.98, y: 0.42, z: 1.4 }, { x: 1.7, y: 0.42, z: 1.4 });

    // Lower Sedan Body
    const body = new T.Mesh(new T.BoxGeometry(1.95, 0.55, 4.4), this.materials.paint);
    body.position.set(0, 0.68, 0);
    this.parts.chassis.group.add(body);

    // Front Grille & Brand Emblem
    const frontGrille = new T.Mesh(new T.BoxGeometry(1.1, 0.28, 0.08), this.materials.chrome);
    frontGrille.position.set(0, 0.75, -2.22);
    const emblemTex = this.createBrandEmblemTexture(brand);
    const grilleEmblem = new T.Mesh(new T.CircleGeometry(0.1, 16), new T.MeshStandardMaterial({
      map: emblemTex,
      transparent: true
    }));
    grilleEmblem.position.set(0, 0.75, -2.27);
    grilleEmblem.rotation.y = Math.PI;
    this.parts.chassis.group.add(frontGrille, grilleEmblem);

    // Aerodynamic Glass Cabin
    const glass = new T.Mesh(new T.BoxGeometry(1.78, 0.6, 2.4), this.materials.glass);
    glass.position.set(0, 1.25, 0.1);
    const roof = new T.Mesh(new T.BoxGeometry(1.8, 0.06, 2.2), this.materials.paint);
    roof.position.set(0, 1.56, 0.1);
    this.parts.roof.group.add(glass, roof);

    // Front Hood & Engine
    const hood = new T.Mesh(new T.BoxGeometry(1.85, 0.1, 1.4), this.materials.paint);
    hood.position.set(0, 0.96, -1.35);
    this.parts.hood.group.add(hood);

    const engine = new T.Mesh(new T.BoxGeometry(0.75, 0.45, 0.75), this.materials.engineBlock);
    engine.position.set(0, 0.75, -1.3);
    this.parts.engine.group.add(engine);

    // Interior & Wheels
    this.parts.interior.group.add(this.buildInteriorCabin(T, 'sedan', brand));
    this.parts.wheelFL.group.add(this.buildRealisticWheel(T, 0.4, 0.24, false, brand));
    this.parts.wheelFR.group.add(this.buildRealisticWheel(T, 0.4, 0.24, false, brand));
    this.parts.wheelRL.group.add(this.buildRealisticWheel(T, 0.4, 0.24, false, brand));
    this.parts.wheelRR.group.add(this.buildRealisticWheel(T, 0.4, 0.24, false, brand));
  }

  // ========================================================
  // HOTSPOTS DEFINITIONS
  // ========================================================
  setupHotspotsOverlay() {
    this.hotspotContainer = document.createElement('div');
    this.hotspotContainer.className = 'studio-hotspots-overlay';
    this.container.appendChild(this.hotspotContainer);
    this.updateHotspotDefinitions('real_ferrari');
  }

  updateHotspotDefinitions(type, vehicle = null) {
    if (!this.hotspotContainer) return;
    this.hotspotContainer.innerHTML = '';

    const v = vehicle || this.state.activeVehicle;

    const defsMap = {
      real_ferrari: [
        { id: 'engine', title: '4.0L TWIN-TURBO V8 + 3 E-MOTORS', subtitle: '986 HP · 0-100 in 2.5s', desc: 'Ferrari hybrid hypercar powertrain with RAC-e electric front axle torque vectoring.', badge: 'FERRARI HYBRID', pos: [0, 1.6, 0.8] },
        { id: 'cockpit', title: 'FERRARI HUMAN-MACHINE COCKPIT', subtitle: 'Curved 16" Digital Cluster', desc: 'Touch-sensitive steering wheel with Manettino drive mode switch and head-up display.', badge: 'COCKPIT', pos: [-0.48, 1.6, -0.2] },
        { id: 'brakes', title: 'BREMBO CARBON-CERAMIC BRAKES', subtitle: 'Brake-by-Wire Technology', desc: 'Integrated brake regeneration seamlessly blends mechanical stopping with kinetic recovery.', badge: 'BRAKES', pos: [-1.4, 0.8, -1.4] },
        { id: 'aero', title: 'SHUT-OFF GURNEY ACTIVE WING', subtitle: '390 kg Downforce at 250 km/h', desc: 'Patented active aerodynamic system modulates air flow over the rear engine decklid.', badge: 'AERODYNAMICS', pos: [0, 1.5, 1.8] }
      ],
      suv: [
        { id: 'engine', title: v ? `${v.powerHp} HP · ${v.fuel.split(' ')[0]}` : '2.8L D-4D TURBO DIESEL', subtitle: v ? v.drivetrain : '500 Nm Torque · Dual 150L Tanks', desc: v ? v.description : 'Bulletproof Toyota diesel powertrain engineered for East African hills.', badge: 'POWERTRAIN', pos: [0, 1.8, -1.3] },
        { id: '4x4', title: '4WD & DUAL LOCKERS', subtitle: 'Active Traction Control (A-TRC)', desc: 'Conquers the mud and steep volcanic terrain of Musanze and Nyungwe Forest.', badge: '4X4 SYSTEM', pos: [-1.4, 0.8, -1.4] },
        { id: 'cabin', title: '7-PASSENGER LUXURY CABIN', subtitle: 'Dual AC & Refrigerator Coolbox', desc: 'Spacious 3-row interior with center console coolbox to keep drinks cold across Rwanda.', badge: '7-SEATER', pos: [0, 2.1, 0.4] }
      ],
      heavy_truck: [
        { id: 'engine', title: '9.7L STEYR WD615 HEAVY TURBO', subtitle: '371 HP · 1,500 Nm Torque', desc: 'Steyr-engineered heavy diesel engine powering African mining, quarrying, and highway transit.', badge: 'HEAVY DIESEL', pos: [0, 2.1, -0.8] },
        { id: 'tipper', title: '20m³ REINFORCED TIPPER BODY', subtitle: '25-Tonne Payload Capacity', desc: 'Heavy front hydraulic cylinder elevates the dump bed for swift cargo unloading.', badge: 'HYDRAULIC BED', pos: [0, 2.8, 1.2] },
        { id: 'cab', title: 'HIGH-VISIBILITY SLEEPER CAB', subtitle: 'Pneumatic Air Seat & Bunk', desc: 'Elevated trucker workstation with dual air brake dials and highway visibility.', badge: 'TRUCKER CAB', pos: [-0.65, 3.1, -1.2] }
      ],
      truck: [
        { id: 'engine', title: v ? `${v.powerHp} HP · ${v.fuel.split(' ')[0]}` : '2.4L GD-6 HIGH TORQUE', subtitle: v ? v.drivetrain : '150 HP · 400 Nm Torque', desc: v ? v.description : 'Renowned Toyota Hilux engine known worldwide for unbreakable durability.', badge: 'GD-6 DIESEL', pos: [0, 1.7, -1.3] },
        { id: 'bed', title: '1-TONNE HEAVY CARGO BED', subtitle: 'Reinforced Sports Roll Bar', desc: 'Carries heavy agricultural produce, construction supplies, and equipment anywhere.', badge: 'PAYLOAD', pos: [0, 1.7, 1.4] }
      ],
      motorcycle: [
        { id: 'engine', title: v ? `${v.brand} ${v.model}` : '150cc 4-STROKE AIR-COOLED', subtitle: v ? `Top Speed: ${v.topSpeed}` : 'Indestructible East African Hero', desc: v ? v.description : 'Runs over 50 km per liter with ultra-cheap maintenance anywhere in Kigali.', badge: 'MOTO-TAXI', pos: [0, 1.4, 0] },
        { id: 'sns', title: 'DUAL SPRING-IN-SPRING (SNS)', subtitle: 'Heavy Passenger & Cargo Shocks', desc: 'Patented twin rear shock absorbers engineered to carry heavy loads smoothly over Kigali hills.', badge: 'SNS SUSPENSION', pos: [0.35, 0.8, 0.9] }
      ],
      van: [
        { id: 'capacity', title: '15-PASSENGER TRANSIT CABIN', subtitle: 'Rwanda Commuter Standard', desc: 'The national standard for reliable passenger transport across all 30 districts of Rwanda.', badge: 'TWEGERANE', pos: [0, 2.3, 0.4] }
      ]
    };

    const defs = defsMap[type] || defsMap.suv;

    this.hotspotElements = defs.map(def => {
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

      if (v.z > 1) {
        el.style.display = 'none';
        return;
      }

      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-(v.y * 0.5) + 0.5) * height;

      el.style.display = 'block';
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ========================================================
  // VIEW MODES & INTERACTIVE CONTROLS
  // ========================================================
  setViewMode(mode, presetKey = 'driver') {
    this.state.viewMode = mode;
    this.state.cockpitPreset = presetKey;

    if (mode === 'outside') {
      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
    } else {
      const modelPresets = this.cockpitPresets[this.state.modelType] || this.cockpitPresets.suv;
      const preset = modelPresets[presetKey] || modelPresets.driver;
      this.cockpitLook.yaw = preset.yaw;
      this.cockpitLook.pitch = preset.pitch;
      this.cockpitLook.fov = preset.fov;
      this.camera.fov = preset.fov;
      this.camera.updateProjectionMatrix();
    }
  }

  toggleExplode() {
    this.state.isExploded = !this.state.isExploded;
    return this.state.isExploded;
  }

  setPaintColor(hex) {
    this.state.paintColor = hex;
    if (this.realMaterials && this.realMaterials.body) {
      this.realMaterials.body.color.set(hex);
    }
    if (this.materials && this.materials.paint) {
      this.materials.paint.color.set(hex);
    }
  }

  setInteriorColor(hex) {
    this.state.interiorColor = hex;
    if (this.realMaterials && this.realMaterials.interior) {
      this.realMaterials.interior.color.set(hex);
    }
    if (this.materials && this.materials.interior) {
      this.materials.interior.color.set(hex);
    }
  }

  setWheelStyle(style) {
    this.state.wheelStyle = style;
    const rimColor = style === 'sport' ? 0x111114 : (style === 'classic' ? 0xe5e7eb : 0xc89528);
    if (this.realMaterials && this.realMaterials.rims) {
      this.realMaterials.rims.color.set(rimColor);
    }
    if (this.materials && this.materials.chrome) {
      this.materials.chrome.color.set(rimColor);
    }
  }

  loadVehicleConfig(vehicle) {
    if (!vehicle) return;
    this.state.activeVehicle = vehicle;
    this.state.brand = vehicle.brand;
    if (vehicle.paintHex) {
      this.setPaintColor(vehicle.paintHex);
    }
    if (vehicle.interiorHex) {
      this.setInteriorColor(vehicle.interiorHex);
    }
    this.buildVehicle(vehicle.model3dType || 'suv', vehicle.brand);
    this.updateHotspotDefinitions(vehicle.model3dType || 'suv', vehicle);

    const titleEl = document.querySelector('.studio-logo-text');
    if (titleEl) {
      titleEl.textContent = `HURANOW 3D · ${vehicle.brand.toUpperCase()} ${vehicle.model.toUpperCase()}`;
    }

    // Sync HUD model buttons
    document.querySelectorAll('#studio-model-selector button').forEach(b => {
      b.classList.toggle('active', b.dataset.model === (vehicle.model3dType || 'suv'));
    });
  }

  toggleHeadlights() {
    this.state.headlightsOn = !this.state.headlightsOn;
    const intensity = this.state.headlightsOn ? 2.5 : 0.15;
    if (this.materials && this.materials.headlightEmissive) {
      this.materials.headlightEmissive.emissiveIntensity = intensity;
    }
    return this.state.headlightsOn;
  }

  toggleAutoRotate() {
    this.state.autoRotate = !this.state.autoRotate;
    return this.state.autoRotate;
  }

  zoom(delta) {
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
    if (this.state.viewMode === 'outside') {
      this.orbit.radius = clamp(this.orbit.radius + delta, this.orbit.minRadius, this.orbit.maxRadius);
    } else {
      this.cockpitLook.fov = clamp(this.cockpitLook.fov + delta * 8, 48, 95);
    }
  }

  /**
   * Pointer & Gestures
   * Allows natural page scrolling!
   * Wheel zooms ONLY if Ctrl is pressed or via HUD buttons.
   */
  bindEvents() {
    const cv = this.canvas;
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId);
      this.pointerMap.set(e.pointerId, [e.clientX, e.clientY]);
      this.isDragging = true;
      if (this.state.autoRotate) this.state.autoRotate = false;
    });

    cv.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const prev = this.pointerMap.get(e.pointerId);
      if (!prev) return;

      const dx = e.clientX - prev[0];
      const dy = e.clientY - prev[1];
      this.pointerMap.set(e.pointerId, [e.clientX, e.clientY]);

      if (this.state.viewMode === 'outside') {
        this.orbit.theta -= dx * 0.007;
        this.orbit.phi = clamp(this.orbit.phi + dy * 0.005, 0.05, 1.25);
      } else {
        // Cockpit 360 free look inside cabin
        this.cockpitLook.yaw += dx * 0.005;
        this.cockpitLook.pitch = clamp(this.cockpitLook.pitch + dy * 0.004, -1.15, 1.15);
      }
    });

    const endDrag = (e) => {
      this.pointerMap.delete(e.pointerId);
      if (this.pointerMap.size === 0) this.isDragging = false;
    };
    cv.addEventListener('pointerup', endDrag);
    cv.addEventListener('pointercancel', endDrag);

    cv.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        this.zoom(e.deltaY * 0.004);
      }
    }, { passive: false });

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

  renderLoop() {
    this.animId = requestAnimationFrame(() => this.renderLoop());

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const T = this.THREE;

    // 1. Scramble Lerp
    const targetProgress = this.state.isExploded ? 1.0 : 0.0;
    this.state.explodeProgress += (targetProgress - this.state.explodeProgress) * Math.min(1, dt * 5.5);

    const p = this.state.explodeProgress;
    for (const key in this.parts) {
      const part = this.parts[key];
      part.group.position.x = T.MathUtils.lerp(part.rest.x, part.target.x, p);
      part.group.position.y = T.MathUtils.lerp(part.rest.y, part.target.y, p);
      part.group.position.z = T.MathUtils.lerp(part.rest.z, part.target.z, p);
    }

    // 2. Camera Navigation
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

      const lookTarget = new T.Vector3(0, 0.75 + p * 0.45, 0);
      matrix.lookAt(targetPos, lookTarget, UP);
      targetQuat.setFromRotationMatrix(matrix);
      targetFov = 45;
    } else {
      // Inside Cockpit
      const modelPresets = this.cockpitPresets[this.state.modelType] || this.cockpitPresets.suv;
      const preset = modelPresets[this.state.cockpitPreset] || modelPresets.driver;
      targetPos.set(preset.pos[0], preset.pos[1], preset.pos[2]);

      const euler = new T.Euler(this.cockpitLook.pitch, this.cockpitLook.yaw, 0, 'YXZ');
      targetQuat.setFromEuler(euler);
      targetFov = this.cockpitLook.fov;
    }

    const smoothK = Math.min(1, dt * 6.5);
    this.camera.position.lerp(targetPos, smoothK);
    this.camera.quaternion.slerp(targetQuat, Math.min(1, dt * 7.5));
    this.camera.fov += (targetFov - this.camera.fov) * smoothK;
    this.camera.updateProjectionMatrix();

    if (this.cabinLight) {
      const targetCabinLight = this.state.viewMode === 'cockpit' ? 1.6 : 0.6;
      this.cabinLight.intensity += (targetCabinLight - this.cabinLight.intensity) * smoothK;
    }

    // 3. Hotspots
    this.updateHotspotScreenPositions();

    // 4. Render
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
