"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { themePreferenceStore } from "@/lib/preferences/theme-preference";
import { SCENE_PALETTES } from "@/lib/graphics/scene-palette";
import type { ExhibitKind } from "./spatial-model";
import styles from "./ExhibitFrame.module.css";

type Props = {
  kind: ExhibitKind;
  stage: number;
  selected: string;
  rotate: boolean;
  reset: number;
  zoom: number;
  onFailure: () => void;
};
export default function SpatialCanvas(props: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const update = useRef<((value: Props) => void) | null>(null);
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
    update.current?.(props);
  }, [props]);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 2, 11);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      latest.current.onFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 18;
    controls.saveState();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x393047, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(3, 6, 5);
    scene.add(light);
    const group = new THREE.Group();
    scene.add(group);
    const meshes: THREE.Mesh[] = [];
    function mesh(
      geometry: THREE.BufferGeometry,
      part: string,
      x: number,
      y: number,
      z: number,
      tone = 0,
    ) {
      const material = new THREE.MeshStandardMaterial({
        color: 0x9872dd,
        roughness: 0.35,
        metalness: 0.2,
      });
      const object = new THREE.Mesh(geometry, material);
      object.position.set(x, y, z);
      object.userData = { part, base: object.position.clone(), tone };
      meshes.push(object);
      group.add(object);
      return object;
    }
    if (props.kind === "atom") {
      for (let i = 0; i < 12; i++) {
        const t = i * 2.399;
        mesh(
          new THREE.SphereGeometry(0.3, 20, 14),
          "nucleus",
          Math.cos(t) * 0.48,
          Math.sin(t) * 0.48,
          ((i % 3) - 1) * 0.36,
          i % 2,
        );
      }
      const cloud = mesh(
        new THREE.SphereGeometry(2, 32, 24),
        "electrons",
        0,
        0,
        0,
        1,
      );
      (cloud.material as THREE.MeshStandardMaterial).transparent = true;
      (cloud.material as THREE.MeshStandardMaterial).opacity = 0.09;
      (cloud.material as THREE.MeshStandardMaterial).depthWrite = false;
      for (let i = 0; i < 3; i++) {
        const t = (i * Math.PI * 2) / 3;
        mesh(
          new THREE.SphereGeometry(0.09, 16, 12),
          "electrons",
          Math.cos(t) * 2,
          Math.sin(t) * 1.2,
          Math.sin(t) * 1.3,
          2,
        );
      }
    } else if (props.kind === "fuel") {
      for (let x = -2; x <= 2; x++)
        for (let z = -2; z <= 2; z++) {
          if (x === 0 && z === 0) {
            for (let y = 0; y < 8; y++)
              mesh(
                new THREE.CylinderGeometry(0.12, 0.12, 0.32, 16),
                "pellets",
                0,
                -1.5 + y * 0.41,
                0,
                2,
              );
          } else
            mesh(
              new THREE.CylinderGeometry(0.13, 0.13, 3.6, 16),
              "rods",
              x * 0.45,
              0,
              z * 0.45,
              1,
            );
        }
      for (const y of [-1.25, 0, 1.25]) {
        for (const z of [-1.1, 1.1])
          mesh(new THREE.BoxGeometry(2.4, 0.13, 0.08), "spacers", 0, y, z, 0);
        for (const x of [-1.1, 1.1])
          mesh(new THREE.BoxGeometry(0.08, 0.13, 2.4), "spacers", x, y, 0, 0);
      }
    } else {
      mesh(new THREE.SphereGeometry(0.75, 28, 20), "nucleus", 0, 0, 0, 0);
      mesh(new THREE.SphereGeometry(0.58, 28, 20), "fragment", 0, 0, 0, 2);
      for (let i = 0; i < 3; i++)
        mesh(new THREE.SphereGeometry(0.1, 16, 12), "neutrons", -2.5, 0, 0, 1);
    }
    let raf = 0,
      rotating = false,
      visible = true,
      previous = 0,
      lastReset = latest.current.reset,
      lastZoom = latest.current.zoom,
      lost = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function render() {
      if (!lost && visible && !document.hidden) renderer.render(scene, camera);
    }
    function tick(time: number) {
      raf = 0;
      if (!rotating || reduced.matches || !visible || document.hidden || lost)
        return;
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      group.rotation.y += delta * 0.25;
      render();
      raf = requestAnimationFrame(tick);
    }
    function schedule() {
      cancelAnimationFrame(raf);
      raf = 0;
      previous = 0;
      render();
      if (rotating && !reduced.matches && visible && !document.hidden && !lost)
        raf = requestAnimationFrame(tick);
    }
    function apply(value: Props) {
      rotating = value.rotate;
      if (value.reset !== lastReset) {
        controls.reset();
        group.rotation.set(0, 0, 0);
        lastReset = value.reset;
        lastZoom = 1;
      }
      if (value.zoom !== lastZoom) {
        camera.position.multiplyScalar(lastZoom / value.zoom);
        lastZoom = value.zoom;
        controls.update();
      }
      const palette =
        SCENE_PALETTES[themePreferenceStore.getResolvedSnapshot()];
      for (const object of meshes) {
        const { part, base, tone } = object.userData;
        object.position.copy(base);
        object.scale.set(1, 1, 1);
        object.visible = true;
        const material = object.material as THREE.MeshStandardMaterial;
        material.color.setHex(
          [palette.nuclear, palette.coolant, palette.heat][tone],
        );
        material.emissive.copy(material.color);
        material.emissiveIntensity = part === value.selected ? 0.15 : 0;
        if (props.kind === "fuel" && value.stage > 0) {
          if (part === "spacers")
            object.position.y += Math.sign(base.y) * value.stage * 0.7;
          else {
            object.position.x *= 1 + value.stage * 0.3;
            object.position.z *= 1 + value.stage * 0.3;
          }
        }
        if (props.kind === "fission") {
          if (part === "nucleus") {
            object.scale.set(
              value.stage === 2 ? 1.5 : 1,
              value.stage === 2 ? 0.65 : 1,
              1,
            );
            if (value.stage === 3) {
              object.position.x = -1;
              object.scale.setScalar(0.75);
            }
          }
          if (part === "fragment") {
            object.visible = value.stage === 3;
            object.position.x = 1.1;
          }
          if (part === "neutrons") {
            const index = meshes.indexOf(object) - 2;
            object.visible =
              value.stage === 0 ? index === 0 : value.stage === 3;
            object.position.set(
              value.stage === 3 ? 1.8 + index * 0.45 : -2.1,
              value.stage === 3 ? (index - 1) * 0.8 : 0,
              0,
            );
          }
        }
      }
      schedule();
    }
    update.current = apply;
    controls.addEventListener("change", render);
    const stopTheme = themePreferenceStore.subscribe(() =>
      apply(latest.current),
    );
    const resize = new ResizeObserver(() => {
      const w = host.clientWidth,
        h = host.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        render();
      }
    });
    resize.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    intersection.observe(host);
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      latest.current.onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    apply(latest.current);
    return () => {
      update.current = null;
      cancelAnimationFrame(raf);
      stopTheme();
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      controls.dispose();
      meshes.forEach((object) => {
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [props.kind]);
  return (
    <div
      ref={mount}
      className={styles.canvas}
      role="img"
      aria-label={`Interactive ${props.kind} model. Use the labeled controls below or drag to inspect.`}
    />
  );
}
