"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import type { ReactorSystem, ReactorComponent } from "@/lib/reactor/schemas";
import styles from "./Reactor3DCanvas.module.css";

export interface Reactor3DCanvasProps {
  system: ReactorSystem;
  selectedId: string | null;
  onSelectPart: (id: string) => void;
  powerLevel: 100 | 50 | 0;
  activeLoopFilter: "all" | "primary" | "secondary" | "tertiary";
}

interface ComponentTarget {
  pos: THREE.Vector3;
  camPos: THREE.Vector3;
}

export function Reactor3DCanvas({
  system,
  selectedId,
  onSelectPart,
  powerLevel,
  activeLoopFilter,
}: Reactor3DCanvasProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const plantGroupRef = useRef<THREE.Group | null>(null);

  // Animated elements refs
  const turbineRotorsRef = useRef<THREE.Mesh[]>([]);
  const controlRodsRef = useRef<THREE.Group | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const vaporParticlesRef = useRef<{ mesh: THREE.Mesh; speed: number }[]>([]);
  const flowParticlesRef = useRef<
    {
      mesh: THREE.Mesh;
      progress: number;
      speed: number;
      curve: THREE.CatmullRomCurve3;
      loop: string;
    }[]
  >([]);
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);

  // Camera Orbit & Zoom State
  const targetCamPosRef = useRef(new THREE.Vector3(20, 30, 140));
  const targetLookAtRef = useRef(new THREE.Vector3(12, -2, 0));
  const isTransitioningRef = useRef(false);

  // UI State
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [hoveredComponent, setHoveredComponent] =
    useState<ReactorComponent | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [zoomPercent, setZoomPercent] = useState(100);

  const activeLoopFilterRef = useRef(activeLoopFilter);
  useEffect(() => {
    activeLoopFilterRef.current = activeLoopFilter;
  }, [activeLoopFilter]);

  // Raycaster for mouse interaction
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-1000, -1000));

  // Sync auto rotate state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, [isAutoRotate]);

  // Map of component target positions for smooth zoom
  const getComponentTargets = useCallback(
    (sysId: string): Record<string, ComponentTarget> => {
      if (sysId === "bwr") {
        return {
          "bwr-rpv": {
            pos: new THREE.Vector3(-28, 0, 0),
            camPos: new THREE.Vector3(-28, 6, 46),
          },
          "bwr-fuel": {
            pos: new THREE.Vector3(-28, -5, 0),
            camPos: new THREE.Vector3(-28, -3, 30),
          },
          "bwr-control-rods": {
            pos: new THREE.Vector3(-28, -16, 0),
            camPos: new THREE.Vector3(-28, -14, 32),
          },
          "bwr-steam-sep": {
            pos: new THREE.Vector3(-28, 9, 0),
            camPos: new THREE.Vector3(-28, 11, 35),
          },
          "bwr-recirc-pump": {
            pos: new THREE.Vector3(-14, -15, 6),
            camPos: new THREE.Vector3(-14, -12, 34),
          },
          "bwr-turbine": {
            pos: new THREE.Vector3(32, -4, 0),
            camPos: new THREE.Vector3(32, -2, 45),
          },
          "bwr-condenser": {
            pos: new THREE.Vector3(32, -18, 0),
            camPos: new THREE.Vector3(32, -15, 40),
          },
          "bwr-containment": {
            pos: new THREE.Vector3(-22, 6, 0),
            camPos: new THREE.Vector3(-22, 10, 85),
          },
          "bwr-suppression-pool": {
            pos: new THREE.Vector3(-22, -22, 0),
            camPos: new THREE.Vector3(-22, -18, 48),
          },
          "bwr-cooling-water": {
            pos: new THREE.Vector3(78, 8, 0),
            camPos: new THREE.Vector3(78, 12, 60),
          },
        };
      }

      if (sysId === "phwr") {
        return {
          "phwr-calandria": {
            pos: new THREE.Vector3(-30, -3, 0),
            camPos: new THREE.Vector3(-30, -1, 45),
          },
          "phwr-fuel-channels": {
            pos: new THREE.Vector3(-30, -3, 0),
            camPos: new THREE.Vector3(-30, -2, 35),
          },
          "phwr-fuel-bundles": {
            pos: new THREE.Vector3(-30, -3, 0),
            camPos: new THREE.Vector3(-30, -2, 28),
          },
          "phwr-control-mechanisms": {
            pos: new THREE.Vector3(-30, 9, 0),
            camPos: new THREE.Vector3(-30, 11, 35),
          },
          "phwr-steam-gen": {
            pos: new THREE.Vector3(-8, 7, 0),
            camPos: new THREE.Vector3(-8, 10, 45),
          },
          "phwr-primary-pump": {
            pos: new THREE.Vector3(-20, -15, 6),
            camPos: new THREE.Vector3(-20, -12, 34),
          },
          "phwr-fuelling-machine": {
            pos: new THREE.Vector3(-50, -3, 0),
            camPos: new THREE.Vector3(-50, -1, 35),
          },
          "phwr-turbine": {
            pos: new THREE.Vector3(32, -4, 0),
            camPos: new THREE.Vector3(32, -2, 45),
          },
          "phwr-condenser": {
            pos: new THREE.Vector3(32, -18, 0),
            camPos: new THREE.Vector3(32, -15, 40),
          },
          "phwr-containment": {
            pos: new THREE.Vector3(-20, 6, 0),
            camPos: new THREE.Vector3(-20, 10, 85),
          },
        };
      }

      // Default: PWR
      return {
        "pwr-rpv": {
          pos: new THREE.Vector3(-38, 0, 0),
          camPos: new THREE.Vector3(-38, 6, 45),
        },
        "pwr-fuel-assemblies": {
          pos: new THREE.Vector3(-38, -6, 0),
          camPos: new THREE.Vector3(-38, -3, 30),
        },
        "pwr-control-rods": {
          pos: new THREE.Vector3(-38, 12, 0),
          camPos: new THREE.Vector3(-38, 14, 30),
        },
        "pwr-pressurizer": {
          pos: new THREE.Vector3(-22, 8, 0),
          camPos: new THREE.Vector3(-22, 10, 36),
        },
        "pwr-steam-gen": {
          pos: new THREE.Vector3(-6, 5, 0),
          camPos: new THREE.Vector3(-6, 8, 45),
        },
        "pwr-coolant-pump": {
          pos: new THREE.Vector3(-22, -15, 6),
          camPos: new THREE.Vector3(-22, -12, 34),
        },
        "pwr-turbine": {
          pos: new THREE.Vector3(32, -4, 0),
          camPos: new THREE.Vector3(32, -2, 45),
        },
        "pwr-condenser": {
          pos: new THREE.Vector3(32, -18, 0),
          camPos: new THREE.Vector3(32, -15, 40),
        },
        "pwr-containment": {
          pos: new THREE.Vector3(-22, 8, 0),
          camPos: new THREE.Vector3(-22, 12, 90),
        },
        "pwr-cooling-tower": {
          pos: new THREE.Vector3(80, 10, 0),
          camPos: new THREE.Vector3(80, 14, 65),
        },
      };
    },
    [],
  );

  // Zoom camera to selected component whenever selectedId changes
  useEffect(() => {
    const targets = getComponentTargets(system.id);
    if (selectedId && targets[selectedId]) {
      const target = targets[selectedId];
      targetLookAtRef.current.copy(target.pos);
      targetCamPosRef.current.copy(target.camPos);
      isTransitioningRef.current = true;
    }
  }, [selectedId, system.id, getComponentTargets]);

  // Reset Camera View to Full Plant Overview
  const handleResetCamera = () => {
    targetLookAtRef.current.set(12, -2, 0);
    targetCamPosRef.current.set(20, 30, 140);
    isTransitioningRef.current = true;
  };

  // Zoom In / Out Buttons
  const handleZoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      const dir = cameraRef.current.position
        .clone()
        .sub(controlsRef.current.target)
        .multiplyScalar(0.75);
      cameraRef.current.position.copy(controlsRef.current.target).add(dir);
      controlsRef.current.update();
    }
  };
  const handleZoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      const dir = cameraRef.current.position
        .clone()
        .sub(controlsRef.current.target)
        .multiplyScalar(1.3);
      cameraRef.current.position.copy(controlsRef.current.target).add(dir);
      controlsRef.current.update();
    }
  };

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050a14);
    scene.fog = new THREE.FogExp2(0x050a14, 0.0035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      // In non-WebGL environments (e.g. jsdom / test runners / disabled WebGL), gracefully degrade
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // Subtle bloom to match reference image (not blinding neon)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.6,
      0.4,
      0.85,
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 5;
    controls.target.set(12, -2, 0);
    camera.position.set(20, 30, 140);
    controlsRef.current = controls;

    controls.addEventListener("start", () => {
      isTransitioningRef.current = false;
    });

    // 4. Lights (Studio lighting for the museum display look)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 2.0);
    mainSun.position.set(60, 100, 80);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueFill.position.set(-60, 40, -50);
    scene.add(blueFill);

    // 5. Build 3D Plant Model
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);
    plantGroupRef.current = plantGroup;
    interactiveMeshesRef.current = [];
    turbineRotorsRef.current = [];
    vaporParticlesRef.current = [];
    flowParticlesRef.current = [];

    // --- Ground Foundation Grid ---
    const groundGeo = new THREE.BoxGeometry(220, 3, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090f1d,
      roughness: 0.8,
      metalness: 0.3,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(12, -26, 0);
    ground.receiveShadow = true;
    plantGroup.add(ground);

    const gridHelper = new THREE.GridHelper(210, 42, 0x0284c7, 0x1e293b);
    gridHelper.position.set(12, -24.4, 0);
    plantGroup.add(gridHelper);

    // Tag helper to add interactive component
    const registerInteractive = (mesh: THREE.Object3D, compId: string) => {
      mesh.userData = { componentId: compId };
      interactiveMeshesRef.current.push(mesh);
    };

    const applyGlowingEdges = (group: THREE.Group | THREE.Mesh) => {
      // Intentionally empty. We are using Additive Blending which creates natural glowing rim effects without messy wireframes.
    };

    const addFlowParticles = (
      curve: THREE.CatmullRomCurve3,
      count: number,
      color: number,
      loop: string,
    ) => {
      const denseCount = count * 4; // Ultra-dense stream
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      for (let i = 0; i < denseCount; i++) {
        // Smaller glowing particles mimicking a fluid stream
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), mat);
        plantGroup.add(mesh);
        flowParticlesRef.current.push({
          mesh,
          curve,
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.002,
          loop,
        });
      }
    };

    // Shared Materials (Holographic Additive Blending)
    // Additive blending ignores depth sorting issues and naturally creates a glowing x-ray look.
    const steelMat = new THREE.MeshPhongMaterial({
      color: 0x00d8ff,
      emissive: 0x0088aa,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Secondary structures (Turbines) should be solid and clearly visible
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Solid visible grey
      roughness: 0.4,
      metalness: 0.6,
      side: THREE.FrontSide,
    });

    // Outer containment dome (Ghostly shell)
    const concreteMat = new THREE.MeshPhongMaterial({
      color: 0x1e3a8a,
      emissive: 0x0f172a,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const cherenkovMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
    });

    // -------------------------------------------------------------
    // Architecture Setup Based on System ID
    // -------------------------------------------------------------
    if (system.id === "bwr") {
      // ===== BWR ARCHITECTURE =====
      // 1. Drywell Containment (Lightbulb shell)
      const contGroup = new THREE.Group();
      contGroup.position.set(-22, 6, 0);
      const contCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(24, 26, 36, 32, 1, true, 0, Math.PI * 1.4),
        concreteMat,
      );
      const contDome = new THREE.Mesh(
        new THREE.SphereGeometry(24, 32, 16, 0, Math.PI * 1.4, 0, Math.PI / 2),
        concreteMat,
      );
      contDome.position.y = 18;
      contGroup.add(contCyl, contDome);
      applyGlowingEdges(contGroup);
      registerInteractive(contGroup, "bwr-containment");
      plantGroup.add(contGroup);

      // 2. Torus / Suppression Pool (Donut at base)
      const torusGeo = new THREE.TorusGeometry(20, 4, 16, 40);
      const torus = new THREE.Mesh(torusGeo, steelMat);
      torus.rotation.x = Math.PI / 2;
      torus.position.set(-22, -20, 0);
      applyGlowingEdges(torus);
      registerInteractive(torus, "bwr-suppression-pool");
      plantGroup.add(torus);

      // 3. BWR RPV (Vessel)
      const rpvGroup = new THREE.Group();
      rpvGroup.position.set(-28, 0, 0);
      const rpvBody = new THREE.Mesh(
        new THREE.CylinderGeometry(8, 8, 30, 32),
        steelMat,
      );
      const rpvTop = new THREE.Mesh(
        new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        steelMat,
      );
      rpvTop.position.y = 15;
      const rpvBottom = new THREE.Mesh(
        new THREE.SphereGeometry(
          8,
          32,
          16,
          0,
          Math.PI * 2,
          Math.PI / 2,
          Math.PI / 2,
        ),
        steelMat,
      );
      rpvBottom.position.y = -15;
      rpvGroup.add(rpvBody, rpvTop, rpvBottom);
      applyGlowingEdges(rpvGroup);
      registerInteractive(rpvGroup, "bwr-rpv");
      plantGroup.add(rpvGroup);

      // 4. Fuel Core (Dense 8x8 Rod Array)
      const fuelGroup = new THREE.Group();
      fuelGroup.position.set(-28, -5, 0);
      for (let i = -4; i < 4; i++) {
        for (let j = -4; j < 4; j++) {
          if (Math.abs(i) === 4 && Math.abs(j) === 4) continue; // Round the corners slightly
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.15, 12, 8),
            cherenkovMat,
          );
          rod.position.set(i * 0.8 + 0.4, 0, j * 0.8 + 0.4);
          fuelGroup.add(rod);
        }
      }
      const coreLight = new THREE.PointLight(0x00f0ff, 2.5, 35);
      coreLight.position.set(0, 0, 0);
      fuelGroup.add(coreLight);
      coreLightRef.current = coreLight;
      registerInteractive(fuelGroup, "bwr-fuel");
      plantGroup.add(fuelGroup);

      // 5. Bottom-entry Control Rods (BWR moves from bottom)
      const rodsGroup = new THREE.Group();
      rodsGroup.position.set(-28, -16, 0);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const rodBlade = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 14, 12),
            darkMetalMat,
          );
          rodBlade.position.set(i * 3, 0, j * 3);
          rodsGroup.add(rodBlade);
        }
      }
      controlRodsRef.current = rodsGroup;
      applyGlowingEdges(rodsGroup);
      registerInteractive(rodsGroup, "bwr-control-rods");
      plantGroup.add(rodsGroup);

      // 6. Steam Separators & Dryers (Top of RPV)
      const sepGroup = new THREE.Group();
      sepGroup.position.set(-28, 9, 0);
      const sepMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(6.8, 7.2, 7, 24),
        darkMetalMat,
      );
      sepGroup.add(sepMesh);
      applyGlowingEdges(sepGroup);
      registerInteractive(sepGroup, "bwr-steam-sep");
      plantGroup.add(sepGroup);

      // 7. Recirculation Pump
      const pumpGroup = new THREE.Group();
      pumpGroup.position.set(-14, -15, 6);
      const pumpBody = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 4, 8, 16),
        steelMat,
      );
      pumpGroup.add(pumpBody);
      applyGlowingEdges(pumpGroup);
      registerInteractive(pumpGroup, "bwr-recirc-pump");
      plantGroup.add(pumpGroup);

      // Pipes
      const mainSteamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-28, 14, 0),
        new THREE.Vector3(-28, 22, 0),
        new THREE.Vector3(10, 22, 0),
        new THREE.Vector3(26, 4, 0),
      ]);
      const steamPipe = new THREE.Mesh(
        new THREE.TubeGeometry(mainSteamCurve, 32, 1.4, 12, false),
        steelMat,
      );
      applyGlowingEdges(steamPipe);
      plantGroup.add(steamPipe);
      addFlowParticles(mainSteamCurve, 12, 0xffffff, "secondary");
    } else if (system.id === "phwr") {
      // ===== PHWR / CANDU ARCHITECTURE =====
      // 1. Containment Dome
      const contGroup = new THREE.Group();
      contGroup.position.set(-20, 6, 0);
      const contCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(26, 28, 38, 32, 1, true, 0, Math.PI * 1.4),
        concreteMat,
      );
      const contDome = new THREE.Mesh(
        new THREE.SphereGeometry(26, 32, 16, 0, Math.PI * 1.4, 0, Math.PI / 2),
        concreteMat,
      );
      contDome.position.y = 19;
      contGroup.add(contCyl, contDome);
      applyGlowingEdges(contGroup);
      registerInteractive(contGroup, "phwr-containment");
      plantGroup.add(contGroup);

      // 2. Calandria (Horizontal Heavy Water Vessel)
      const calGroup = new THREE.Group();
      calGroup.position.set(-30, -3, 0);
      const calBody = new THREE.Mesh(
        new THREE.CylinderGeometry(11, 11, 24, 32),
        steelMat,
      );
      calBody.rotation.z = Math.PI / 2;
      calGroup.add(calBody);
      applyGlowingEdges(calGroup);
      registerInteractive(calGroup, "phwr-calandria");
      plantGroup.add(calGroup);

      // 3. Fuel Channels (Dense Horizontal Matrix)
      const chanGroup = new THREE.Group();
      chanGroup.position.set(-30, -3, 0);
      for (let y = -4; y < 4; y++) {
        for (let z = -4; z < 4; z++) {
          if (Math.sqrt(y * y + z * z) > 4) continue; // Circular bundle shape
          const tube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 24, 8),
            cherenkovMat,
          );
          tube.rotation.z = Math.PI / 2;
          tube.position.set(0, y * 1.5 + 0.75, z * 1.5 + 0.75);
          chanGroup.add(tube);
        }
      }
      const coreLight = new THREE.PointLight(0x00f0ff, 2.5, 35);
      chanGroup.add(coreLight);
      coreLightRef.current = coreLight;
      registerInteractive(chanGroup, "phwr-fuel-channels");
      plantGroup.add(chanGroup);

      // 4. Control Mechanisms (Vertical insertion into calandria)
      const rodsGroup = new THREE.Group();
      rodsGroup.position.set(-30, 9, 0);
      for (let x = -2; x <= 2; x += 2) {
        const blade = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.4, 12, 12),
          darkMetalMat,
        );
        blade.position.set(x * 3, 0, 0);
        rodsGroup.add(blade);
      }
      controlRodsRef.current = rodsGroup;
      applyGlowingEdges(rodsGroup);
      registerInteractive(rodsGroup, "phwr-control-mechanisms");
      plantGroup.add(rodsGroup);

      // 5. Fuelling Machine
      const fuelMach = new THREE.Mesh(
        new THREE.BoxGeometry(10, 14, 10),
        darkMetalMat,
      );
      fuelMach.position.set(-50, -3, 0);
      applyGlowingEdges(fuelMach);
      registerInteractive(fuelMach, "phwr-fuelling-machine");
      plantGroup.add(fuelMach);

      // 6. Vertical Steam Generator
      const sgGroup = new THREE.Group();
      sgGroup.position.set(-8, 7, 0);
      const sgLow = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 24, 24),
        steelMat,
      );
      const sgHigh = new THREE.Mesh(
        new THREE.CylinderGeometry(7, 7, 12, 24),
        steelMat,
      );
      sgHigh.position.y = 14;
      sgGroup.add(sgLow, sgHigh);

      // Internal U-Tube Bundle (Heat Exchanger)
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          if (Math.sqrt(x * x + z * z) > 3) continue;
          const tubeHeight = 18 - Math.sqrt(x * x + z * z) * 0.5;
          const uTube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, tubeHeight, 6),
            cherenkovMat,
          );
          uTube.position.set(x * 0.8, -12 + tubeHeight / 2, z * 0.8);
          sgGroup.add(uTube);
        }
      }
      applyGlowingEdges(sgGroup);
      registerInteractive(sgGroup, "phwr-steam-gen");
      plantGroup.add(sgGroup);

      // 7. Primary Pump
      const pumpGroup = new THREE.Group();
      pumpGroup.position.set(-20, -15, 6);
      const pumpBody = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 4, 8, 16),
        steelMat,
      );
      pumpGroup.add(pumpBody);
      applyGlowingEdges(pumpGroup);
      registerInteractive(pumpGroup, "phwr-primary-pump");
      plantGroup.add(pumpGroup);

      // PHWR Pipes (Primary Loop)
      const phwrHotLegCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-30, 8, 0),
        new THREE.Vector3(-14, 8, -4),
        new THREE.Vector3(-8, 0, 0),
      ]);
      const phwrHotPipe = new THREE.Mesh(
        new THREE.TubeGeometry(phwrHotLegCurve, 20, 1.4, 12, false),
        steelMat,
      );
      applyGlowingEdges(phwrHotPipe);
      plantGroup.add(phwrHotPipe);
      addFlowParticles(phwrHotLegCurve, 6, 0xfef08a, "primary");

      const phwrColdLegCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, -5, 0),
        new THREE.Vector3(-20, -15, 6),
        new THREE.Vector3(-30, -10, 0),
      ]);
      const phwrColdPipe = new THREE.Mesh(
        new THREE.TubeGeometry(phwrColdLegCurve, 20, 1.4, 12, false),
        steelMat,
      );
      applyGlowingEdges(phwrColdPipe);
      plantGroup.add(phwrColdPipe);
      addFlowParticles(phwrColdLegCurve, 6, 0x67e8f9, "primary");

      // PHWR Steam
      const phwrSteamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 20, 0),
        new THREE.Vector3(10, 24, 0),
        new THREE.Vector3(26, 4, 0),
      ]);
      const phwrSteamPipe = new THREE.Mesh(
        new THREE.TubeGeometry(phwrSteamCurve, 28, 1.4, 12, false),
        steelMat,
      );
      applyGlowingEdges(phwrSteamPipe);
      plantGroup.add(phwrSteamPipe);
      addFlowParticles(phwrSteamCurve, 10, 0xffffff, "secondary");
    } else if (system.id === "pwr") {
      // ===== PWR ARCHITECTURE (Standard) =====
      // 1. Cutaway Containment Structure
      const contGroup = new THREE.Group();
      contGroup.position.set(-22, 8, 0);
      const contCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(28, 30, 42, 36, 1, true, 0, Math.PI * 1.45),
        concreteMat,
      );
      const contDome = new THREE.Mesh(
        new THREE.SphereGeometry(28, 36, 18, 0, Math.PI * 1.45, 0, Math.PI / 2),
        concreteMat,
      );
      contDome.position.y = 21;
      contGroup.add(contCyl, contDome);
      applyGlowingEdges(contGroup);
      registerInteractive(contGroup, "pwr-containment");
      plantGroup.add(contGroup);

      // 2. Reactor Pressure Vessel (RPV)
      const rpvGroup = new THREE.Group();
      rpvGroup.position.set(-38, 0, 0);
      const rpvCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(7.5, 7.5, 26, 32),
        steelMat,
      );
      const rpvTop = new THREE.Mesh(
        new THREE.SphereGeometry(7.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        steelMat,
      );
      rpvTop.position.y = 13;
      const rpvBottom = new THREE.Mesh(
        new THREE.SphereGeometry(
          7.5,
          32,
          16,
          0,
          Math.PI * 2,
          Math.PI / 2,
          Math.PI / 2,
        ),
        steelMat,
      );
      rpvBottom.position.y = -13;
      rpvGroup.add(rpvCyl, rpvTop, rpvBottom);
      applyGlowingEdges(rpvGroup);
      registerInteractive(rpvGroup, "pwr-rpv");
      plantGroup.add(rpvGroup);

      // 3. Nuclear Fuel Assemblies Core (Dense 8x8 Rod Array)
      const fuelGroup = new THREE.Group();
      fuelGroup.position.set(-38, -6, 0);
      for (let x = -4; x < 4; x++) {
        for (let z = -4; z < 4; z++) {
          if (Math.abs(x) === 4 && Math.abs(z) === 4) continue;
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.15, 11, 8),
            cherenkovMat,
          );
          rod.position.set(x * 0.75 + 0.375, 0, z * 0.75 + 0.375);
          fuelGroup.add(rod);
        }
      }
      const coreLight = new THREE.PointLight(0x00f0ff, 2.5, 35);
      fuelGroup.add(coreLight);
      coreLightRef.current = coreLight;
      registerInteractive(fuelGroup, "pwr-fuel-assemblies");
      plantGroup.add(fuelGroup);

      // 4. Control Rod Clusters
      const rodsGroup = new THREE.Group();
      rodsGroup.position.set(-38, 12, 0);
      const spiderHub = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, 1.5, 16),
        darkMetalMat,
      );
      rodsGroup.add(spiderHub);
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.35, 12, 12),
          darkMetalMat,
        );
        rod.position.set(Math.cos(ang) * 3, -6, Math.sin(ang) * 3);
        rodsGroup.add(rod);
      }
      controlRodsRef.current = rodsGroup;
      applyGlowingEdges(rodsGroup);
      registerInteractive(rodsGroup, "pwr-control-rods");
      plantGroup.add(rodsGroup);

      // 5. Pressurizer
      const pzGroup = new THREE.Group();
      pzGroup.position.set(-22, 8, 0);
      const pzBody = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, 18, 24),
        steelMat,
      );
      const pzTop = new THREE.Mesh(
        new THREE.SphereGeometry(4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        steelMat,
      );
      pzTop.position.y = 9;
      const pzBot = new THREE.Mesh(
        new THREE.SphereGeometry(
          4,
          24,
          12,
          0,
          Math.PI * 2,
          Math.PI / 2,
          Math.PI / 2,
        ),
        steelMat,
      );
      pzBot.position.y = -9;
      pzGroup.add(pzBody, pzTop, pzBot);
      applyGlowingEdges(pzGroup);
      registerInteractive(pzGroup, "pwr-pressurizer");
      plantGroup.add(pzGroup);

      // 6. Steam Generator
      const sgGroup = new THREE.Group();
      sgGroup.position.set(-6, 5, 0);
      const sgLow = new THREE.Mesh(
        new THREE.CylinderGeometry(5.5, 5.5, 16, 28),
        steelMat,
      );
      const sgHigh = new THREE.Mesh(
        new THREE.CylinderGeometry(7.5, 7.5, 12, 28),
        steelMat,
      );
      sgHigh.position.y = 13;
      const sgDome = new THREE.Mesh(
        new THREE.SphereGeometry(7.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2),
        steelMat,
      );
      sgDome.position.y = 19;
      sgGroup.add(sgLow, sgHigh, sgDome);

      // Internal U-Tube Bundle (Heat Exchanger)
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          if (Math.sqrt(x * x + z * z) > 3) continue;
          const tubeHeight = 14 - Math.sqrt(x * x + z * z) * 0.5;
          const uTube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.15, tubeHeight, 8),
            cherenkovMat,
          );
          uTube.position.set(x * 0.9, -8 + tubeHeight / 2, z * 0.9);
          sgGroup.add(uTube);
        }
      }
      applyGlowingEdges(sgGroup);
      registerInteractive(sgGroup, "pwr-steam-gen");
      plantGroup.add(sgGroup);

      // 7. Reactor Coolant Pump (RCP)
      const pumpGroup = new THREE.Group();
      pumpGroup.position.set(-22, -15, 6);
      const pumpBody = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 4, 8, 16),
        steelMat,
      );
      const motorTop = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 6, 16),
        darkMetalMat,
      );
      motorTop.position.y = 6;
      pumpGroup.add(pumpBody, motorTop);
      applyGlowingEdges(pumpGroup);
      registerInteractive(pumpGroup, "pwr-coolant-pump");
      plantGroup.add(pumpGroup);

      // Primary Hot Leg Pipe (RPV -> SG)
      const hotLegCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-31, 3, 0),
        new THREE.Vector3(-24, 3, -4),
        new THREE.Vector3(-12, -2, 0),
      ]);
      const hotPipe = new THREE.Mesh(
        new THREE.TubeGeometry(hotLegCurve, 24, 1.6, 16, false),
        steelMat,
      );
      applyGlowingEdges(hotPipe);
      plantGroup.add(hotPipe);
      addFlowParticles(hotLegCurve, 8, 0xfef08a, "primary");

      // Primary Cold Leg Pipe (SG -> Pump -> RPV)
      const coldLegCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, -6, 0),
        new THREE.Vector3(-14, -15, 6),
        new THREE.Vector3(-22, -15, 6),
        new THREE.Vector3(-31, -5, 0),
      ]);
      const coldPipe = new THREE.Mesh(
        new THREE.TubeGeometry(coldLegCurve, 32, 1.5, 16, false),
        steelMat,
      );
      applyGlowingEdges(coldPipe);
      plantGroup.add(coldPipe);
      addFlowParticles(coldLegCurve, 8, 0x67e8f9, "primary");

      // Main Steam Line (SG -> Turbine)
      const steamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, 24, 0),
        new THREE.Vector3(10, 24, 0),
        new THREE.Vector3(22, 2, 0),
      ]);
      const steamPipe = new THREE.Mesh(
        new THREE.TubeGeometry(steamCurve, 28, 1.4, 14, false),
        steelMat,
      );
      applyGlowingEdges(steamPipe);
      plantGroup.add(steamPipe);
      addFlowParticles(steamCurve, 10, 0xffffff, "secondary");
    } else if (system.id === "rbmk") {
      // ===== RBMK ARCHITECTURE =====

      // 1. Industrial Building Shell (No containment dome)
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(-22, 0, 0);
      const buildingBox = new THREE.Mesh(
        new THREE.BoxGeometry(40, 50, 40),
        concreteMat,
      );
      buildingGroup.add(buildingBox);
      applyGlowingEdges(buildingGroup);
      plantGroup.add(buildingGroup);

      // 2. Graphite Core Matrix
      const coreGroup = new THREE.Group();
      coreGroup.position.set(-22, -5, 0);

      // Large cylindrical matrix built from block-like segments
      const coreCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(14, 14, 18, 32),
        new THREE.MeshPhongMaterial({
          color: 0x333333,
          emissive: 0x111111,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      coreGroup.add(coreCyl);

      // Vertical Pressure Tubes (Fuel Channels)
      for (let i = -10; i <= 10; i += 2) {
        for (let j = -10; j <= 10; j += 2) {
          if (Math.sqrt(i * i + j * j) > 12) continue;
          const tube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 20, 8),
            cherenkovMat,
          );
          tube.position.set(i, 0, j);
          coreGroup.add(tube);
        }
      }

      const coreLight = new THREE.PointLight(0x00f0ff, 2.5, 40);
      coreGroup.add(coreLight);
      coreLightRef.current = coreLight;
      registerInteractive(coreGroup, "rbmk-graphite-core");
      plantGroup.add(coreGroup);

      // 3. Steam Separator Drums (Overhead)
      const drumGroup = new THREE.Group();
      drumGroup.position.set(-22, 16, 0);

      const drum1 = new THREE.Mesh(
        new THREE.CylinderGeometry(3, 3, 20, 32),
        steelMat,
      );
      drum1.rotation.x = Math.PI / 2;
      drum1.position.z = -6;

      const drum2 = new THREE.Mesh(
        new THREE.CylinderGeometry(3, 3, 20, 32),
        steelMat,
      );
      drum2.rotation.x = Math.PI / 2;
      drum2.position.z = 6;

      drumGroup.add(drum1, drum2);
      applyGlowingEdges(drumGroup);
      registerInteractive(drumGroup, "rbmk-steam-drums");
      plantGroup.add(drumGroup);

      // 4. Control Rods (Top-down)
      const rodsGroup = new THREE.Group();
      rodsGroup.position.set(-22, 10, 0);
      for (let i = -6; i <= 6; i += 4) {
        for (let j = -6; j <= 6; j += 4) {
          if (Math.sqrt(i * i + j * j) > 8) continue;
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 12, 12),
            darkMetalMat,
          );
          rod.position.set(i, 0, j);
          rodsGroup.add(rod);
        }
      }
      controlRodsRef.current = rodsGroup;
      applyGlowingEdges(rodsGroup);
      registerInteractive(rodsGroup, "rbmk-control-rods");
      plantGroup.add(rodsGroup);

      // Flow: Core -> Drums -> Turbine (Direct cycle)
      const riserCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-22, 4, 0),
        new THREE.Vector3(-22, 10, -6),
        new THREE.Vector3(-22, 16, -6),
      ]);
      const riserPipe = new THREE.Mesh(
        new THREE.TubeGeometry(riserCurve, 20, 1.0, 8, false),
        steelMat,
      );
      plantGroup.add(riserPipe);
      addFlowParticles(riserCurve, 5, 0x00d8ff, "primary");

      const steamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-22, 16, -6),
        new THREE.Vector3(0, 16, -6),
        new THREE.Vector3(12, 6, 0),
        new THREE.Vector3(25, -2, 0),
      ]);
      const steamPipe = new THREE.Mesh(
        new THREE.TubeGeometry(steamCurve, 20, 1.2, 8, false),
        steelMat,
      );
      plantGroup.add(steamPipe);
      addFlowParticles(steamCurve, 10, 0xffffff, "primary");
    } else if (system.id === "fbr") {
      // ===== FBR ARCHITECTURE =====

      // 1. Primary Sodium Pool Vessel
      const poolGroup = new THREE.Group();
      poolGroup.position.set(-25, -5, 0);

      const poolVessel = new THREE.Mesh(
        new THREE.CylinderGeometry(18, 18, 25, 32),
        steelMat,
      );
      // Simulate liquid sodium fill
      const sodiumFill = new THREE.Mesh(
        new THREE.CylinderGeometry(17.5, 17.5, 23, 32),
        new THREE.MeshPhongMaterial({
          color: 0xff8800, // Sodium orange/yellow
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      poolGroup.add(poolVessel, sodiumFill);
      applyGlowingEdges(poolGroup);
      registerInteractive(poolGroup, "fbr-pool");
      plantGroup.add(poolGroup);

      // 2. Fast Core (Submerged, dense, unmoderated)
      const coreGroup = new THREE.Group();
      coreGroup.position.set(-25, -10, 0);
      const coreBox = new THREE.Mesh(
        new THREE.BoxGeometry(6, 8, 6),
        cherenkovMat,
      );
      coreGroup.add(coreBox);
      const coreLight = new THREE.PointLight(0xffa500, 3.0, 30);
      coreGroup.add(coreLight);
      coreLightRef.current = coreLight;
      // Not interactive directly as it's inside the pool
      plantGroup.add(coreGroup);

      // 3. Intermediate Heat Exchanger (IHX)
      const ihxGroup = new THREE.Group();
      ihxGroup.position.set(-15, -2, 8);
      const ihxBody = new THREE.Mesh(
        new THREE.CylinderGeometry(3, 3, 14, 32),
        steelMat,
      );
      ihxGroup.add(ihxBody);
      applyGlowingEdges(ihxGroup);
      registerInteractive(ihxGroup, "fbr-ihx");
      plantGroup.add(ihxGroup);

      // 4. Steam Generator (Outside Pool)
      const sgGroup = new THREE.Group();
      sgGroup.position.set(0, -2, 0);
      const sgBody = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, 20, 32),
        steelMat,
      );
      sgGroup.add(sgBody);
      applyGlowingEdges(sgGroup);
      registerInteractive(sgGroup, "fbr-sg");
      plantGroup.add(sgGroup);

      // Flow: Pool -> IHX (Internal circulation)
      const primaryCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-25, -10, 0),
        new THREE.Vector3(-20, -10, 4),
        new THREE.Vector3(-15, -6, 8),
      ]);
      addFlowParticles(primaryCurve, 5, 0xff5500, "primary");

      // Flow: IHX -> SG (Intermediate Loop)
      const intCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15, 2, 8),
        new THREE.Vector3(-8, 4, 4),
        new THREE.Vector3(0, 2, 0),
      ]);
      const intPipe = new THREE.Mesh(
        new THREE.TubeGeometry(intCurve, 20, 0.8, 8, false),
        steelMat,
      );
      plantGroup.add(intPipe);
      addFlowParticles(intCurve, 8, 0xffaa00, "intermediate");

      // Flow: SG -> Turbine (Secondary Loop)
      const steamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 8, 0),
        new THREE.Vector3(12, 6, 0),
        new THREE.Vector3(25, -2, 0),
      ]);
      const steamPipe = new THREE.Mesh(
        new THREE.TubeGeometry(steamCurve, 20, 1.2, 8, false),
        steelMat,
      );
      plantGroup.add(steamPipe);
      addFlowParticles(steamCurve, 10, 0xffffff, "secondary");
    } else if (system.id === "msr") {
      // ===== MSR ARCHITECTURE =====

      // 1. Graphite Core (Critical Region)
      const coreGroup = new THREE.Group();
      coreGroup.position.set(-25, -5, 0);

      const coreShape = new THREE.Mesh(
        new THREE.SphereGeometry(12, 32, 32),
        new THREE.MeshPhongMaterial({
          color: 0x222222,
          emissive: 0x111111,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        }),
      );
      // Glow represents the fuel salt achieving criticality inside
      const coreLight = new THREE.PointLight(0x00ff88, 3.0, 40);
      coreGroup.add(coreShape, coreLight);
      coreLightRef.current = coreLight;
      registerInteractive(coreGroup, "msr-core");
      plantGroup.add(coreGroup);

      // 2. Primary Heat Exchanger
      const hxGroup = new THREE.Group();
      hxGroup.position.set(-5, -5, 0);
      const hxBody = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 8), steelMat);
      hxGroup.add(hxBody);
      applyGlowingEdges(hxGroup);
      registerInteractive(hxGroup, "msr-hx");
      plantGroup.add(hxGroup);

      // 3. Chemical Processing Plant
      const chemGroup = new THREE.Group();
      chemGroup.position.set(-25, -22, 0);
      const chemBody = new THREE.Mesh(
        new THREE.BoxGeometry(14, 8, 10),
        steelMat,
      );
      chemGroup.add(chemBody);
      applyGlowingEdges(chemGroup);
      registerInteractive(chemGroup, "msr-chem");
      plantGroup.add(chemGroup);

      // Flow: Core -> Heat Exchanger (Fuel Salt Loop)
      const hotSaltCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(-7, -2, 0),
      ]);
      const hotSaltPipe = new THREE.Mesh(
        new THREE.TubeGeometry(hotSaltCurve, 20, 1.0, 8, false),
        steelMat,
      );
      plantGroup.add(hotSaltPipe);
      addFlowParticles(hotSaltCurve, 6, 0x00ff88, "primary"); // Greenish hot salt

      // Flow: Heat Exchanger -> Core (Cold Salt Loop)
      const coldSaltCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-7, -8, 0),
        new THREE.Vector3(-10, -10, 0),
        new THREE.Vector3(-15, -10, 0),
      ]);
      const coldSaltPipe = new THREE.Mesh(
        new THREE.TubeGeometry(coldSaltCurve, 20, 1.0, 8, false),
        steelMat,
      );
      plantGroup.add(coldSaltPipe);
      addFlowParticles(coldSaltCurve, 6, 0x008855, "primary");

      // Flow: Core -> Chem Plant (Slip stream)
      const chemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-25, -15, 0),
        new THREE.Vector3(-25, -18, 0),
      ]);
      const chemPipe = new THREE.Mesh(
        new THREE.TubeGeometry(chemCurve, 10, 0.5, 8, false),
        steelMat,
      );
      plantGroup.add(chemPipe);
      addFlowParticles(chemCurve, 3, 0x00ff88, "primary");

      // Flow: Heat Exchanger -> Turbine (Secondary Loop)
      const steamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(12, 6, 0),
        new THREE.Vector3(25, -2, 0),
      ]);
      const steamPipe = new THREE.Mesh(
        new THREE.TubeGeometry(steamCurve, 20, 1.2, 8, false),
        steelMat,
      );
      plantGroup.add(steamPipe);
      addFlowParticles(steamCurve, 10, 0xffffff, "secondary");
    }

    // -------------------------------------------------------------
    // Common Conventional Island: Turbine, Condenser & Cooling Tower
    // -------------------------------------------------------------
    // Turbine Hall Frame
    const hallGeo = new THREE.BoxGeometry(45, 30, 36);
    const hallMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const hall = new THREE.Mesh(hallGeo, hallMat);
    hall.position.set(40, 2, 0);
    plantGroup.add(hall);

    // Steam Turbine & Generator Group
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(32, -4, 0);

    // High Pressure Turbine Casing (Open Top)
    const hpCasing = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 6.5, 10, 32, 1, false, 0, Math.PI),
      darkMetalMat,
    );
    hpCasing.rotation.z = Math.PI / 2;
    hpCasing.position.x = -8;

    // Low Pressure Turbine Casing (Open Top)
    const lpCasing = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 16, 32, 1, false, 0, Math.PI),
      darkMetalMat,
    );
    lpCasing.rotation.z = Math.PI / 2;
    lpCasing.position.x = 6;

    // Electric Generator
    const genCasing = new THREE.Mesh(
      new THREE.BoxGeometry(10, 8, 8),
      darkMetalMat,
    );
    genCasing.position.x = 22;

    // Rotating Shaft
    const rotorGeo = new THREE.CylinderGeometry(1.2, 1.2, 40, 16);
    const rotorMesh = new THREE.Mesh(
      rotorGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        clearcoat: 0.8,
      }),
    );
    rotorMesh.rotation.z = Math.PI / 2;
    rotorMesh.position.x = 7;

    // Add HP Blades to Rotor
    const bladeMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      metalness: 1.0,
      roughness: 0.2,
    });
    for (let ring = -3; ring <= 3; ring++) {
      for (let blade = 0; blade < 16; blade++) {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 3.5, 0.8),
          bladeMat,
        );
        const angle = (blade / 16) * Math.PI * 2;
        // In the rotor's local space, the shaft points along Y due to the CylinderGeometry defaults before rotation
        b.position.set(
          Math.cos(angle) * 2.5,
          ring * -1.2 - 15,
          Math.sin(angle) * 2.5,
        );
        b.rotation.y = -angle; // Face outward
        b.rotation.x = Math.PI / 8; // Pitch the blade
        rotorMesh.add(b);
      }
    }

    // Add LP Blades to Rotor
    for (let ring = -5; ring <= 5; ring++) {
      for (let blade = 0; blade < 24; blade++) {
        const bladeHeight = 5.5 - Math.abs(ring) * 0.3; // Tapering
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, bladeHeight, 1.2),
          bladeMat,
        );
        const angle = (blade / 24) * Math.PI * 2;
        b.position.set(
          Math.cos(angle) * (1.2 + bladeHeight / 2),
          ring * -1.2 - 1,
          Math.sin(angle) * (1.2 + bladeHeight / 2),
        );
        b.rotation.y = -angle;
        b.rotation.x = Math.PI / 6;
        rotorMesh.add(b);
      }
    }

    turbineRotorsRef.current.push(rotorMesh);
    turbineGroup.add(hpCasing, lpCasing, genCasing, rotorMesh);

    const turbCompId =
      system.id === "bwr"
        ? "bwr-turbine"
        : system.id === "phwr"
          ? "phwr-turbine"
          : "pwr-turbine";
    registerInteractive(turbineGroup, turbCompId);
    plantGroup.add(turbineGroup);

    // Surface Condenser
    const condGroup = new THREE.Group();
    condGroup.position.set(32, -18, 0);
    const condBox = new THREE.Mesh(
      new THREE.BoxGeometry(22, 10, 16),
      darkMetalMat,
    );
    condGroup.add(condBox);
    const condCompId =
      system.id === "bwr"
        ? "bwr-condenser"
        : system.id === "phwr"
          ? "phwr-condenser"
          : "pwr-condenser";
    registerInteractive(condGroup, condCompId);
    plantGroup.add(condGroup);

    // Cooling Tower (Natural Draft Hyperboloid)
    const towerPoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const v = i / 24;
      const y = v * 48;
      // Hyperboloid neck formula
      const radius =
        18 -
        8 * Math.sin(v * Math.PI * 0.9) +
        4 * (v > 0.8 ? (v - 0.8) * 4 : 0);
      towerPoints.push(new THREE.Vector2(radius, y));
    }
    const towerGeo = new THREE.LatheGeometry(towerPoints, 36);
    const towerMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const coolingTower = new THREE.Mesh(towerGeo, towerMat);
    coolingTower.position.set(80, -24, 0);
    const towerCompId =
      system.id === "bwr" ? "bwr-cooling-water" : "pwr-cooling-tower";
    registerInteractive(coolingTower, towerCompId);
    plantGroup.add(coolingTower);

    // Volumetric Atmospheric Steam Vapor Particles
    for (let i = 0; i < 40; i++) {
      const vGeo = new THREE.SphereGeometry(Math.random() * 5 + 3, 12, 12);
      const vMat = new THREE.MeshPhongMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const vapor = new THREE.Mesh(vGeo, vMat);
      vapor.position.set(
        80 + (Math.random() - 0.5) * 6,
        24 + Math.random() * 28,
        (Math.random() - 0.5) * 6,
      );
      plantGroup.add(vapor);
      vaporParticlesRef.current.push({
        mesh: vapor,
        speed: 0.06 + Math.random() * 0.04,
      });
    }

    // Tertiary Cooling Loop Pipes (Condenser -> Tower -> Condenser)
    if (system.id !== "phwr") {
      const towerPipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(43, -18, 0),
        new THREE.Vector3(60, -22, -8),
        new THREE.Vector3(80, -20, 0),
      ]);
      const towerPipe = new THREE.Mesh(
        new THREE.TubeGeometry(towerPipeCurve, 24, 1.5, 12, false),
        new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.35,
          clearcoat: 0.5,
        }),
      );
      plantGroup.add(towerPipe);
      addFlowParticles(towerPipeCurve, 8, 0x34d399, "tertiary");
    }

    // -------------------------------------------------------------
    // Animation Frame Loop
    // -------------------------------------------------------------
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // 1. Controls & Camera Transitions
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (isTransitioningRef.current && controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.08);
        camera.position.lerp(targetCamPosRef.current, 0.08);
        if (
          controlsRef.current.target.distanceTo(targetLookAtRef.current) <
            0.2 &&
          camera.position.distanceTo(targetCamPosRef.current) < 0.2
        ) {
          isTransitioningRef.current = false;
        }
      }

      // Update zoom level percentage badge based on camera distance
      if (controlsRef.current) {
        const dist = camera.position.distanceTo(controlsRef.current.target);
        const zPct = Math.round((140 / dist) * 100);
        setZoomPercent(zPct);
      }

      // 2. Animate Turbines
      const turbineSpeed =
        powerLevel === 100 ? 0.25 : powerLevel === 50 ? 0.12 : 0;
      turbineRotorsRef.current.forEach((rotor) => {
        rotor.rotation.x += turbineSpeed;
      });

      // 3. Animate Control Rod Height based on Power Level
      if (controlRodsRef.current) {
        const targetY = powerLevel === 100 ? 12 : powerLevel === 50 ? 6 : 0;
        controlRodsRef.current.position.y +=
          (targetY - controlRodsRef.current.position.y) * 0.05;
      }

      // 4. Core Fission Light Intensity
      if (coreLightRef.current) {
        const targetIntensity =
          powerLevel === 100 ? 3.0 : powerLevel === 50 ? 1.4 : 0;
        coreLightRef.current.intensity +=
          (targetIntensity - coreLightRef.current.intensity) * 0.05;
      }

      // 5. Animate Cooling Tower Vapor Plume
      const vaporSpeedMult =
        powerLevel === 100 ? 1.0 : powerLevel === 50 ? 0.5 : 0.05;
      vaporParticlesRef.current.forEach((p) => {
        p.mesh.position.y += p.speed * vaporSpeedMult;
        const scale = 1 + (p.mesh.position.y - 24) * 0.08;
        p.mesh.scale.set(scale, scale, scale);
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.15 - (p.mesh.position.y - 24) * 0.005);

        if (p.mesh.position.y > 52) {
          p.mesh.position.y = 24;
          p.mesh.position.x = 80 + (Math.random() - 0.5) * 8;
          p.mesh.position.z = (Math.random() - 0.5) * 8;
        }
      });

      // 6. Animate Flow Particles
      const flowSpeedMult =
        powerLevel === 100 ? 1.0 : powerLevel === 50 ? 0.5 : 0.0;
      const activeLoopFilter = activeLoopFilterRef.current;
      flowParticlesRef.current.forEach((p) => {
        if (activeLoopFilter !== "all" && activeLoopFilter !== p.loop) {
          p.mesh.visible = false;
        } else {
          p.mesh.visible = true;
          if (flowSpeedMult > 0) {
            p.progress += p.speed * flowSpeedMult;
            if (p.progress > 1) p.progress -= 1;
            const pt = p.curve.getPointAt(p.progress);
            p.mesh.position.copy(pt);
          }
        }
      });

      // 7. Render Pass
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!mount || !camera || !renderer) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (composerRef.current) {
          composerRef.current.setSize(w, h);
        }
      }
    };
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mount);

    // Initial resize to ensure correct canvas sizing
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [system.id, powerLevel]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const rect = mount.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current.set(x, y);

    // Raycast Hover detection
    if (cameraRef.current && sceneRef.current) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        interactiveMeshesRef.current,
        true,
      );

      if (intersects.length > 0) {
        let hitCompId: string | null = null;
        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr) {
            if (curr.userData && curr.userData.componentId) {
              hitCompId = curr.userData.componentId;
              break;
            }
            curr = curr.parent;
          }
          if (hitCompId) break;
        }

        if (hitCompId) {
          const comp =
            system.components.find((c) => c.id === hitCompId) ?? null;
          setHoveredComponent(comp);
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          mount.style.cursor = "pointer";
          return;
        }
      }

      setHoveredComponent(null);
      setTooltipPos(null);
      mount.style.cursor = "grab";
    }
  };

  // Handle Click to Select & Zoom
  const handleClick = () => {
    if (hoveredComponent) {
      onSelectPart(hoveredComponent.id);
    }
  };

  return (
    <div className={styles.canvasContainer}>
      {/* 3D WebGL Interaction Surface & Canvas Mount */}
      <div
        ref={canvasMountRef}
        className={styles.webglCanvas}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        role="region"
        aria-label="3D Interactive Reactor Model Canvas"
      />

      {/* Floating Zoom Level Badge */}
      <div className={styles.zoomBadge}>
        <span>🔍 {zoomPercent}%</span>
      </div>

      {/* Floating HUD Controls */}
      <div className={styles.hudControls}>
        <div className={styles.hudGroup}>
          <button
            type="button"
            className={styles.hudButton}
            onClick={handleResetCamera}
            title="Reset to Full Plant View"
          >
            🎥 Reset View
          </button>
          <button
            type="button"
            className={`${styles.hudButton} ${isAutoRotate ? styles.hudButtonActive : ""}`}
            onClick={() => setIsAutoRotate((prev) => !prev)}
            title="Toggle Auto Orbit"
          >
            🔄 {isAutoRotate ? "Orbit On" : "Auto Orbit"}
          </button>
        </div>

        <div className={styles.hudGroup}>
          <button
            type="button"
            className={styles.hudButton}
            onClick={handleZoomIn}
            title="Zoom In"
          >
            ➕
          </button>
          <button
            type="button"
            className={styles.hudButton}
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            ➖
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className={styles.bottomHint}>
        <span className={styles.hintDot} />
        <span>
          Click any 3D part to zoom in & inspect · Drag to orbit · Scroll to
          zoom
        </span>
      </div>

      {/* Interactive 3D Hover Tooltip */}
      {hoveredComponent && tooltipPos && (
        <div
          className={styles.hoverTooltip}
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <span className={styles.tooltipTitle}>{hoveredComponent.name}</span>
          <span className={styles.tooltipSubtitle}>
            {hoveredComponent.role}
          </span>
          <span className={styles.tooltipHint}>
            Click to zoom in & inspect 🔍
          </span>
        </div>
      )}
    </div>
  );
}
