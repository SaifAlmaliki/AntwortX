import type { LucideIcon } from "lucide-react";
import { Lightbulb, Shield, Target, UserRound } from "lucide-react";

/** Stable ids — copy lives in locales under `missionSection.cards.<id>`. */
export const MISSION_PILLAR_IDS = [
  "innovation",
  "partnership",
  "excellence",
  "reliability",
] as const;

export type MissionPillarId = (typeof MISSION_PILLAR_IDS)[number];

export type MissionPillarDef = {
  id: MissionPillarId;
  icon: LucideIcon;
};

/** Order and icons only; titles/descriptions come from i18n (DRY with translations). */
export const MISSION_PILLAR_DEFS: readonly MissionPillarDef[] = [
  { id: "innovation", icon: Target },
  { id: "partnership", icon: UserRound },
  { id: "excellence", icon: Lightbulb },
  { id: "reliability", icon: Shield },
];

export type MissionSectionCards = Record<
  MissionPillarId,
  { title: string; description: string }
>;
