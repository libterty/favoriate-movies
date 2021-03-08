export interface IValidationFail {
  constraints: {
    [key: string]: string;
  };
  property: string;
  [futureKey: string]: any;
}
