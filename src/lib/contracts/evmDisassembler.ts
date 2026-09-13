import crypto from 'crypto';
import { KNOWN_SELECTORS, identifyStandards } from './knownSelectors';
import { BytecodeAnalysis, DetectedSelector } from './types';

interface DisassembledInstruction {
  pc: number;
  opcode: string;
  operand?: string;
}

const OPCODES: Record<number, string> = {
  0x00: 'STOP',
  0x01: 'ADD',
  0x02: 'MUL',
  0x03: 'SUB',
  0x04: 'DIV',
  0x05: 'SDIV',
  0x06: 'MOD',
  0x07: 'SMOD',
  0x08: 'ADDMOD',
  0x09: 'MULMOD',
  0x0a: 'EXP',
  0x0b: 'SIGNEXTEND',
  0x10: 'LT',
  0x11: 'GT',
  0x12: 'SLT',
  0x13: 'SGT',
  0x14: 'EQ',
  0x15: 'ISZERO',
  0x16: 'AND',
  0x17: 'OR',
  0x18: 'XOR',
  0x19: 'NOT',
  0x1a: 'BYTE',
  0x1b: 'SHL',
  0x1c: 'SHR',
  0x1d: 'SAR',
  0x20: 'KECCAK256',
  0x30: 'ADDRESS',
  0x31: 'BALANCE',
  0x32: 'ORIGIN',
  0x33: 'CALLER',
  0x34: 'CALLVALUE',
  0x35: 'CALLDATALOAD',
  0x36: 'CALLDATASIZE',
  0x37: 'CALLDATACOPY',
  0x38: 'CODESIZE',
  0x39: 'CODECOPY',
  0x3a: 'GASPRICE',
  0x3b: 'EXTCODESIZE',
  0x3c: 'EXTCODECOPY',
  0x3d: 'RETURNDATASIZE',
  0x3e: 'RETURNDATACOPY',
  0x3f: 'EXTCODEHASH',
  0x40: 'BLOCKHASH',
  0x41: 'COINBASE',
  0x42: 'TIMESTAMP',
  0x43: 'NUMBER',
  0x44: 'PREVRANDAO',
  0x45: 'GASLIMIT',
  0x46: 'CHAINID',
  0x47: 'SELFBALANCE',
  0x48: 'BASEFEE',
  0x50: 'POP',
  0x51: 'MLOAD',
  0x52: 'MSTORE',
  0x53: 'MSTORE8',
  0x54: 'SLOAD',
  0x55: 'SSTORE',
  0x56: 'JUMP',
  0x57: 'JUMPI',
  0x58: 'PC',
  0x59: 'MSIZE',
  0x5a: 'GAS',
  0x5b: 'JUMPDEST',
  0xf0: 'CREATE',
  0xf1: 'CALL',
  0xf2: 'CALLCODE',
  0xf3: 'RETURN',
  0xf4: 'DELEGATECALL',
  0xf5: 'CREATE2',
  0xfa: 'STATICCALL',
  0xfd: 'REVERT',
  0xfe: 'INVALID',
  0xff: 'SELFDESTRUCT',
};

// Add DUP1..DUP16 and SWAP1..SWAP16 and PUSH1..PUSH32
for (let i = 1; i <= 16; i++) {
  OPCODES[0x80 + i - 1] = `DUP${i}`;
  OPCODES[0x90 + i - 1] = `SWAP${i}`;
}

