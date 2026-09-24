"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { GraphicsBoundary } from "./GraphicsBoundary";
import { SpatialDiagram } from "./SpatialDiagram";
import { EXHIBIT_PARTS, type ExhibitKind } from "./spatial-model";
import styles from "./ExhibitFrame.module.css";
const SpatialCanvas = dynamic(() => import("./SpatialCanvas"), {
  ssr: false,
  loading: () => (
    <p role="status">Loading spatial model… The schematic remains available.</p>
  ),
});
export function SpatialExhibit({
  kind,
  stage = 0,
}: {
  kind: ExhibitKind;
  stage?: number;
}) {
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [selected, setSelected] = useState<string>(EXHIBIT_PARTS[kind][0].id);
  const [rotate, setRotate] = useState(false);
  const [reset, setReset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const fallback = () => {
    setFailed(true);
    setMode("2d");
  };
  return (
    <>
      <div className={styles.controls} role="group" aria-label="Rendering mode">
        <button
          type="button"
          aria-pressed={mode === "2d"}
          onClick={() => setMode("2d")}
        >
          2D schematic
        </button>
        <button
          type="button"
          aria-pressed={mode === "3d"}
          onClick={() => {
            setFailed(false);
            setMode("3d");
          }}
        >
          Inspect in 3D
        </button>
      </div>
      {failed && (
        <p role="status">
          3D graphics are unavailable. Your selection and experiment are
          preserved in the schematic.
        </p>
      )}
      <div className={styles.stage}>
        {mode === "3d" ? (
          <GraphicsBoundary onFailure={fallback}>
            <SpatialCanvas
              kind={kind}
              stage={stage}
              selected={selected}
              rotate={rotate}
              reset={reset}
              zoom={zoom}
              onFailure={fallback}
            />
          </GraphicsBoundary>
        ) : (
          <SpatialDiagram kind={kind} stage={stage} selected={selected} />
        )}
        <p className={styles.caption}>
          Conceptual geometry · not to scale · labels and descriptions below
        </p>
      </div>
      {mode === "3d" && (
        <div
          className={styles.controls}
          role="group"
          aria-label="Camera controls"
        >
          <button
            type="button"
            aria-pressed={rotate}
            onClick={() => setRotate(!rotate)}
          >
            {rotate ? "Stop rotation" : "Rotate model"}
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.2))}
          >
            Zoom in
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}
          >
            Zoom out
          </button>
          <button
            type="button"
            onClick={() => {
              setReset((r) => r + 1);
              setZoom(1);
              setRotate(false);
            }}
          >
            Reset view
          </button>
        </div>
      )}
      <div
        className={styles.parts}
        role="group"
        aria-label="Inspect components"
      >
        {EXHIBIT_PARTS[kind].map((part) => (
          <button
            type="button"
            key={part.id}
            aria-pressed={selected === part.id}
            onClick={() => setSelected(part.id)}
          >
            {part.label}
          </button>
        ))}
      </div>
      <p>{EXHIBIT_PARTS[kind].find((part) => part.id === selected)?.text}</p>
    </>
  );
}
