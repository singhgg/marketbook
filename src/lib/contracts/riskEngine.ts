import { BytecodeAnalysis, ContractBehavior, ContractPermissions, ProxyDetails, RiskSignal, VerifiedSource } from './types';

export class ContractRiskEngine {
  /**
   * Evaluates evidence-based technical risk signals for a contract.
   * Every signal contains: What We Found, Why It Matters, and Evidence.
   */
  static evaluate(
    verifiedSource: VerifiedSource | null | undefined,
    bytecode: BytecodeAnalysis,
    proxy: ProxyDetails | null | undefined,
    permissions: ContractPermissions,
    behavior: ContractBehavior
  ): RiskSignal[] {
    const signals: RiskSignal[] = [];

    // 1. Source Verification Status
    if (verifiedSource && verifiedSource.isVerified) {
      signals.push({
        id: 'SOURCE_VERIFIED',
        severity: 'INFO',
        title: 'Contract Source Code Verified',
        whatWeFound: `Publicly verified Solidity source code is available (Compiler ${verifiedSource.compilerVersion || 'Unknown'}).`,
        whyItMatters: 'Verified source allows human readability and auditable compilation matching, though verification alone does not guarantee safety.',
        evidence: `Compiler: ${verifiedSource.compilerVersion || 'Standard'}, Optimization: ${verifiedSource.optimizationEnabled ? 'Enabled' : 'Disabled'}`,
      });
    } else {
      signals.push({
        id: 'SOURCE_NOT_VERIFIED',
        severity: 'LOW',
        title: 'Source Code Not Verified',
        whatWeFound: 'The deployed bytecode could not be matched to publicly verified source code on block explorers.',
        whyItMatters: 'Contract logic cannot be directly read from high-level Solidity source files. Analysis must rely on bytecode, opcode signatures, and selector patterns.',
        evidence: `Bytecode length: ${bytecode.length} bytes, SHA-256: ${bytecode.bytecodeHash.slice(0, 18)}...`,
      });
    }

    // 2. Proxy & Upgradeability
    if (proxy && proxy.isProxy) {
      signals.push({
        id: 'UPGRADE_AUTHORITY_DETECTED',
        severity: 'MEDIUM',
        title: 'Upgradeable Proxy Architecture Detected',
        whatWeFound: `Contract operates as an upgradeable proxy (${proxy.proxyType || 'Proxy Pattern'}). Current implementation: ${proxy.implementationAddress || 'Pending detection'}.`,
        whyItMatters: 'An authorized account or multi-sig can update the underlying implementation logic at any time, altering token economics, balances, or permissions.',
        evidence: `Proxy Type: ${proxy.proxyType || 'Unknown'}, Implementation Slot: ${proxy.implementationAddress || 'Detected via storage'}`,
      });
    } else if (behavior.canUpgrade) {
      signals.push({
        id: 'UPGRADE_SELECTORS_DETECTED',
        severity: 'MEDIUM',
        title: 'Upgrade Functions Detected in Bytecode',
        whatWeFound: 'Contract bytecode contains upgrade function selectors (e.g. upgradeTo / upgradeToAndCall).',
        whyItMatters: 'The contract logic appears designed to be replaceable after deployment by privileged accounts.',
        evidence: behavior.evidence.upgradeEvidence || 'Selector 0x3659cfe6 or 0x4f1ef286 present in bytecode dispatch table',
      });
    }

    // 3. Delegatecall Opcode
    if (bytecode.opcodesSummary.hasDelegateCall) {
      signals.push({
        id: 'EXTERNAL_DELEGATECALL_DETECTED',
        severity: 'MEDIUM',
        title: 'Delegatecall Opcode Present',
        whatWeFound: 'The contract bytecode contains the DELEGATECALL instruction (0xf4).',
        whyItMatters: 'DELEGATECALL executes external code within the context and storage of this contract. While standard in proxies, an untrusted delegatecall target can modify contract storage or drain balances.',
        evidence: 'Opcode 0xf4 (DELEGATECALL) found in runtime bytecode instruction stream',
      });
    }

    // 4. Self-destruct Opcode
    if (bytecode.opcodesSummary.hasSelfDestruct) {
      signals.push({
        id: 'SELFDESTRUCT_DETECTED',
        severity: 'HIGH',
        title: 'Self-Destruct Instruction Detected',
        whatWeFound: 'The contract bytecode contains the SELFDESTRUCT opcode (0xff).',
        whyItMatters: 'If triggered by a compromised or malicious owner, the contract code and state could be erased from the blockchain, rendering tokens or funds inaccessible.',
        evidence: 'Opcode 0xff (SELFDESTRUCT) identified in runtime bytecode',
      });
    }

    // 5. Privileged Owner / Admin Powers
    if (permissions.owner !== 'NOT DETERMINED') {
      signals.push({
        id: 'PRIVILEGED_OWNER_DETECTED',
        severity: 'LOW',
        title: 'Privileged Owner Account Active',
        whatWeFound: `Contract has an active owner address: ${permissions.owner}.`,
        whyItMatters: 'Privileged owner accounts can execute restricted administrative functions. If the private key is compromised or centralized, the contract can be modified.',
        evidence: `owner() returned: ${permissions.owner}`,
      });
    }

    // 6. Pause Mechanism
    if (behavior.canPause) {
      signals.push({
        id: 'PAUSE_CONTROL_DETECTED',
        severity: 'LOW',
        title: 'Pause Control Mechanism Detected',
        whatWeFound: 'Contract includes pause/unpause functions or a Pausable interface.',
        whyItMatters: 'A privileged controller can freeze user transfers, trading, or contract interactions during emergency or arbitrary periods.',
        evidence: behavior.evidence.pauseEvidence || 'Selector 0x8456cb59 (pause) / 0x5c975abb (paused) found in bytecode',
      });
    }

    // 7. Minting Mechanism
    if (behavior.canMint) {
      signals.push({
        id: 'MINT_FUNCTION_DETECTED',
        severity: 'INFO',
        title: 'Supply Expansion / Mint Function Detected',
        whatWeFound: 'Contract contains token creation or minting function selectors.',
        whyItMatters: 'Authorized accounts can expand total token supply. For financial tokens, unconstrained minting can dilute existing holders.',
        evidence: behavior.evidence.mintEvidence || 'Mint selector identified in selector analysis',
      });
    }

    // 8. Fee or Royalty Configurations
    if (behavior.collectsFees || behavior.hasRoyalties) {
      signals.push({
        id: 'FEE_OR_ROYALTY_CONFIGURATION',
        severity: 'INFO',
        title: 'Fee or Royalty Management Detected',
        whatWeFound: 'Contract includes fee configuration or ERC-2981 royalty management functions.',
        whyItMatters: 'Fees or royalty basis points can be updated by the fee manager or contract owner.',
        evidence: behavior.evidence.feeEvidence || behavior.evidence.royaltyEvidence || 'Fee / Royalty selectors present',
      });
    }

    // 9. Standard Interface Conformance (Positive)
    if (bytecode.detectedStandards.length > 0) {
      signals.push({
        id: 'STANDARD_INTERFACE_DETECTED',
        severity: 'INFO',
        title: `Standard Interface Conformance: ${bytecode.detectedStandards.join(', ')}`,
        whatWeFound: `Contract implements standard public interfaces: ${bytecode.detectedStandards.join(', ')}.`,
        whyItMatters: 'Standard interfaces facilitate interoperability with wallets, market terminals, indexers, and decentralized protocols.',
        evidence: `Selectors match ${bytecode.detectedStandards.join(' and ')} specifications`,
      });
    }

    // Sort signals: HIGH -> MEDIUM -> LOW -> INFO
    const order: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, INFO: 3 };
    return signals.sort((a, b) => order[a.severity] - order[b.severity]);
  }
}
