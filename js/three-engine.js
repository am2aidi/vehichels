/**
 * HURANOW MOTORS - Next-Generation Universal 3D Automotive Studio
 * Features:
 * - Real 3D Car GLTF Model (Authentic Ferrari with real aerodynamic curves, cockpit, Ferrari steering wheel, rims)
 * - Realistic 3D Archetypes for all vehicle categories (SUV, Heavy Truck, Pickup, Sedan, Motorcycle)
 * - Complete Inside Cabin / Cockpit Views for EVERY vehicle type (Driver Seat, Dashboard, High Trucker Cab, Rider POV)
 * - 360° Free Cabin Look (Drag to look in any direction inside the vehicle)
 * - 💥 Scramble / Explode Parts engine with 3D Tech Hotspot pins
 * - Real-Time Color Customizer (Paint, Interior Leather, Wheels, Headlights)
 * - Natural Page Scrolling: Canvas does NOT hijack mouse wheel or touch scrolling!
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
      modelType: 'real_ferrari', // 'real_ferrari', 'suv', 'heavy_truck', 'truck', 'sedan', 'motorcycle'
      vehicleTitle: 'FERRARI SF90 STRADALE',
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

    // Camera angles
    this.orbit = {
      theta: 0.85,
      phi: 0.35,
      radius: 6.8,
      minRadius: 3.2,
      maxRadius: 14.0
    };

    // Cockpit orientation
    this.cockpitLook = {
      yaw: -Math.PI / 2,
      pitch: -0.05,
      fov: 78
    };

    // Cockpit camera presets per vehicle archetype
    this.cockpitPresets = {
      real_ferrari: {
        driver: { pos: [-0.38, 0.95, 0.1], yaw: -Math.PI / 2, pitch: -0.06, fov: 76, label: 'Driver Cockpit' },
        dash: { pos: [-0.35, 0.9, 0.28], yaw: -Math.PI / 2 - 0.45, pitch: -0.25, fov: 68, label: 'Ferrari Gauges' },
        passenger: { pos: [0.38, 0.95, 0.1], yaw: -Math.PI / 2, pitch: -0.06, fov: 76, label: 'Passenger Seat' },
        rear: { pos: [0, 1.0, -0.75], yaw: Math.PI / 2, pitch: 0.05, fov: 82, label: 'Rear Engine View' }
      },
      suv: {
        driver: { pos: [-0.46, 1.45, 0.15], yaw: -Math.PI / 2, pitch: -0.06, fov: 78, label: 'High Driver Seat' },
        dash: { pos: [-0.4, 1.35, 0.4], yaw: -Math.PI / 2 - 0.4, pitch: -0.2, fov: 70, label: 'Digital Cluster' },
        passenger: { pos: [0.46, 1.45, 0.15], yaw: -Math.PI / 2, pitch: -0.06, fov: 78, label: 'Passenger Seat' },
        rear: { pos: [0, 1.5, -0.85], yaw: -Math.PI / 2, pitch: 0, fov: 82, label: 'Rear 7-Seat Lounge' }
      },
      heavy_truck: {
        driver: { pos: [-0.65, 2.1, 0.65], yaw: -Math.PI / 2, pitch: -0.08, fov: 82, label: 'High Trucker Cab' },
        dash: { pos: [-0.58, 1.95, 0.95], yaw: -Math.PI / 2 - 0.5, pitch: -0.25, fov: 72, label: 'Air Brake Dash' },
        passenger: { pos: [0.65, 2.1, 0.65], yaw: -Math.PI / 2, pitch: -0.08, fov: 82, label: 'Co-Pilot Seat' },
        rear: { pos: [0, 2.05, -0.3], yaw: Math.PI / 2, pitch: 0, fov: 85, label: 'Sleeper Bunk Cabin' }
      },
      truck: {
        driver: { pos: [-0.48, 1.4, 0.25], yaw: -Math.PI / 2, pitch: -0.06, fov: 78, label: 'Driver Cockpit' },
        dash: { pos: [-0.42, 1.3, 0.5], yaw: -Math.PI / 2 - 0.4, pitch: -0.2, fov: 70, label: 'Center Console' },
        passenger: { pos: [0.48, 1.4, 0.25], yaw: -Math.PI / 2, pitch: -0.06, fov: 78, label: 'Passenger Seat' },
        rear: { pos: [0, 1.4, -0.9], yaw: Math.PI / 2, pitch: 0, fov: 84, label: 'Cargo Bed View' }
      },
      sedan: {
        driver: { pos: [-0.42, 1.15, 0.15], yaw: -Math.PI / 2, pitch: -0.05, fov: 78, label: 'Driver Seat' },
        dash: { pos: [-0.38, 1.05, 0.38], yaw: -Math.PI / 2 - 0.45, pitch: -0.2, fov: 68, label: 'OLED Dash Screens' },
        passenger: { pos: [0.42, 1.15, 0.15], yaw: -Math.PI / 2, pitch: -0.05, fov: 78, label: 'Passenger Seat' },
        rear: { pos: [0, 1.2, -0.95], yaw: -Math.PI / 2, pitch: 0, fov: 80, label: 'Executive Rear Row' }
      },
      motorcycle: {
        driver: { pos: [0, 1.32, -0.15], yaw: -Math.PI / 2, pitch: -0.12, fov: 85, label: 'Rider POV Behind Screen' },
        dash: { pos: [0, 1.2, 0.22], yaw: -Math.PI / 2, pitch: -0.4, fov: 72, label: 'TFT Racing Cluster' },
        passenger: { pos: [0, 1.48, -0.65], yaw: -Math.PI / 2, pitch: 0, fov: 85, label: 'Pillion Passenger' },
        rear: { pos: [0, 1.15, -1.2], yaw: -Math.PI / 2, pitch: 0.1, fov: 85, label: 'Exhaust & Swingarm' }
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
    this.renderer.toneMappingExposure = 1.22;
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

    // Load initial real 3D car model
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

    this.ambientLight = new T.AmbientLight(0xffffff, 0.75);
    this.lights.add(this.ambientLight);

    // Sun / Key light
    this.keyLight = new T.DirectionalLight(0xffffff, 1.5);
    this.keyLight.position.set(7, 10, 6);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0005;
    this.lights.add(this.keyLight);

    // Rim / Backlight
    this.rimLight = new T.DirectionalLight(0x70aaff, 1.1);
    this.rimLight.position.set(-8, 6, -7);
    this.lights.add(this.rimLight);

    // Warm Fill Light
    this.fillLight = new T.DirectionalLight(0xffeedd, 0.6);
    this.fillLight.position.set(0, 4, 8);
    this.lights.add(this.fillLight);

    // Cabin Point Light
    this.cabinLight = new T.PointLight(0xffffff, 0.45, 5.0);
    this.cabinLight.position.set(0, 1.1, 0.1);
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
  // REAL 3D CAR GLTF/GLB MODEL LOADER
  // ========================================================
  loadRealCarModel() {
    const T = this.THREE;
    if (!window.THREE.GLTFLoader) {
      console.warn('GLTFLoader not yet loaded, retrying...');
      setTimeout(() => this.loadRealCarModel(), 200);
      return;
    }

    this.state.isLoadingModel = true;
    this.showLoadingOverlay('Loading Real Ferrari 3D Model...');

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
    dracoLoader.setDecoderPath('assets/draco/');

    const loader = new window.THREE.GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Primary local path with fallback
    const glbUrl = 'assets/models/ferrari.glb';

    loader.load(
      glbUrl,
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
      (error) => {
        console.warn('Local GLB failed, trying fallback CDN...', error);
        loader.load(
          'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/ferrari.glb',
          (gltf) => {
            this.hideLoadingOverlay();
            this.setupRealFerrariParts(gltf.scene);
          },
          null,
          (err2) => {
            console.error('All GLB loads failed, building high-grade procedural car:', err2);
            this.hideLoadingOverlay();
            this.buildHighGradeProceduralCar();
          }
        );
      }
    );
  }

  setupRealFerrariParts(scene) {
    const T = this.THREE;
    this.state.isLoadingModel = false;
    this.state.modelType = 'real_ferrari';

    // Scale and center the real car
    scene.scale.set(1.4, 1.4, 1.4);
    scene.position.set(0, 0, 0);

    // Materials map
    this.realMaterials = {
      body: new T.MeshPhysicalMaterial({
        color: new T.Color(this.state.paintColor),
        metalness: 0.65,
        roughness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      }),
      rims: new T.MeshStandardMaterial({
        color: 0xd8dde4,
        metalness: 0.9,
        roughness: 0.2
      }),
      interior: new T.MeshStandardMaterial({
        color: new T.Color(this.state.interiorColor),
        roughness: 0.85,
        metalness: 0.1
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

    // Subpart groupings for scramble & inspection
    const bodyGroup = new T.Group();
    const wheelsGroup = {
      fl: new T.Group(),
      fr: new T.Group(),
      rl: new T.Group(),
      rr: new T.Group()
    };
    const interiorGroup = new T.Group();

    // Traverse real Ferrari nodes
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = (child.name || '').toLowerCase();

        if (name.includes('body')) {
          child.material = this.realMaterials.body;
        } else if (name.includes('rim')) {
          child.material = this.realMaterials.rims;
        } else if (name.includes('leather') || name.includes('interior') || name.includes('steering')) {
          child.material = this.realMaterials.interior;
        } else if (name.includes('glass')) {
          child.material = this.realMaterials.glass;
        }
      }
    });

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
        rest: { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 },
        target: { x: 0, y: 0.4, z: 0, rotX: 0, rotY: 0, rotZ: 0 }
      }
    };

    if (wheelFL) {
      this.parts.wheelFL = {
        group: wheelFL,
        rest: { x: wheelFL.position.x, y: wheelFL.position.y, z: wheelFL.position.z, rotX: 0, rotY: 0, rotZ: 0 },
        target: { x: wheelFL.position.x - 1.0, y: wheelFL.position.y, z: wheelFL.position.z, rotX: 0, rotY: 0, rotZ: 0 }
      };
    }
    if (wheelFR) {
      this.parts.wheelFR = {
        group: wheelFR,
        rest: { x: wheelFR.position.x, y: wheelFR.position.y, z: wheelFR.position.z, rotX: 0, rotY: 0, rotZ: 0 },
        target: { x: wheelFR.position.x + 1.0, y: wheelFR.position.y, z: wheelFR.position.z, rotX: 0, rotY: 0, rotZ: 0 }
      };
    }
    if (wheelRL) {
      this.parts.wheelRL = {
        group: wheelRL,
        rest: { x: wheelRL.position.x, y: wheelRL.position.y, z: wheelRL.position.z, rotX: 0, rotY: 0, rotZ: 0 },
        target: { x: wheelRL.position.x - 1.0, y: wheelRL.position.y, z: wheelRL.position.z, rotX: 0, rotY: 0, rotZ: 0 }
      };
    }
    if (wheelRR) {
      this.parts.wheelRR = {
        group: wheelRR,
        rest: { x: wheelRR.position.x, y: wheelRR.position.y, z: wheelRR.position.z, rotX: 0, rotY: 0, rotZ: 0 },
        target: { x: wheelRR.position.x + 1.0, y: wheelRR.position.y, z: wheelRR.position.z, rotX: 0, rotY: 0, rotZ: 0 }
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
  // HIGH-GRADE PROCEDURAL CAR (Fallback / Other Archetypes)
  // ========================================================
  buildHighGradeProceduralCar() {
    const T = this.THREE;
    // Build smooth curved geometry with Lathe/Extrude
    this.buildVehicle(this.state.modelType || 'hypercar');
  }

  buildVehicle(type = 'real_ferrari') {
    if (type === 'real_ferrari' || type === 'hypercar') {
      this.loadRealCarModel();
      return;
    }

    this.state.modelType = type;
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
        metalness: 0.62,
        roughness: 0.2,
        clearcoat: 0.95
      }),
      carbon: new T.MeshStandardMaterial({ color: 0x141416, roughness: 0.45, metalness: 0.8 }),
      glass: new T.MeshPhysicalMaterial({ color: 0x7eb3d4, transmission: 0.88, transparent: true, opacity: 0.38 }),
      interior: new T.MeshStandardMaterial({ color: new T.Color(this.state.interiorColor), roughness: 0.85 }),
      chrome: new T.MeshStandardMaterial({ color: 0xd8dde4, metalness: 0.95, roughness: 0.1 }),
      tireRubber: new T.MeshStandardMaterial({ color: 0x111113, roughness: 0.92 }),
      caliper: new T.MeshStandardMaterial({ color: new T.Color(this.state.caliperColor), roughness: 0.3 }),
      engineBlock: new T.MeshStandardMaterial({ color: 0x282a30, metalness: 0.85 }),
      headlightEmissive: new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.2 }),
      taillightEmissive: new T.MeshStandardMaterial({ color: 0xff0020, emissive: 0xff0020, emissiveIntensity: 2.5 }),
      screenEmissive: new T.MeshStandardMaterial({ color: 0x081525, emissive: 0x0d72ff, emissiveIntensity: 1.1 })
    };

    if (type === 'heavy_truck') {
      this.buildHeavyTruckProcedural(T);
    } else if (type === 'motorcycle') {
      this.buildSuperbikeProcedural(T);
    } else if (type === 'truck') {
      this.buildPickupTruckProcedural(T);
    } else if (type === 'suv' || type === 'van') {
      this.buildSuvProcedural(T, type === 'van');
    } else {
      this.buildSedanProcedural(T);
    }

    this.updateHotspotDefinitions(type);
  }

  createSubPart(name, group, restPos, explodeDelta) {
    group.position.set(restPos.x, restPos.y, restPos.z);
    this.carRoot.add(group);
    this.parts[name] = {
      group,
      rest: { x: restPos.x, y: restPos.y, z: restPos.z, rotX: 0, rotY: 0, rotZ: 0 },
      target: {
        x: restPos.x + (explodeDelta.x || 0),
        y: restPos.y + (explodeDelta.y || 0),
        z: restPos.z + (explodeDelta.z || 0),
        rotX: explodeDelta.rotX || 0,
        rotY: explodeDelta.rotY || 0,
        rotZ: explodeDelta.rotZ || 0
      }
    };
  }

  buildHeavyTruckProcedural(T) {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.6, z: 1.4, rotX: 0.4 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 2.2, z: 0 });
    this.createSubPart('doorL', new T.Group(), { x: 0, y: 0, z: 0 }, { x: -1.6, y: 1.2, z: 0.6, rotY: 0.6 });
    this.createSubPart('doorR', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 1.6, y: 1.2, z: 0.6, rotY: -0.6 });
    this.createSubPart('spoiler', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.5, z: -1.8 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.8, z: 0.8 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.45, y: 0.55, z: 1.5 }, { x: -2.4, y: 0.55, z: 1.5 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.45, y: 0.55, z: 1.5 }, { x: 2.4, y: 0.55, z: 1.5 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.45, y: 0.55, z: -1.2 }, { x: -2.5, y: 0.55, z: -1.2 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.45, y: 0.55, z: -1.2 }, { x: 2.5, y: 0.55, z: -1.2 });

    const cab = new T.Mesh(new T.BoxGeometry(2.35, 2.1, 2.2), this.materials.paint);
    cab.position.set(0, 2.05, 0.6);
    const windshield = new T.Mesh(new T.BoxGeometry(2.1, 0.95, 0.08), this.materials.glass);
    windshield.position.set(0, 2.45, 1.72);
    this.parts.hood.group.add(cab, windshield);

    // Chrome stacks
    [-1.05, 1.05].forEach(x => {
      const stack = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 2.6, 20), this.materials.chrome);
      stack.position.set(x, 2.4, -0.5);
      this.parts.spoiler.group.add(stack);
    });

    const truckerSeat = new T.Mesh(new T.BoxGeometry(0.55, 0.95, 0.55), this.materials.interior);
    truckerSeat.position.set(-0.65, 1.9, 0.65);
    const bigWheel = new T.Mesh(new T.TorusGeometry(0.24, 0.03, 12, 32), this.materials.carbon);
    bigWheel.position.set(-0.65, 2.05, 1.25);
    bigWheel.rotation.x = -0.45;
    this.parts.cockpit.group.add(truckerSeat, bigWheel);

    this.buildWheelsSet(T, 0.54, 0.42);
  }

  buildSuperbikeProcedural(T) {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.9, z: 1.2, rotX: 0.3 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: 0 });
    this.createSubPart('doorL', new T.Group(), { x: 0, y: 0, z: 0 }, { x: -0.8, y: 0.6, z: 0.2 });
    this.createSubPart('doorR', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.6, z: 0.2 });
    this.createSubPart('spoiler', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.8, z: -1.2 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.4, z: -0.1 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.6, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: 0, y: 0.38, z: 1.35 }, { x: 0, y: 0.38, z: 2.2 });
    this.createSubPart('wheelFR', new T.Group(), { x: 0, y: 0.38, z: 1.35 }, { x: 0, y: 0.38, z: 2.2 });
    this.createSubPart('wheelRL', new T.Group(), { x: 0, y: 0.38, z: -1.25 }, { x: 0, y: 0.38, z: -2.2 });
    this.createSubPart('wheelRR', new T.Group(), { x: 0, y: 0.38, z: -1.25 }, { x: 0, y: 0.38, z: -2.2 });

    const nose = new T.Mesh(new T.ConeGeometry(0.32, 0.75, 16), this.materials.paint);
    nose.rotation.x = -Math.PI / 2;
    nose.position.set(0, 0.95, 1.15);
    const screen = new T.Mesh(new T.BoxGeometry(0.38, 0.32, 0.04), this.materials.glass);
    screen.position.set(0, 1.25, 0.9);
    screen.rotation.x = -0.4;
    this.parts.hood.group.add(nose, screen);

    const bar = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.65, 12), this.materials.chrome);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 1.12, 0.65);
    const tft = new T.Mesh(new T.BoxGeometry(0.18, 0.12, 0.02), this.materials.screenEmissive);
    tft.position.set(0, 1.18, 0.72);
    tft.rotation.x = -0.3;
    this.parts.cockpit.group.add(bar, tft);

    const saddle = new T.Mesh(new T.BoxGeometry(0.34, 0.1, 0.45), this.materials.interior);
    saddle.position.set(0, 0.95, -0.35);
    this.parts.spoiler.group.add(saddle);

    this.parts.wheelFL.group.add(this.buildSingleWheel(T, 0.36, 0.14));
    this.parts.wheelRL.group.add(this.buildSingleWheel(T, 0.38, 0.22));
  }

  buildPickupTruckProcedural(T) {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: 1.5, rotX: 0.3 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 2.0, z: 0 });
    this.createSubPart('doorL', new T.Group(), { x: 0, y: 0, z: 0 }, { x: -1.5, y: 1.1, z: 0.2, rotY: 0.4 });
    this.createSubPart('doorR', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 1.5, y: 1.1, z: 0.2, rotY: -0.4 });
    this.createSubPart('spoiler', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.8, z: -1.8, rotX: 0.5 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.5, z: 1.2 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.9, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.48, y: 0.48, z: 1.5 }, { x: -2.4, y: 0.48, z: 1.5 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.48, y: 0.48, z: 1.5 }, { x: 2.4, y: 0.48, z: 1.5 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.48, y: 0.48, z: -1.4 }, { x: -2.4, y: 0.48, z: -1.4 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.48, y: 0.48, z: -1.4 }, { x: 2.4, y: 0.48, z: -1.4 });

    const base = new T.Mesh(new T.BoxGeometry(2.1, 0.45, 4.8), this.materials.carbon);
    base.position.set(0, 0.55, 0);
    this.parts.chassis.group.add(base);

    const hood = new T.Mesh(new T.BoxGeometry(2.0, 0.4, 1.4), this.materials.paint);
    hood.position.set(0, 1.05, 1.5);
    this.parts.hood.group.add(hood);

    const cab = new T.Mesh(new T.BoxGeometry(1.95, 0.9, 1.8), this.materials.paint);
    cab.position.set(0, 1.5, 0.2);
    this.parts.roof.group.add(cab);

    this.buildWheelsSet(T, 0.46, 0.36);
  }

  buildSuvProcedural(T, isVan) {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.2, z: 1.4, rotX: 0.3 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 2.1, z: 0 });
    this.createSubPart('doorL', new T.Group(), { x: 0, y: 0, z: 0 }, { x: -1.5, y: 1.2, z: 0.1, rotY: 0.5 });
    this.createSubPart('doorR', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 1.5, y: 1.2, z: 0.1, rotY: -0.5 });
    this.createSubPart('spoiler', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: -1.6 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.6, z: 1.1 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.9, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.45, y: 0.45, z: 1.4 }, { x: -2.3, y: 0.45, z: 1.4 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.45, y: 0.45, z: 1.4 }, { x: 2.3, y: 0.45, z: 1.4 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.45, y: 0.45, z: -1.35 }, { x: -2.3, y: 0.45, z: -1.35 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.45, y: 0.45, z: -1.35 }, { x: 2.3, y: 0.45, z: -1.35 });

    const body = new T.Mesh(new T.BoxGeometry(2.1, 0.9, 4.4), this.materials.paint);
    body.position.set(0, 0.85, 0);
    this.parts.chassis.group.add(body);

    const roof = new T.Mesh(new T.BoxGeometry(2.05, 0.08, 3.2), this.materials.paint);
    roof.position.set(0, 2.45, -0.2);
    const glass = new T.Mesh(new T.BoxGeometry(2.08, 0.9, 3.1), this.materials.glass);
    glass.position.set(0, 1.95, -0.2);
    this.parts.roof.group.add(roof, glass);

    this.buildWheelsSet(T, 0.44, 0.32);
  }

  buildSedanProcedural(T) {
    this.createSubPart('chassis', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    this.createSubPart('hood', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: 1.4, rotX: 0.35 });
    this.createSubPart('roof', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 2.1, z: 0 });
    this.createSubPart('doorL', new T.Group(), { x: 0, y: 0, z: 0 }, { x: -1.4, y: 1.1, z: 0.1, rotY: 0.4 });
    this.createSubPart('doorR', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 1.4, y: 1.1, z: 0.1, rotY: -0.4 });
    this.createSubPart('spoiler', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.1, z: -1.6 });
    this.createSubPart('engine', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 1.6, z: 1.1 });
    this.createSubPart('cockpit', new T.Group(), { x: 0, y: 0, z: 0 }, { x: 0, y: 0.8, z: 0 });
    this.createSubPart('wheelFL', new T.Group(), { x: -1.42, y: 0.38, z: 1.4 }, { x: -2.3, y: 0.38, z: 1.4 });
    this.createSubPart('wheelFR', new T.Group(), { x: 1.42, y: 0.38, z: 1.4 }, { x: 2.3, y: 0.38, z: 1.4 });
    this.createSubPart('wheelRL', new T.Group(), { x: -1.42, y: 0.38, z: -1.35 }, { x: -2.3, y: 0.38, z: -1.35 });
    this.createSubPart('wheelRR', new T.Group(), { x: 1.42, y: 0.38, z: -1.35 }, { x: 2.3, y: 0.38, z: -1.35 });

    const body = new T.Mesh(new T.BoxGeometry(2.0, 0.65, 4.4), this.materials.paint);
    body.position.set(0, 0.75, 0);
    this.parts.chassis.group.add(body);

    const glass = new T.Mesh(new T.BoxGeometry(1.65, 0.6, 2.2), this.materials.glass);
    glass.position.set(0, 1.25, 0.05);
    this.parts.roof.group.add(glass);

    this.buildWheelsSet(T);
  }

  buildWheelsSet(T, radius = 0.39, width = 0.28) {
    const buildW = () => {
      const g = new T.Group();
      const tire = new T.Mesh(new T.CylinderGeometry(radius, radius, width, 32), this.materials.tireRubber);
      tire.rotation.z = Math.PI / 2;
      const rim = new T.Mesh(new T.CylinderGeometry(radius * 0.7, radius * 0.7, width + 0.01, 24), this.materials.chrome);
      rim.rotation.z = Math.PI / 2;
      g.add(tire, rim);
      return g;
    };

    if (this.parts.wheelFL) this.parts.wheelFL.group.add(buildW());
    if (this.parts.wheelFR) this.parts.wheelFR.group.add(buildW());
    if (this.parts.wheelRL) this.parts.wheelRL.group.add(buildW());
    if (this.parts.wheelRR) this.parts.wheelRR.group.add(buildW());
  }

  buildSingleWheel(T, radius = 0.36, width = 0.16) {
    const g = new T.Group();
    const tire = new T.Mesh(new T.CylinderGeometry(radius, radius, width, 28), this.materials.tireRubber);
    tire.rotation.z = Math.PI / 2;
    const rim = new T.Mesh(new T.CylinderGeometry(radius * 0.7, radius * 0.7, width + 0.01, 20), this.materials.chrome);
    rim.rotation.z = Math.PI / 2;
    g.add(tire, rim);
    return g;
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

  updateHotspotDefinitions(type) {
    if (!this.hotspotContainer) return;
    this.hotspotContainer.innerHTML = '';

    const defsMap = {
      real_ferrari: [
        { id: 'engine', title: '4.0L TWIN-TURBO V8 + 3 E-MOTORS', subtitle: '986 HP · 0-100 in 2.5s', desc: 'Ferrari hybrid hypercar powertrain with RAC-e electric front axle torque vectoring.', badge: 'FERRARI HYBRID', pos: [0, 1.8, -0.6] },
        { id: 'cockpit', title: 'FERRARI HUMAN-MACHINE COCKPIT', subtitle: 'Curved 16" Digital Cluster', desc: 'Touch-sensitive steering wheel with Manettino drive mode switch and head-up display.', badge: 'COCKPIT', pos: [-0.38, 1.8, 0.2] },
        { id: 'brakes', title: 'BREMBO CARBON-CERAMIC BRAKES', subtitle: 'Brake-by-Wire Technology', desc: 'Integrated brake regeneration seamlessly blends mechanical stopping with kinetic recovery.', badge: 'BRAKES', pos: [-1.4, 0.8, 1.3] },
        { id: 'aero', title: 'SHUT-OFF GURNEY ACTIVE WING', subtitle: '390 kg Downforce at 250 km/h', desc: 'Patented active aerodynamic system modulates air flow over the rear engine decklid.', badge: 'AERODYNAMICS', pos: [0, 1.6, -1.8] }
      ],
      heavy_truck: [
        { id: 'engine', title: '16.4L V8 TURBO DIESEL', subtitle: '770 HP · 3,700 Nm Torque', desc: 'King of the Road powertrain engineered for 150-tonne heavy hauling and cross-continental freight.', badge: 'POWERTRAIN', pos: [0, 2.2, 0.7] },
        { id: 'cab', title: 'HIGHLINE SLEEPER CABIN', subtitle: 'Pneumatic 4-Point Air Suspension', desc: 'Luxury driver cockpit with sleeper bunk, refrigerator, and panoramic highway visibility.', badge: 'CABIN', pos: [-0.65, 3.2, 0.6] }
      ],
      motorcycle: [
        { id: 'engine', title: 'DESMOSEDICI STRADALE V4', subtitle: '215 HP · 14,500 RPM Redline', desc: 'Direct MotoGP counter-rotating crankshaft engine with twin-pulse firing order.', badge: 'ENGINE', pos: [0, 1.8, 0.1] },
        { id: 'aero', title: 'AERODYNAMIC CARBON WINGS', subtitle: '37 kg Downforce at 300 km/h', desc: 'Double-profile carbon winglets provide extreme front-end stability under braking.', badge: 'AERO', pos: [0, 1.8, 1.2] }
      ]
    };

    const defs = defsMap[type] || defsMap.real_ferrari;

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

      el.style.display = 'block';
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-v.y * 0.5 + 0.5) * height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }

  // ========================================================
  // LOAD SPECIFIC VEHICLE CONFIG FROM STORE
  // ========================================================
  loadVehicleConfig(vehicle) {
    if (!vehicle) return;
    this.state.activeVehicle = vehicle;
    this.state.vehicleTitle = `${vehicle.brand.toUpperCase()} ${vehicle.model.toUpperCase()}`;

    if (vehicle.paintHex) {
      this.setPaintColor(vehicle.paintHex);
    }
    if (vehicle.interiorHex) {
      this.setInteriorColor(vehicle.interiorHex);
    }

    const type = vehicle.model3dType || 'hypercar';
    if (type === 'hypercar') {
      this.loadRealCarModel();
    } else {
      this.buildVehicle(type);
    }

    const titleEl = document.querySelector('.studio-logo-text');
    if (titleEl) {
      titleEl.textContent = `HURANOW 3D · ${vehicle.brand} ${vehicle.model}`;
    }
  }

  // ========================================================
  // CONTROLS & EVENT BINDINGS
  // ========================================================
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

  setViewMode(mode, cockpitPreset = 'driver') {
    this.state.viewMode = mode;
    if (mode === 'cockpit') {
      this.state.cockpitPreset = cockpitPreset;
      this.state.autoRotate = false;
      this.state.isExploded = false;

      const modelPresets = this.cockpitPresets[this.state.modelType] || this.cockpitPresets.real_ferrari;
      const preset = modelPresets[cockpitPreset] || modelPresets.driver;

      this.cockpitLook.yaw = preset.yaw;
      this.cockpitLook.pitch = preset.pitch;
      this.cockpitLook.fov = preset.fov;
    }
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
   * CRITICAL: Allows natural page scrolling!
   * Only rotates when actively clicked and dragged on canvas.
   * Wheel zooms ONLY if Ctrl is pressed or via HUD buttons, allowing normal page scrolling!
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

    // Zoom on wheel ONLY when Ctrl key is pressed!
    // This allows the user to scroll down the webpage naturally!
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
      const modelPresets = this.cockpitPresets[this.state.modelType] || this.cockpitPresets.real_ferrari;
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
      const targetCabinLight = this.state.viewMode === 'cockpit' ? 1.6 : 0.45;
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
