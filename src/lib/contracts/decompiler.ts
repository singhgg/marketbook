import { BytecodeAnalysis, DecompiledLogic } from './types';
import { KNOWN_SELECTORS } from './knownSelectors';

export class EVMDecompiler {
  /**
   * Generates a truthful, technical decompilation approximation from analyzed bytecode.
   * Prominently communicates that this is an EVM reconstructed approximation, not verified source.
   */
  static decompile(bytecodeAnalysis: BytecodeAnalysis, contractName = 'DecompiledContract'): DecompiledLogic {
    const disclaimer =
      'Decompiled from deployed bytecode. This is an approximation of contract logic and is NOT the original source code.';

    const { detectedSelectors, opcodesSummary, detectedStandards } = bytecodeAnalysis;

    const decompiledFunctions = detectedSelectors.map((sel) => {
      const known = KNOWN_SELECTORS[sel.selector];
      const sig = known ? known.signature : `unknown_${sel.selector.slice(2)}()`;
      const fnName = known ? known.name : `unknown_${sel.selector.slice(2)}`;

      // Infer behavior from known selector or bytecode patterns
      const readsStorage = opcodesSummary.sloadCount > 0;
      const writesStorage = opcodesSummary.sstoreCount > 0 && (
        fnName.includes('set') ||
        fnName.includes('transfer') ||
        fnName.includes('mint') ||
        fnName.includes('burn') ||
        fnName.includes('pause') ||
        fnName.includes('upgrade')
      );
      const makesExternalCalls = opcodesSummary.hasDelegateCall || opcodesSummary.hasStaticCall;

      let body = '';
      if (fnName === 'owner' || fnName === 'getOwner') {
        body = `        // Reads owner state variable\n        return _ownerAddress;`;
      } else if (fnName === 'transfer' || fnName === 'transferFrom') {
        body = `        // ERC-20/721 transfer operation\n        // Validates recipient != address(0)\n        // Updates balance/ownership mapping in storage\n        // Emits Transfer event\n        return true;`;
      } else if (fnName === 'balanceOf') {
        body = `        // Reads balance mapping for account\n        return _balances[account];`;
      } else if (fnName === 'upgradeTo' || fnName === 'upgradeToAndCall') {
        body = `        // PRIVILEGED: Requires admin authorization\n        // Modifies implementation address in proxy storage\n        _setImplementation(newImplementation);`;
      } else if (fnName === 'pause' || fnName === 'unpause') {
        body = `        // PRIVILEGED: Requires pauser role\n        // Flips contract paused state variable\n        _paused = (${fnName === 'pause'});`;
      } else if (fnName === 'mint' || fnName === 'safeMint') {
        body = `        // Supply expansion: creates new tokens\n        // Updates total supply and recipient balance\n        // Emits Mint/Transfer event`;
      } else if (fnName === 'burn' || fnName === 'burnFrom') {
        body = `        // Supply contraction: destroys tokens\n        // Decreases total supply and holder balance\n        // Emits Transfer(holder, address(0), value)`;
      } else if (fnName === 'supportsInterface') {
        body = `        // ERC-165 interface identifier check\n        return interfaceId == 0x01ffc9a7 || super.supportsInterface(interfaceId);`;
      } else if (fnName === 'royaltyInfo') {
        body = `        // ERC-2981 royalty specification\n        // Returns (receiverAddress, royaltyAmount)`;
      } else {
        body = `        // Function Dispatcher: Selector ${sel.selector}\n        // Storage access: ${readsStorage ? 'SLOAD detected' : 'none'}, ${writesStorage ? 'SSTORE detected' : 'none'}\n        // Dispatched at EVM runtime`;
      }

      const pseudoCode = `    function ${sig} external {\n${body}\n    }`;

      return {
        selector: sel.selector,
        signature: sig,
        pseudoCode,
        readsStorage,
        writesStorage,
        makesExternalCalls,
      };
    });

    // Build overall approximate Solidity representation
    const lines: string[] = [
      `// ============================================================================`,
      `// MARKETBOOK CONTRACT INTELLIGENCE — DECOMPILED LOGIC APPROXIMATION`,
      `// ============================================================================`,
      `// NOTICE:`,
      `// ${disclaimer}`,
      `// Analysis derived from EVM runtime bytecode (${bytecodeAnalysis.length} bytes).`,
      `// Bytecode SHA-256: ${bytecodeAnalysis.bytecodeHash}`,
      `// ============================================================================`,
      ``,
      `// Detected Standard Interfaces: ${detectedStandards.length > 0 ? detectedStandards.join(', ') : 'Custom / Unclassified'}`,
      `// Security Characteristics:`,
      `// - DELEGATECALL Opcode: ${opcodesSummary.hasDelegateCall ? 'DETECTED (0xf4)' : 'Not detected'}`,
      `// - SELFDESTRUCT Opcode: ${opcodesSummary.hasSelfDestruct ? 'DETECTED (0xff)' : 'Not detected'}`,
      `// - Storage Reads (SLOAD): ${opcodesSummary.sloadCount} instructions`,
      `// - Storage Writes (SSTORE): ${opcodesSummary.sstoreCount} instructions`,
      ``,
      `interface I${contractName}Decompiled {`,
    ];

    for (const fn of decompiledFunctions) {
      lines.push(fn.pseudoCode);
      lines.push(``);
    }

    lines.push(`}`);
    lines.push(``);
    lines.push(`// End of reconstructed bytecode control flow`);

    return {
      disclaimer,
      approximateSolidity: lines.join('\n'),
      detectedFunctions: decompiledFunctions,
    };
  }
}
