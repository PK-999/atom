import { expect, it, vi } from "vitest";
import * as THREE from "three";
import { disposeScene } from "./dispose-scene";
it("disposes shared geometry, material, texture and shadow resources once", () => {
  const root = new THREE.Group();
  const texture = new THREE.Texture();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ map: texture });
  root.add(
    new THREE.Mesh(geometry, material),
    new THREE.Mesh(geometry, material),
  );
  const light = new THREE.DirectionalLight();
  root.add(light);
  const geometryDispose = vi.spyOn(geometry, "dispose");
  const materialDispose = vi.spyOn(material, "dispose");
  const textureDispose = vi.spyOn(texture, "dispose");
  const shadowDispose = vi.spyOn(light.shadow, "dispose");
  disposeScene(root);
  for (const dispose of [
    geometryDispose,
    materialDispose,
    textureDispose,
    shadowDispose,
  ])
    expect(dispose).toHaveBeenCalledTimes(1);
});