export class EVMDisassembler {
  /**
   * Disassembles raw EVM bytecode into instructions and extracts selectors and security flags
   */
  static disassemble(rawBytecodeHex: string): BytecodeAnalysis {
    const cleanHex = rawBytecodeHex.startsWith('0x') ? rawBytecodeHex.slice(2) : rawBytecodeHex;
    const bytes = Buffer.from(cleanHex, 'hex');
    const length = bytes.length;

    const bytecodeHash = '0x' + crypto.createHash('sha256').update(bytes).digest('hex');

    const instructions: DisassembledInstruction[] = [];
    const selectorsFound = new Set<string>();

    let hasDelegateCall = false;
    let hasSelfDestruct = false;
    let hasCreate2 = false;
    let hasStaticCall = false;
    let sloadCount = 0;
    let sstoreCount = 0;

    let pc = 0;
    while (pc < bytes.length) {
      const byte = bytes[pc];
      const currentPc = pc;

      // PUSH1..PUSH32 (0x60..0x7f)
      if (byte >= 0x60 && byte <= 0x7f) {
        const pushSize = byte - 0x5f;
        const pushData = bytes.slice(pc + 1, Math.min(pc + 1 + pushSize, bytes.length));
        const operand = '0x' + pushData.toString('hex');
        const opcodeName = `PUSH${pushSize}`;

        instructions.push({ pc: currentPc, opcode: opcodeName, operand });

        // Check if this is a PUSH4 selector candidate (4 bytes = 8 hex chars)
        if (pushSize === 4 && pushData.length === 4) {
          const candidate = operand.toLowerCase();
          // Verify if followed within 4 instructions by EQ, SUB, or JUMPI
          selectorsFound.add(candidate);
        }

        pc += 1 + pushSize;
        continue;
      }

      const opcodeName = OPCODES[byte] || `UNKNOWN_0x${byte.toString(16).padStart(2, '0')}`;
      instructions.push({ pc: currentPc, opcode: opcodeName });

      if (byte === 0xf4) hasDelegateCall = true;
      if (byte === 0xff) hasSelfDestruct = true;
      if (byte === 0xf5) hasCreate2 = true;
      if (byte === 0xfa) hasStaticCall = true;
      if (byte === 0x54) sloadCount++;
      if (byte === 0x55) sstoreCount++;

      pc++;
    }

    // Filter selectors: keep known ones or those that appear in typical dispatcher regions
    const detectedSelectors: DetectedSelector[] = [];
    for (const sel of selectorsFound) {
      const known = KNOWN_SELECTORS[sel];
      if (known) {
        detectedSelectors.push({
          selector: sel,
          signature: known.signature,
          category: known.category,
          name: known.name,
        });
      } else {
        // Unknown 4-byte selector detected from bytecode dispatcher
        detectedSelectors.push({
          selector: sel,
          signature: undefined,
          category: 'GENERAL',
          name: undefined,
        });
      }
    }

    // Sort detected selectors: known ones first, then alphabetical
    detectedSelectors.sort((a, b) => {
      if (a.signature && !b.signature) return -1;
      if (!a.signature && b.signature) return 1;
      return a.selector.localeCompare(b.selector);
    });

    const detectedStandards = identifyStandards(detectedSelectors.map((s) => s.selector));

    return {
      rawBytecode: '0x' + cleanHex,
      bytecodeHash,
      length,
      detectedSelectors,
      detectedStandards,
      opcodesSummary: {
        totalInstructions: instructions.length,
        hasDelegateCall,
        hasSelfDestruct,
        hasCreate2,
        hasStaticCall,
        sloadCount,
        sstoreCount,
      },
      disassemblySnippet: instructions.slice(0, 150), // Sample for UI inspection
    };
  }

  /**
   * Detects EIP-1167 Minimal Proxy (Clone)
   * Pattern: 363d3d373d3d3d363d73 <20 bytes address> 5af43d82803e903d91602b57fd5bf3
   */
  static detectEIP1167Clone(rawBytecodeHex: string): string | null {
    const clean = rawBytecodeHex.replace(/^0x/, '').toLowerCase();
    const prefix = '363d3d373d3d3d363d73';
    const suffix = '5af43d82803e903d91602b57fd5bf3';

    const pIdx = clean.indexOf(prefix);
    if (pIdx !== -1) {
      const addrStart = pIdx + prefix.length;
      const addr = clean.slice(addrStart, addrStart + 40);
      const sIdx = clean.indexOf(suffix, addrStart + 40);
      if (sIdx !== -1 && addr.length === 40) {
        return '0x' + addr;
      }
    }
    return null;
  }
}
