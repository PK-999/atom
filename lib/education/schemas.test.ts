import { expect, test } from "vitest";
import { LessonSchema, ModuleSchema, ConceptSchema } from "./schemas";

test("LessonSchema validates a valid lesson", () => {
  const lesson = {
    id: "what-is-an-atom",
    title: "What is an atom?",
    moduleId: "nuclear-101",
    order: 1,
    explanations: {
      kid: "An atom is a tiny building block.",
      simple: "Atoms are the basic units of matter.",
      curious: "Atoms consist of a nucleus and electrons.",
      technical:
        "An atom comprises protons, neutrons, and electrons bound by electromagnetic forces.",
      expert: "Quantum mechanical model of the atom...",
    },
    conceptIds: ["nucleus", "electron"],
  };

  const parsed = LessonSchema.parse(lesson);
  expect(parsed.id).toBe("what-is-an-atom");
});

test("ModuleSchema validates a valid module", () => {
  const moduleData = {
    id: "nuclear-101",
    title: "Nuclear 101",
    description: "The basics of nuclear energy.",
    order: 1,
  };

  const parsed = ModuleSchema.parse(moduleData);
  expect(parsed.id).toBe("nuclear-101");
});

test("ConceptSchema validates a valid concept", () => {
  const concept = {
    id: "nucleus",
    title: "Nucleus",
    summary: "The center of an atom.",
    complexityMinimum: "curious",
  };

  const parsed = ConceptSchema.parse(concept);
  expect(parsed.id).toBe("nucleus");
});
