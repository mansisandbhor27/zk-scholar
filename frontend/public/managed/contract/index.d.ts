import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  createScholarshipProgram(context: __compactRuntime.CircuitContext<PS>,
                           scoreThreshold_0: bigint,
                           incomeThreshold_0: bigint,
                           ageThreshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveEligibility(context: __compactRuntime.CircuitContext<PS>,
                   score_0: bigint,
                   income_0: bigint,
                   age_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  createScholarshipProgram(context: __compactRuntime.CircuitContext<PS>,
                           scoreThreshold_0: bigint,
                           incomeThreshold_0: bigint,
                           ageThreshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveEligibility(context: __compactRuntime.CircuitContext<PS>,
                   score_0: bigint,
                   income_0: bigint,
                   age_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createScholarshipProgram(context: __compactRuntime.CircuitContext<PS>,
                           scoreThreshold_0: bigint,
                           incomeThreshold_0: bigint,
                           ageThreshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveEligibility(context: __compactRuntime.CircuitContext<PS>,
                   score_0: bigint,
                   income_0: bigint,
                   age_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly minScore: bigint;
  readonly maxIncome: bigint;
  readonly minAge: bigint;
  readonly claimCount: bigint;
  readonly programCreated: boolean;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
