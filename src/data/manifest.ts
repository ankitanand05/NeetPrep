import type { Question, Subject } from "@/types";

import physicsMotionInAStraightLine from "./physics/motion-in-a-straight-line.json";
import physicsMotionInAPlane from "./physics/motion-in-a-plane.json";
import physicsLawsOfMotion from "./physics/laws-of-motion.json";
import chemistryStructureOfAtom from "./chemistry/atomic-structure.json";
import chemistryChemicalBonding from "./chemistry/chemical-bonding.json";
import chemistryPeriodicTable from "./chemistry/periodic-table.json";
import botanyCellStructure from "./botany/cell-structure.json";
import botanyPlantKingdom from "./botany/plant-kingdom.json";
import zoologyAnimalKingdom from "./zoology/animal-kingdom.json";
import zoologyDigestion from "./zoology/human-physiology-digestion.json";

/**
 * Register every chapter JSON file here. Adding a new chapter later means:
 * 1. Drop the new JSON file under src/data/<subject>/.
 * 2. Add one import + one array entry below.
 * No other code changes are required — pages/loaders read from this manifest,
 * and the full chapter list (including chapters with 0 questions so far) comes
 * from src/constants/syllabus.ts.
 */
export const CHAPTER_FILES: Record<Subject, Question[][]> = {
  Physics: [
    physicsMotionInAStraightLine as Question[],
    physicsMotionInAPlane as Question[],
    physicsLawsOfMotion as Question[],
  ],
  Chemistry: [
    chemistryStructureOfAtom as Question[],
    chemistryChemicalBonding as Question[],
    chemistryPeriodicTable as Question[],
  ],
  Botany: [botanyCellStructure as Question[], botanyPlantKingdom as Question[]],
  Zoology: [zoologyAnimalKingdom as Question[], zoologyDigestion as Question[]],
};
