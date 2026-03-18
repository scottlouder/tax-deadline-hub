import statesData from "../data/states.json";
import entityTypesData from "../data/entity-types.json";
import federalDeadlinesData from "../data/federal-deadlines.json";
import stateDeadlinesData from "../data/state-deadlines.json";

export type State = {
  slug: string;
  name: string;
  abbreviation: string;
  hasIncomeTax: boolean;
  taxAgency: {
    name: string;
    url: string;
  };
};

export type EntityType = {
  slug: string;
  name: string;
  description: string;
  federalForm: string;
  deadlineInfo: string;
};

export type StateDeadlineEntry = {
  entityType: string;
  returnForm: string;
  dueDate: string | null;
  extensionDate: string | null;
  estimatedPayments: string[];
  notes: string;
};

export type StateDeadline = {
  stateSlug: string;
  stateName: string;
  abbreviation: string;
  hasIncomeTax: boolean;
  taxAgency: { name: string; url: string };
  deadlines: StateDeadlineEntry[];
  notes: string;
};

export type FederalDeadlines = typeof federalDeadlinesData;

export const states = statesData as State[];
export const entityTypes = entityTypesData as EntityType[];
export const federalDeadlines = federalDeadlinesData as FederalDeadlines;
export const stateDeadlines = stateDeadlinesData as StateDeadline[];

export const getStateBySlug = (slug: string) =>
  states.find((state) => state.slug === slug) ?? null;

export const getEntityBySlug = (slug: string) =>
  entityTypes.find((entity) => entity.slug === slug) ?? null;

export const getStateDeadlineBySlug = (slug: string) =>
  stateDeadlines.find((state) => state.stateSlug === slug) ?? null;

export const getStateEntityDeadline = (stateSlug: string, entitySlug: string) => {
  const state = getStateDeadlineBySlug(stateSlug);
  if (!state) return null;
  const deadline = state.deadlines.find((entry) => entry.entityType === entitySlug);
  return deadline ?? null;
};

// Neighboring states mapping for internal linking
const neighboringStatesMap: Record<string, string[]> = {
  alabama: ["florida", "georgia", "mississippi", "tennessee"],
  alaska: ["washington", "hawaii"],
  arizona: ["california", "colorado", "nevada", "new-mexico", "utah"],
  arkansas: ["louisiana", "mississippi", "missouri", "oklahoma", "tennessee", "texas"],
  california: ["arizona", "nevada", "oregon"],
  colorado: ["arizona", "kansas", "nebraska", "new-mexico", "oklahoma", "utah", "wyoming"],
  connecticut: ["massachusetts", "new-york", "rhode-island"],
  delaware: ["maryland", "new-jersey", "pennsylvania"],
  "district-of-columbia": ["maryland", "virginia"],
  florida: ["alabama", "georgia"],
  georgia: ["alabama", "florida", "north-carolina", "south-carolina", "tennessee"],
  hawaii: ["california", "alaska"],
  idaho: ["montana", "nevada", "oregon", "utah", "washington", "wyoming"],
  illinois: ["indiana", "iowa", "kentucky", "missouri", "wisconsin"],
  indiana: ["illinois", "kentucky", "michigan", "ohio"],
  iowa: ["illinois", "minnesota", "missouri", "nebraska", "south-dakota", "wisconsin"],
  kansas: ["colorado", "missouri", "nebraska", "oklahoma"],
  kentucky: ["illinois", "indiana", "missouri", "ohio", "tennessee", "virginia", "west-virginia"],
  louisiana: ["arkansas", "mississippi", "texas"],
  maine: ["new-hampshire", "massachusetts"],
  maryland: ["delaware", "district-of-columbia", "pennsylvania", "virginia", "west-virginia"],
  massachusetts: ["connecticut", "new-hampshire", "new-york", "rhode-island", "vermont"],
  michigan: ["indiana", "ohio", "wisconsin"],
  minnesota: ["iowa", "north-dakota", "south-dakota", "wisconsin"],
  mississippi: ["alabama", "arkansas", "louisiana", "tennessee"],
  missouri: ["arkansas", "illinois", "iowa", "kansas", "kentucky", "nebraska", "oklahoma", "tennessee"],
  montana: ["idaho", "north-dakota", "south-dakota", "wyoming"],
  nebraska: ["colorado", "iowa", "kansas", "missouri", "south-dakota", "wyoming"],
  nevada: ["arizona", "california", "idaho", "oregon", "utah"],
  "new-hampshire": ["maine", "massachusetts", "vermont"],
  "new-jersey": ["delaware", "new-york", "pennsylvania"],
  "new-mexico": ["arizona", "colorado", "oklahoma", "texas", "utah"],
  "new-york": ["connecticut", "massachusetts", "new-jersey", "pennsylvania", "vermont"],
  "north-carolina": ["georgia", "south-carolina", "tennessee", "virginia"],
  "north-dakota": ["minnesota", "montana", "south-dakota"],
  ohio: ["indiana", "kentucky", "michigan", "pennsylvania", "west-virginia"],
  oklahoma: ["arkansas", "colorado", "kansas", "missouri", "new-mexico", "texas"],
  oregon: ["california", "idaho", "nevada", "washington"],
  pennsylvania: ["delaware", "maryland", "new-jersey", "new-york", "ohio", "west-virginia"],
  "rhode-island": ["connecticut", "massachusetts"],
  "south-carolina": ["georgia", "north-carolina"],
  "south-dakota": ["iowa", "minnesota", "montana", "nebraska", "north-dakota", "wyoming"],
  tennessee: ["alabama", "arkansas", "georgia", "kentucky", "mississippi", "missouri", "north-carolina", "virginia"],
  texas: ["arkansas", "louisiana", "new-mexico", "oklahoma"],
  utah: ["arizona", "colorado", "idaho", "nevada", "new-mexico", "wyoming"],
  vermont: ["massachusetts", "new-hampshire", "new-york"],
  virginia: ["district-of-columbia", "kentucky", "maryland", "north-carolina", "tennessee", "west-virginia"],
  washington: ["idaho", "oregon"],
  "west-virginia": ["kentucky", "maryland", "ohio", "pennsylvania", "virginia"],
  wisconsin: ["illinois", "iowa", "michigan", "minnesota"],
  wyoming: ["colorado", "idaho", "montana", "nebraska", "south-dakota", "utah"],
};

export const getNeighboringStates = (stateSlug: string): State[] => {
  const neighborSlugs = neighboringStatesMap[stateSlug] ?? [];
  return neighborSlugs
    .map((slug) => states.find((s) => s.slug === slug))
    .filter((s): s is State => s !== undefined);
};

export const popularStates = [
  "california", "new-york", "texas", "florida",
  "pennsylvania", "ohio", "illinois", "new-jersey",
] as const;

export const getPopularStates = (): State[] =>
  popularStates
    .map((slug) => states.find((s) => s.slug === slug))
    .filter((s): s is State => s !== undefined);
