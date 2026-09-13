export type ContractChain = 'ethereum' | 'base' | 'arbitrum' | 'optimism' | 'polygon' | 'bsc';

export type RiskSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface ContractOverview {
  address: string;
  chain: ContractChain;
  name: string;
  deployerAddress?: string | null;
  ownerAddress?: string | null;
  deploymentBlock?: number | null;
  deploymentTime?: string | null;
  sizeBytes: number;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED';
  isProxy: boolean;
  proxyType?: string | null;
  implementationAddress?: string | null;
  adminAddress?: string | null;
  sourceMatch: boolean;
}

export interface VerifiedSourceFile {
  name: string;
  content: string;
}

export interface VerifiedSource {
  isVerified: boolean;
  contractName: string;
  compilerVersion?: string | null;
  optimizationEnabled?: boolean | null;
  optimizationRuns?: number | null;
  licenseType?: string | null;
  files: VerifiedSourceFile[];
  abi?: any[] | null;
  sourceMatchNote?: string | null;
}

export interface DetectedSelector {
  selector: string;
  signature?: string;
  category?: string;
  name?: string;
}

export interface BytecodeAnalysis {
  rawBytecode: string;
  bytecodeHash: string;
  length: number;
  creationBytecode?: string | null;
  detectedSelectors: DetectedSelector[];
  detectedStandards: string[];
  opcodesSummary: {
    totalInstructions: number;
    hasDelegateCall: boolean;
    hasSelfDestruct: boolean;
    hasCreate2: boolean;
    hasStaticCall: boolean;
    sloadCount: number;
    sstoreCount: number;
  };
  disassemblySnippet: { pc: number; opcode: string; operand?: string }[];
}

export interface DecompiledLogic {
  disclaimer: string;
  approximateSolidity: string;
  detectedFunctions: {
    selector: string;
    signature: string;
    pseudoCode: string;
    readsStorage: boolean;
    writesStorage: boolean;
    makesExternalCalls: boolean;
  }[];
}

export interface ProxyDetails {
  isProxy: boolean;
  proxyType?: 'EIP-1967' | 'EIP-1167' | 'Transparent' | 'UUPS' | 'Beacon' | 'Custom' | null;
  implementationAddress?: string | null;
  adminAddress?: string | null;
  beaconAddress?: string | null;
  implementationVerified?: boolean | null;
}

export interface ContractPermissions {
  owner: string; // Real address or "NOT DETERMINED"
  admin: string; // Real address or "NOT DETERMINED"
  upgradeAuthority: string; // Real address or "NOT DETERMINED"
  mintAuthority: string; // Real address or "NOT DETERMINED"
  pauseAuthority: string; // Real address or "NOT DETERMINED"
  feeManager: string; // Real address or "NOT DETERMINED"
  royaltyManager: string; // Real address or "NOT DETERMINED"
  evidenceNotes: string[];
}

export interface ContractBehavior {
  canMint: boolean;
  canBurn: boolean;
  canTransfer: boolean;
  canPause: boolean;
  canUpgrade: boolean;
  collectsFees: boolean;
  hasRoyalties: boolean;
  hasExternalCalls: boolean;
  hasSelfDestruct: boolean;
  evidence: {
    mintEvidence?: string | null;
    burnEvidence?: string | null;
    pauseEvidence?: string | null;
    upgradeEvidence?: string | null;
    feeEvidence?: string | null;
    royaltyEvidence?: string | null;
    callEvidence?: string | null;
  };
}

export interface RiskSignal {
  id: string;
  severity: RiskSeverity;
  title: string;
  whatWeFound: string;
  whyItMatters: string;
  evidence: string;
}

export interface ContractTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  method?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface ContractInteraction {
  address: string;
  name?: string;
  relationship: string;
  isVerified?: boolean;
  network: string;
}

export interface ContractAnalysisResult {
  overview: ContractOverview;
  verifiedSource?: VerifiedSource | null;
  bytecode: BytecodeAnalysis;
  decompiled: DecompiledLogic;
  proxy?: ProxyDetails | null;
  permissions: ContractPermissions;
  behavior: ContractBehavior;
  riskSignals: RiskSignal[];
  interactions: ContractInteraction[];
  recentActivity: ContractTransaction[];
  meta: {
    analyzedAt: string;
    dataSource: string;
    latestBlockIndexed?: number | null;
  };
}
