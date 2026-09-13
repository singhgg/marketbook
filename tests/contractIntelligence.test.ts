import { describe, it, expect } from 'vitest';
import { EVMDisassembler } from '../src/lib/contracts/evmDisassembler';
import { EVMDecompiler } from '../src/lib/contracts/decompiler';
import { ContractRiskEngine } from '../src/lib/contracts/riskEngine';
import { KNOWN_SELECTORS, identifyStandards } from '../src/lib/contracts/knownSelectors';
import { BytecodeAnalysis, ContractBehavior, ContractPermissions, ProxyDetails, VerifiedSource } from '../src/lib/contracts/types';

describe('Contract Intelligence Engine', () => {
  // 1. Selector and Interface Detection
  describe('Function Selector & Interface Detection', () => {
    it('correctly maps known ERC-20 selectors', () => {
      expect(KNOWN_SELECTORS['0xa9059cbb']?.signature).toBe('transfer(address,uint256)');
      expect(KNOWN_SELECTORS['0x095ea7b3']?.signature).toBe('approve(address,uint256)');
      expect(KNOWN_SELECTORS['0x70a08231']?.signature).toBe('balanceOf(address)');
      expect(KNOWN_SELECTORS['0x18160ddd']?.signature).toBe('totalSupply()');
    });

    it('correctly identifies ERC-20 standard from selectors', () => {
      const selectors = ['0xa9059cbb', '0x70a08231', '0x18160ddd', '0x095ea7b3'];
      const standards = identifyStandards(selectors);
      expect(standards).toContain('ERC-20');
    });

    it('correctly identifies ERC-721 and ERC-165 standards', () => {
      const selectors = ['0x01ffc9a7', '0x6352211e', '0x42842e0e', '0x8da5cb5b'];
      const standards = identifyStandards(selectors);
      expect(standards).toContain('ERC-721');
      expect(standards).toContain('ERC-165');
      expect(standards).toContain('Ownable');
    });

    it('returns empty standards when evidence is insufficient (no guessing)', () => {
      const selectors = ['0x12345678', '0xabcdef01'];
      const standards = identifyStandards(selectors);
      expect(standards).toEqual([]);
    });
  });

  // 2. EVM Disassembly
  describe('EVM Disassembler', () => {
    it('disassembles standard EVM instruction stream', () => {
      // PUSH1 0x80 PUSH1 0x40 MSTORE (typical Solidity preamble: 6080604052)
      const bytecode = '0x6080604052348015600f57600080fd5b50';
      const analysis = EVMDisassembler.disassemble(bytecode);

      expect(analysis.length).toBe(17);
      expect(analysis.rawBytecode).toBe('0x' + bytecode.slice(2));
      expect(analysis.bytecodeHash).toMatch(/^0x[a-f0-9]{64}$/);
      expect(analysis.disassemblySnippet[0].opcode).toBe('PUSH1');
      expect(analysis.disassemblySnippet[0].operand).toBe('0x80');
      expect(analysis.disassemblySnippet[1].opcode).toBe('PUSH1');
      expect(analysis.disassemblySnippet[1].operand).toBe('0x40');
      expect(analysis.disassemblySnippet[2].opcode).toBe('MSTORE');
    });

    it('detects DELEGATECALL (0xf4) in bytecode', () => {
      const bytecode = '0x6080604052f4'; // contains 0xf4
      const analysis = EVMDisassembler.disassemble(bytecode);
      expect(analysis.opcodesSummary.hasDelegateCall).toBe(true);
      expect(analysis.opcodesSummary.hasSelfDestruct).toBe(false);
    });

    it('detects SELFDESTRUCT (0xff) in bytecode', () => {
      const bytecode = '0x6080604052ff'; // contains 0xff
      const analysis = EVMDisassembler.disassemble(bytecode);
      expect(analysis.opcodesSummary.hasSelfDestruct).toBe(true);
    });

    it('detects EIP-1167 Minimal Proxy (Clone) pattern', () => {
      const targetAddress = '43506849d7c04f9138d1a2050bbf3a0c054402dd';
      const eip1167Bytecode = `0x363d3d373d3d3d363d73${targetAddress}5af43d82803e903d91602b57fd5bf3`;
      const detected = EVMDisassembler.detectEIP1167Clone(eip1167Bytecode);
      expect(detected).toBe('0x' + targetAddress);
    });
  });

  // 3. Decompiler & Approximation
  describe('EVM Decompiler Approximation', () => {
    it('prominently includes mandatory approximation disclaimer and does not claim original source', () => {
      const mockBytecode: BytecodeAnalysis = {
        rawBytecode: '0x6080604052',
        bytecodeHash: '0xabcdef123456',
        length: 5,
        detectedSelectors: [
          { selector: '0xa9059cbb', signature: 'transfer(address,uint256)', category: 'ERC20', name: 'transfer' },
        ],
        detectedStandards: ['ERC-20'],
        opcodesSummary: {
          totalInstructions: 3,
          hasDelegateCall: false,
          hasSelfDestruct: false,
          hasCreate2: false,
          hasStaticCall: false,
          sloadCount: 1,
          sstoreCount: 1,
        },
        disassemblySnippet: [],
      };

      const decompiled = EVMDecompiler.decompile(mockBytecode, 'Token');
      expect(decompiled.disclaimer).toContain('This is an approximation of contract logic and is NOT the original source code');
      expect(decompiled.approximateSolidity).toContain('MARKETBOOK CONTRACT INTELLIGENCE — DECOMPILED LOGIC APPROXIMATION');
      expect(decompiled.approximateSolidity).toContain('function transfer(address,uint256) external');
    });
  });

  // 4. Evidence-based Risk Signals Engine
  describe('Contract Risk Engine', () => {
    const mockBytecodeBase: BytecodeAnalysis = {
      rawBytecode: '0x6080604052',
      bytecodeHash: '0x1234',
      length: 100,
      detectedSelectors: [],
      detectedStandards: ['ERC-721'],
      opcodesSummary: {
        totalInstructions: 10,
        hasDelegateCall: false,
        hasSelfDestruct: false,
        hasCreate2: false,
        hasStaticCall: false,
        sloadCount: 2,
        sstoreCount: 2,
      },
      disassemblySnippet: [],
    };

    const mockPermissions: ContractPermissions = {
      owner: '0x71c8413661925191ce4d51f8b89736b69f0ba764',
      admin: 'NOT DETERMINED',
      upgradeAuthority: 'NOT DETERMINED',
      mintAuthority: 'NOT DETERMINED',
      pauseAuthority: 'NOT DETERMINED',
      feeManager: 'NOT DETERMINED',
      royaltyManager: 'NOT DETERMINED',
      evidenceNotes: [],
    };

    const mockBehavior: ContractBehavior = {
      canMint: false,
      canBurn: false,
      canTransfer: true,
      canPause: false,
      canUpgrade: false,
      collectsFees: false,
      hasRoyalties: false,
      hasExternalCalls: false,
      hasSelfDestruct: false,
      evidence: {},
    };

    it('emits SOURCE_VERIFIED signal when source is available', () => {
      const verifiedSource: VerifiedSource = {
        isVerified: true,
        contractName: 'TestNFT',
        compilerVersion: 'v0.8.20',
        files: [{ name: 'TestNFT.sol', content: '// code' }],
      };

      const signals = ContractRiskEngine.evaluate(verifiedSource, mockBytecodeBase, null, mockPermissions, mockBehavior);
      const verifiedSignal = signals.find((s) => s.id === 'SOURCE_VERIFIED');
      expect(verifiedSignal).toBeDefined();
      expect(verifiedSignal?.severity).toBe('INFO');
      expect(verifiedSignal?.whatWeFound).toContain('v0.8.20');
      expect(verifiedSignal?.evidence).toBeDefined();
    });

    it('emits SOURCE_NOT_VERIFIED and warns user when source is unverified', () => {
      const signals = ContractRiskEngine.evaluate(null, mockBytecodeBase, null, mockPermissions, mockBehavior);
      const unverifiedSignal = signals.find((s) => s.id === 'SOURCE_NOT_VERIFIED');
      expect(unverifiedSignal).toBeDefined();
      expect(unverifiedSignal?.severity).toBe('LOW');
      expect(unverifiedSignal?.whyItMatters).toContain('cannot be directly read from high-level Solidity');
    });

    it('flags SELFDESTRUCT opcode with HIGH severity and explicit explanation', () => {
      const dangerousBytecode: BytecodeAnalysis = {
        ...mockBytecodeBase,
        opcodesSummary: {
          ...mockBytecodeBase.opcodesSummary,
          hasSelfDestruct: true,
        },
      };

      const signals = ContractRiskEngine.evaluate(null, dangerousBytecode, null, mockPermissions, mockBehavior);
      const selfDestructSignal = signals.find((s) => s.id === 'SELFDESTRUCT_DETECTED');
      expect(selfDestructSignal).toBeDefined();
      expect(selfDestructSignal?.severity).toBe('HIGH');
      expect(selfDestructSignal?.whatWeFound).toContain('SELFDESTRUCT opcode');
      expect(selfDestructSignal?.whyItMatters).toContain('contract code and state could be erased');
    });

    it('flags UPGRADE_AUTHORITY_DETECTED when proxy is present', () => {
      const proxy: ProxyDetails = {
        isProxy: true,
        proxyType: 'EIP-1967',
        implementationAddress: '0x43506849d7c04f9138d1a2050bbf3a0c054402dd',
        adminAddress: '0x1234567890123456789012345678901234567890',
      };

      const signals = ContractRiskEngine.evaluate(null, mockBytecodeBase, proxy, mockPermissions, mockBehavior);
      const upgradeSignal = signals.find((s) => s.id === 'UPGRADE_AUTHORITY_DETECTED');
      expect(upgradeSignal).toBeDefined();
      expect(upgradeSignal?.severity).toBe('MEDIUM');
      expect(upgradeSignal?.whatWeFound).toContain('0x43506849d7c04f9138d1a2050bbf3a0c054402dd');
    });
  });
});
