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
