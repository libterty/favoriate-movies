import * as EAgg from '../enums';

export interface IAggregateResponse<T> {
  type: EAgg.ESocketEvent;
  data: T;
}
