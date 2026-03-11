import { ISummary } from '@base/core/domain/entities/dashboard/summary-overview.entity';
import { ISummaryModel } from '@data/gateways/api/api.types'
import { objectToCamel } from 'ts-case-convert';

export const mapSummaryOverviewAttributes = (initialModel: ISummaryModel[]): ISummary[] => {
  return [...objectToCamel(initialModel)]; 
}