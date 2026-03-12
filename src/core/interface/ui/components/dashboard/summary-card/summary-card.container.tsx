import React from "react";
import StatusCardView from "./summary-card.view";
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity";

interface ISummaryCardContainer {
  data: ISummary[];
}

export const SummaryCardContainer: React.FC<ISummaryCardContainer> = (props) => {
  return <StatusCardView
    data={props.data ?? []}
  />;
};