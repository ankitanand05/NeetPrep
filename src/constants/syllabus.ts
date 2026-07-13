import type { SchoolClass, Subject } from "@/types";

export interface SyllabusChapter {
  subject: Subject;
  class: SchoolClass;
  unit: string;
  chapter: string;
}

/**
 * The full NEET/NCERT curriculum. This is the source of truth for which
 * chapters exist — question JSON files are added incrementally under
 * src/data/<subject>/, and each chapter here will show its live question
 * count (0 until a file for it is added to the manifest).
 */
export const SYLLABUS: SyllabusChapter[] = [
  // ---------- Physics — Class 11 ----------
  { subject: "Physics", class: "11", unit: "Physical World and Measurement", chapter: "Physical World" },
  { subject: "Physics", class: "11", unit: "Physical World and Measurement", chapter: "Units and Measurements" },
  { subject: "Physics", class: "11", unit: "Kinematics", chapter: "Motion in a Straight Line" },
  { subject: "Physics", class: "11", unit: "Kinematics", chapter: "Motion in a Plane" },
  { subject: "Physics", class: "11", unit: "Laws of Motion", chapter: "Laws of Motion" },
  { subject: "Physics", class: "11", unit: "Work, Energy and Power", chapter: "Work, Energy and Power" },
  {
    subject: "Physics",
    class: "11",
    unit: "Motion of System of Particles and Rigid Body",
    chapter: "System of Particles and Rotational Motion",
  },
  { subject: "Physics", class: "11", unit: "Gravitation", chapter: "Gravitation" },
  { subject: "Physics", class: "11", unit: "Properties of Bulk Matter", chapter: "Mechanical Properties of Solids" },
  { subject: "Physics", class: "11", unit: "Properties of Bulk Matter", chapter: "Mechanical Properties of Fluids" },
  { subject: "Physics", class: "11", unit: "Properties of Bulk Matter", chapter: "Thermal Properties of Matter" },
  { subject: "Physics", class: "11", unit: "Thermodynamics", chapter: "Thermodynamics" },
  {
    subject: "Physics",
    class: "11",
    unit: "Behaviour of Perfect Gases and Kinetic Theory of Gases",
    chapter: "Kinetic Theory",
  },
  { subject: "Physics", class: "11", unit: "Oscillations and Waves", chapter: "Oscillations" },
  { subject: "Physics", class: "11", unit: "Oscillations and Waves", chapter: "Waves" },

  // ---------- Physics — Class 12 ----------
  { subject: "Physics", class: "12", unit: "Electrostatics", chapter: "Electric Charges and Fields" },
  { subject: "Physics", class: "12", unit: "Electrostatics", chapter: "Electrostatic Potential and Capacitance" },
  { subject: "Physics", class: "12", unit: "Current Electricity", chapter: "Current Electricity" },
  {
    subject: "Physics",
    class: "12",
    unit: "Magnetic Effects of Current and Magnetism",
    chapter: "Moving Charges and Magnetism",
  },
  { subject: "Physics", class: "12", unit: "Magnetic Effects of Current and Magnetism", chapter: "Magnetism and Matter" },
  {
    subject: "Physics",
    class: "12",
    unit: "Electromagnetic Induction and Alternating Currents",
    chapter: "Electromagnetic Induction",
  },
  { subject: "Physics", class: "12", unit: "Electromagnetic Induction and Alternating Currents", chapter: "Alternating Current" },
  { subject: "Physics", class: "12", unit: "Electromagnetic Waves", chapter: "Electromagnetic Waves" },
  { subject: "Physics", class: "12", unit: "Optics", chapter: "Ray Optics and Optical Instruments" },
  { subject: "Physics", class: "12", unit: "Optics", chapter: "Wave Optics" },
  {
    subject: "Physics",
    class: "12",
    unit: "Dual Nature of Matter and Radiation",
    chapter: "Dual Nature of Radiation and Matter",
  },
  { subject: "Physics", class: "12", unit: "Atoms and Nuclei", chapter: "Atoms" },
  { subject: "Physics", class: "12", unit: "Atoms and Nuclei", chapter: "Nuclei" },
  {
    subject: "Physics",
    class: "12",
    unit: "Electronic Devices",
    chapter: "Semiconductor Electronics: Materials, Devices and Simple Circuits",
  },

  // ---------- Chemistry — Class 11 ----------
  { subject: "Chemistry", class: "11", unit: "Physical Chemistry", chapter: "Some Basic Concepts of Chemistry" },
  { subject: "Chemistry", class: "11", unit: "Physical Chemistry", chapter: "Structure of Atom" },
  { subject: "Chemistry", class: "11", unit: "Physical Chemistry", chapter: "States of Matter: Gases and Liquids" },
  { subject: "Chemistry", class: "11", unit: "Physical Chemistry", chapter: "Thermodynamics" },
  { subject: "Chemistry", class: "11", unit: "Physical Chemistry", chapter: "Equilibrium" },
  {
    subject: "Chemistry",
    class: "11",
    unit: "Inorganic Chemistry",
    chapter: "Classification of Elements and Periodicity in Properties",
  },
  { subject: "Chemistry", class: "11", unit: "Inorganic Chemistry", chapter: "Chemical Bonding and Molecular Structure" },
  { subject: "Chemistry", class: "11", unit: "Inorganic Chemistry", chapter: "Hydrogen" },
  { subject: "Chemistry", class: "11", unit: "Inorganic Chemistry", chapter: "The s-Block Elements" },
  { subject: "Chemistry", class: "11", unit: "Inorganic Chemistry", chapter: "The p-Block Elements (Groups 13 and 14)" },
  {
    subject: "Chemistry",
    class: "11",
    unit: "Organic Chemistry",
    chapter: "Organic Chemistry — Some Basic Principles and Techniques",
  },
  { subject: "Chemistry", class: "11", unit: "Organic Chemistry", chapter: "Hydrocarbons" },

  // ---------- Chemistry — Class 12 ----------
  { subject: "Chemistry", class: "12", unit: "Physical Chemistry", chapter: "Solutions" },
  { subject: "Chemistry", class: "12", unit: "Physical Chemistry", chapter: "Electrochemistry" },
  { subject: "Chemistry", class: "12", unit: "Physical Chemistry", chapter: "Chemical Kinetics" },
  { subject: "Chemistry", class: "12", unit: "Inorganic Chemistry", chapter: "The p-Block Elements (Groups 15 to 18)" },
  { subject: "Chemistry", class: "12", unit: "Inorganic Chemistry", chapter: "The d- and f-Block Elements" },
  { subject: "Chemistry", class: "12", unit: "Inorganic Chemistry", chapter: "Coordination Compounds" },
  { subject: "Chemistry", class: "12", unit: "Organic Chemistry", chapter: "Haloalkanes and Haloarenes" },
  { subject: "Chemistry", class: "12", unit: "Organic Chemistry", chapter: "Alcohols, Phenols and Ethers" },
  { subject: "Chemistry", class: "12", unit: "Organic Chemistry", chapter: "Aldehydes, Ketones and Carboxylic Acids" },
  { subject: "Chemistry", class: "12", unit: "Organic Chemistry", chapter: "Amines" },
  { subject: "Chemistry", class: "12", unit: "Organic Chemistry", chapter: "Biomolecules" },

  // ---------- Botany — Class 11 ----------
  { subject: "Botany", class: "11", unit: "Diversity in Living World", chapter: "The Living World" },
  { subject: "Botany", class: "11", unit: "Diversity in Living World", chapter: "Biological Classification" },
  { subject: "Botany", class: "11", unit: "Diversity in Living World", chapter: "Plant Kingdom" },
  {
    subject: "Botany",
    class: "11",
    unit: "Structural Organisation in Plants",
    chapter: "Morphology of Flowering Plants",
  },
  { subject: "Botany", class: "11", unit: "Structural Organisation in Plants", chapter: "Anatomy of Flowering Plants" },
  { subject: "Botany", class: "11", unit: "Cell Structure and Function", chapter: "Cell: The Unit of Life" },
  { subject: "Botany", class: "11", unit: "Cell Structure and Function", chapter: "Cell Cycle and Cell Division" },
  { subject: "Botany", class: "11", unit: "Plant Physiology", chapter: "Photosynthesis in Higher Plants" },
  { subject: "Botany", class: "11", unit: "Plant Physiology", chapter: "Respiration in Plants" },
  { subject: "Botany", class: "11", unit: "Plant Physiology", chapter: "Plant Growth and Development" },

  // ---------- Botany — Class 12 ----------
  { subject: "Botany", class: "12", unit: "Reproduction", chapter: "Sexual Reproduction in Flowering Plants" },
  { subject: "Botany", class: "12", unit: "Genetics and Evolution", chapter: "Principles of Inheritance and Variation" },
  { subject: "Botany", class: "12", unit: "Genetics and Evolution", chapter: "Molecular Basis of Inheritance" },
  { subject: "Botany", class: "12", unit: "Biology and Human Welfare", chapter: "Microbes in Human Welfare" },
  { subject: "Botany", class: "12", unit: "Biotechnology and Its Applications", chapter: "Biotechnology: Principles and Processes" },
  { subject: "Botany", class: "12", unit: "Biotechnology and Its Applications", chapter: "Biotechnology and its Applications" },
  { subject: "Botany", class: "12", unit: "Ecology and Environment", chapter: "Organisms and Populations" },
  { subject: "Botany", class: "12", unit: "Ecology and Environment", chapter: "Ecosystem" },
  { subject: "Botany", class: "12", unit: "Ecology and Environment", chapter: "Biodiversity and Conservation" },

  // ---------- Zoology — Class 11 ----------
  { subject: "Zoology", class: "11", unit: "Diversity in Living World", chapter: "Animal Kingdom" },
  { subject: "Zoology", class: "11", unit: "Structural Organisation in Animals", chapter: "Structural Organisation in Animals" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Digestion and Absorption" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Breathing and Exchange of Gases" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Body Fluids and Circulation" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Excretory Products and their Elimination" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Locomotion and Movement" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Neural Control and Coordination" },
  { subject: "Zoology", class: "11", unit: "Human Physiology", chapter: "Chemical Coordination and Integration" },

  // ---------- Zoology — Class 12 ----------
  { subject: "Zoology", class: "12", unit: "Reproduction", chapter: "Human Reproduction" },
  { subject: "Zoology", class: "12", unit: "Reproduction", chapter: "Reproductive Health" },
  { subject: "Zoology", class: "12", unit: "Genetics and Evolution", chapter: "Evolution" },
  { subject: "Zoology", class: "12", unit: "Biology and Human Welfare", chapter: "Human Health and Disease" },
];

export function getSyllabusForSubject(subject: Subject): SyllabusChapter[] {
  return SYLLABUS.filter((c) => c.subject === subject);
}
