"use client";

import {
  ComplexitySelector,
  useComplexityPreference,
} from "@/components/settings/ComplexitySelector";

export function GlobalComplexityControl() {
  const [level, setLevel] = useComplexityPreference("curious");

  return <ComplexitySelector onChange={setLevel} value={level} />;
}
