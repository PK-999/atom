"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { Facility } from "@/lib/globe/schemas";
import { useMotionPreferences } from "@/lib/accessibility/motion";
import worldLandData from "@/data/reactors/world-land-110m.json";

interface Globe3DCanvasProps {
  facilities: readonly Facility[];
  selectedId: string | null;
  onSelectFacility: (id: string) => void;
  isAutoRotate: boolean;
  zoomLevel: number; // 1.0 is default, higher = zoomed in
  onZoomChange?: (updater: (prev: number) => number) => void;
}

const GLOBE_RADIUS = 100;

export function Globe3DCanvas({
  facilities,
  selectedId,
  onSelectFacility,
  isAutoRotate,
  zoomLevel,
  onZoomChange,
}: Globe3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);
  const selectedPulseRef = useRef<THREE.Mesh | null>(null);
  const shouldAnimateRef = useRef(true);
  const animationFrameRef = useRef<number | null>(null);
  const startAnimationRef = useRef<(() => void) | null>(null);

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.2, y: 0.8 }); // pitch, yaw
  const currentRotationRef = useRef({ x: 0.2, y: 0.8 });
  const isAutoRotateRef = useRef(isAutoRotate);
  const zoomRef = useRef(zoomLevel);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVecRef = useRef(new THREE.Vector2(-1000, -1000));
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null);
  const [mouseScreenPos, setMouseScreenPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { shouldAnimate } = useMotionPreferences();

  useEffect(() => {
    shouldAnimateRef.current = shouldAnimate;
    if (shouldAnimate) {
      startAnimationRef.current?.();
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [shouldAnimate]);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    zoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // Non-passive wheel event listener to handle trackpad/wheel zoom and prevent browser page scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent the page from scrolling while user is zooming over the 3D globe
      e.preventDefault();
      e.stopPropagation();

      if (!onZoomChange) return;

      // Sensitivity: on laptop trackpads, pinch-to-zoom sets ctrlKey; two-finger scroll has standard deltaY
      const sensitivity = e.ctrlKey ? 0.008 : 0.0018;
      const zoomMultiplier = 1 - e.deltaY * sensitivity;

      onZoomChange((prev) => {
        const next = prev * zoomMultiplier;
        const clamped = Math.max(0.8, Math.min(6.0, next));
        return Number(clamped.toFixed(2));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [onZoomChange]);

  // Rotate globe towards selected facility when changed externally
  useEffect(() => {
    if (!selectedId) return;
    const selected = facilities.find((f) => f.id === selectedId);
    if (!selected) return;

    const lat = selected.coordinates.latitude;
    const lon = selected.coordinates.longitude;

    // Calculate target pitch and yaw to bring (lat, lon) to the front center
    const targetPitch = (lat * Math.PI) / 180;
    const baseTargetYaw = -((lon + 90) * Math.PI) / 180;

    // Calculate shortest arc from current rotation to avoid extra turns
    const currentY = currentRotationRef.current.y;
    let diff = (baseTargetYaw - currentY) % (2 * Math.PI);
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;

    targetRotationRef.current = {
      x: Math.max(-1.4, Math.min(1.4, targetPitch)),
      y: currentY + diff,
    };
  }, [selectedId, facilities]);

  // Coordinate Conversion Helper: Lat/Lon -> 3D Vector
  const latLonToVector3 = useCallback(
    (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
    },
    [],
  );

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 260 / zoomRef.current;
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // In non-WebGL environments (e.g. jsdom / SSR / test runners), gracefully degrade
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    directionalLight1.position.set(200, 150, 300);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x818cf8, 0.6);
    directionalLight2.position.set(-200, -100, -200);
    scene.add(directionalLight2);

    // 5. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // --- High-Resolution Landmass Canvas Texture ---
    // Render the accurate Natural Earth SVG path to an offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Ocean Base Color
      ctx.fillStyle = "#0a1324";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lat/Lon Grid lines on Texture
      ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 1.5;

      // Meridians
      for (let x = 0; x <= canvas.width; x += canvas.width / 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      // Parallels
      for (let y = 0; y <= canvas.height; y += canvas.height / 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Natural Earth Landmass Path (scaled from 800x400 to 2048x1024)
      ctx.save();
      ctx.scale(canvas.width / 800, canvas.height / 400);

      // Landmass Fill
      const path2d = new Path2D(worldLandData.d);
      ctx.fillStyle = "#15253e";
      ctx.fill(path2d);

      // Landmass Coastlines
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 0.8;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 4;
      ctx.stroke(path2d);
      ctx.restore();
    }

    const landTexture = new THREE.CanvasTexture(canvas);
    landTexture.wrapS = THREE.RepeatWrapping;
    landTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 6. Base Ocean & Continents Sphere
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: landTexture,
      shininess: 25,
      specular: new THREE.Color(0x1e293b),
      emissive: new THREE.Color(0x030712),
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(earthMesh);

    // 7. Atmosphere Halo Rim
    const atmosphereGeometry = new THREE.SphereGeometry(
      GLOBE_RADIUS * 1.03,
      48,
      48,
    );
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial,
    );
    globeGroup.add(atmosphereMesh);

    // 8. Equator & Coordinate Rings
    const ringGeometry = new THREE.RingGeometry(
      GLOBE_RADIUS * 1.002,
      GLOBE_RADIUS * 1.004,
      64,
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const equatorRing = new THREE.Mesh(ringGeometry, ringMaterial);
    equatorRing.rotation.x = Math.PI / 2;
    globeGroup.add(equatorRing);

    // 9. Facility Markers Group
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    markerGroupRef.current = markerGroup;

    // 10. Selected Pulse Ring
    const pulseGeometry = new THREE.RingGeometry(1.2, 2.8, 32);
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulseMesh.visible = false;
    globeGroup.add(pulseMesh);
    selectedPulseRef.current = pulseMesh;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!shouldAnimateRef.current) {
        renderer.render(scene, camera);
        animationFrameRef.current = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      animationFrameRef.current = animationFrameId;
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation when idle
      if (isAutoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.04 * delta;
      }

      // Smooth damping interpolation
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      if (globeGroup) {
        globeGroup.rotation.x = currentRotationRef.current.x;
        globeGroup.rotation.y = currentRotationRef.current.y;
      }

      // Smooth camera zoom: maintains safe distance above GLOBE_RADIUS at all zoom levels
      const targetCameraZ = GLOBE_RADIUS + 160 / zoomRef.current;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.12;

      // Animate selected facility pulse ring
      if (pulseMesh && pulseMesh.visible) {
        const pulseScale = 1 + 0.4 * Math.sin(elapsedTime * 4.5);
        pulseMesh.scale.set(pulseScale, pulseScale, pulseScale);
      }

      renderer.render(scene, camera);
    };

    startAnimationRef.current = animate;
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      animationFrameRef.current = null;
      startAnimationRef.current = null;
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      landTexture.dispose();
      container.innerHTML = "";
    };
  }, []);

  // Update Facility Markers whenever facilities or selection changes
  useEffect(() => {
    const markerGroup = markerGroupRef.current;
    if (!markerGroup) return;

    // Clear previous markers
    while (markerGroup.children.length > 0) {
      const child = markerGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      markerGroup.remove(child);
    }

    const pinGeometry = new THREE.SphereGeometry(1.6, 16, 16);
    const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);

    facilities.forEach((fac) => {
      const isSelected = fac.id === selectedId;
      const pos = latLonToVector3(
        fac.coordinates.latitude,
        fac.coordinates.longitude,
        GLOBE_RADIUS,
      );

      // Normal vector pointing outwards from Earth center
      const normal = pos.clone().normalize();

      // Pin Color by Status
      let pinColor = 0x10b981; // Operating (Green)
      if (fac.status === "under-construction") pinColor = 0x0284c7; // Sky Blue
      if (fac.status === "shutdown" || fac.status === "decommissioned")
        pinColor = 0xef4444; // Red
      if (fac.status === "mixed") pinColor = 0xf59e0b; // Amber

      // 1. Marker Head Sphere (maintains status color without white blowout)
      const pinMaterial = new THREE.MeshBasicMaterial({
        color: pinColor,
      });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      const elevatedPos = pos.clone().add(normal.clone().multiplyScalar(3.2));
      pinMesh.position.copy(elevatedPos);
      if (isSelected) {
        pinMesh.scale.set(1.1, 1.1, 1.1);
      }
      pinMesh.userData = { facility: fac, isPinHead: true };
      markerGroup.add(pinMesh);

      // 2. Beacon Stem Cylinder
      const stemMaterial = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.6,
      });
      const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
      stemMesh.position.copy(
        pos.clone().add(normal.clone().multiplyScalar(1.5)),
      );
      stemMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal,
      );
      markerGroup.add(stemMesh);

      // Update 3D Selected Pulse Position
      if (isSelected && selectedPulseRef.current) {
        selectedPulseRef.current.position.copy(
          pos.clone().add(normal.clone().multiplyScalar(0.4)),
        );
        selectedPulseRef.current.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          normal,
        );
        selectedPulseRef.current.visible = true;
      }
    });
  }, [facilities, selectedId, latLonToVector3]);

  // Pointer & Drag Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current || !markerGroupRef.current) return;

    // Handle Drag Rotation
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;

      targetRotationRef.current.y += deltaX * 0.006;
      targetRotationRef.current.x += deltaY * 0.006;

      // Limit pitch to avoid flipping upside down
      targetRotationRef.current.x = Math.max(
        -1.35,
        Math.min(1.35, targetRotationRef.current.x),
      );

      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Handle Hover Raycasting
    const rect = container.getBoundingClientRect();
    mouseVecRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVecRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(
      markerGroupRef.current.children,
    );

    const hit = intersects.find((i) => i.object.userData?.isPinHead);
    if (hit && hit.object.userData?.facility) {
      container.style.cursor = "pointer";
      setHoveredFacility(hit.object.userData.facility);
      setMouseScreenPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      container.style.cursor = "grab";
      setHoveredFacility(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = isDraggingRef.current;
    isDraggingRef.current = false;

    // If it was a quick click rather than a substantial drag
    const container = containerRef.current;
    if (!container || !cameraRef.current || !markerGroupRef.current) return;

    const rect = container.getBoundingClientRect();
    const clickDistance = Math.hypot(
      e.clientX - previousMousePosRef.current.x,
      e.clientY - previousMousePosRef.current.y,
    );

    if (clickDistance < 5) {
      mouseVecRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVecRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(
        mouseVecRef.current,
        cameraRef.current,
      );
      const intersects = raycasterRef.current.intersectObjects(
        markerGroupRef.current.children,
      );

      const hit = intersects.find((i) => i.object.userData?.isPinHead);
      if (hit && hit.object.userData?.facility) {
        const fac = hit.object.userData.facility as Facility;
        onSelectFacility(fac.id);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        isDraggingRef.current = false;
        setHoveredFacility(null);
      }}
      style={{
        width: "100%",
        height: "520px",
        position: "relative",
        cursor: "grab",
        touchAction: "none",
        overscrollBehavior: "contain",
        outline: "none",
      }}
      aria-label="Interactive 3D nuclear facilities globe"
      role="application"
      tabIndex={0}
    >
      {/* 3D Hover Tooltip */}
      {hoveredFacility && mouseScreenPos && (
        <div
          style={{
            position: "absolute",
            left: `${mouseScreenPos.x + 14}px`,
            top: `${mouseScreenPos.y - 14}px`,
            pointerEvents: "none",
            background: "rgba(10, 15, 30, 0.92)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "6px",
            padding: "6px 10px",
            color: "#ffffff",
            fontSize: "0.8rem",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          <strong style={{ display: "block", color: "#38bdf8" }}>
            {hoveredFacility.name}
          </strong>
          <span style={{ color: "#94a3b8" }}>
            {hoveredFacility.countryName} ·{" "}
            {hoveredFacility.totalCapacityMw !== null
              ? `${hoveredFacility.totalCapacityMw.toLocaleString()} MWe`
              : "Unknown"}{" "}
            ({hoveredFacility.status})
          </span>
        </div>
      )}
    </div>
  );
}
