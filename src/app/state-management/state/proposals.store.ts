import { Proposal } from "../models";

export interface ProposalFilters {
  skip: number;
  limit: number;
  sortField: "MeasurementPeriodList[0].start:desc";
}

export interface ProposalsState {
  proposals: { [proposalId: string]: Proposal };
  datasets: { [datasetId: string]: any };
  hasFetched: boolean;
  selectedId: string;
  datasetCount: number;
  filters: ProposalFilters;
}

export const initialProposalsState: ProposalsState = {
  proposals: {},
  datasets: {},
  hasFetched: false,
  selectedId: null,
  datasetCount: null,
  filters: { skip: 0, limit: 30,   sortField: "MeasurementPeriodList[0].start:desc" }
};
