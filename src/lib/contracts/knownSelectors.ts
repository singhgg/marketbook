export interface SelectorMeta {
  signature: string;
  category: 'ERC20' | 'ERC721' | 'ERC1155' | 'ERC165' | 'ERC2981' | 'OWNABLE' | 'ACCESS_CONTROL' | 'PAUSABLE' | 'UPGRADEABLE' | 'FEE' | 'SECURITY' | 'GENERAL';
  name: string;
}

export const KNOWN_SELECTORS: Record<string, SelectorMeta> = {
  // ERC-165
  '0x01ffc9a7': { signature: 'supportsInterface(bytes4)', category: 'ERC165', name: 'supportsInterface' },

  // ERC-20
  '0xa9059cbb': { signature: 'transfer(address,uint256)', category: 'ERC20', name: 'transfer' },
  '0x095ea7b3': { signature: 'approve(address,uint256)', category: 'ERC20', name: 'approve' },
  '0x23b872dd': { signature: 'transferFrom(address,address,uint256)', category: 'ERC20', name: 'transferFrom' },
  '0x70a08231': { signature: 'balanceOf(address)', category: 'ERC20', name: 'balanceOf' },
  '0x18160ddd': { signature: 'totalSupply()', category: 'ERC20', name: 'totalSupply' },
  '0xdd62ed3e': { signature: 'allowance(address,address)', category: 'ERC20', name: 'allowance' },
  '0x06fdde03': { signature: 'name()', category: 'ERC20', name: 'name' },
  '0x95d89b41': { signature: 'symbol()', category: 'ERC20', name: 'symbol' },
  '0x313ce567': { signature: 'decimals()', category: 'ERC20', name: 'decimals' },

  // ERC-721
  '0x6352211e': { signature: 'ownerOf(uint256)', category: 'ERC721', name: 'ownerOf' },
  '0x42842e0e': { signature: 'safeTransferFrom(address,address,uint256)', category: 'ERC721', name: 'safeTransferFrom' },
  '0xb88d4fde': { signature: 'safeTransferFrom(address,address,uint256,bytes)', category: 'ERC721', name: 'safeTransferFrom' },
  '0x081812fc': { signature: 'getApproved(uint256)', category: 'ERC721', name: 'getApproved' },
  '0xe985e9c5': { signature: 'isApprovedForAll(address,address)', category: 'ERC721', name: 'isApprovedForAll' },
  '0xa22cb465': { signature: 'setApprovalForAll(address,bool)', category: 'ERC721', name: 'setApprovalForAll' },
  '0xc87b56dd': { signature: 'tokenURI(uint256)', category: 'ERC721', name: 'tokenURI' },

  // ERC-1155
  '0xf242432a': { signature: 'safeTransferFrom(address,address,uint256,uint256,bytes)', category: 'ERC1155', name: 'safeTransferFrom' },
  '0x2eb2c2d6': { signature: 'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)', category: 'ERC1155', name: 'safeBatchTransferFrom' },
  '0x00fdd58e': { signature: 'balanceOf(address,uint256)', category: 'ERC1155', name: 'balanceOf' },
  '0x4e1273f4': { signature: 'balanceOfBatch(address[],uint256[])', category: 'ERC1155', name: 'balanceOfBatch' },
  '0x0e89341c': { signature: 'uri(uint256)', category: 'ERC1155', name: 'uri' },

  // ERC-2981 Royalty
  '0x2a55205a': { signature: 'royaltyInfo(uint256,uint256)', category: 'ERC2981', name: 'royaltyInfo' },

  // Ownable
  '0x8da5cb5b': { signature: 'owner()', category: 'OWNABLE', name: 'owner' },
  '0xf2fde38b': { signature: 'transferOwnership(address)', category: 'OWNABLE', name: 'transferOwnership' },
  '0x715018a6': { signature: 'renounceOwnership()', category: 'OWNABLE', name: 'renounceOwnership' },
  '0x893d20e8': { signature: 'getOwner()', category: 'OWNABLE', name: 'getOwner' },

  // AccessControl
  '0x91d14854': { signature: 'hasRole(bytes32,address)', category: 'ACCESS_CONTROL', name: 'hasRole' },
  '0x248a9ae0': { signature: 'getRoleAdmin(bytes32)', category: 'ACCESS_CONTROL', name: 'getRoleAdmin' },
  '0x2f2ff15d': { signature: 'grantRole(bytes32,address)', category: 'ACCESS_CONTROL', name: 'grantRole' },
  '0xd547741f': { signature: 'revokeRole(bytes32,address)', category: 'ACCESS_CONTROL', name: 'revokeRole' },
  '0x36568abe': { signature: 'renounceRole(bytes32,address)', category: 'ACCESS_CONTROL', name: 'renounceRole' },

  // Pausable
  '0x8456cb59': { signature: 'pause()', category: 'PAUSABLE', name: 'pause' },
  '0x3f4ba83a': { signature: 'unpause()', category: 'PAUSABLE', name: 'unpause' },
  '0x5c975abb': { signature: 'paused()', category: 'PAUSABLE', name: 'paused' },

  // Upgradeable / Proxy
  '0x3659cfe6': { signature: 'upgradeTo(address)', category: 'UPGRADEABLE', name: 'upgradeTo' },
  '0x4f1ef286': { signature: 'upgradeToAndCall(address,bytes)', category: 'UPGRADEABLE', name: 'upgradeToAndCall' },
  '0x5c60da1b': { signature: 'implementation()', category: 'UPGRADEABLE', name: 'implementation' },
  '0xf851a440': { signature: 'admin()', category: 'UPGRADEABLE', name: 'admin' },
  '0x8f283970': { signature: 'changeAdmin(address)', category: 'UPGRADEABLE', name: 'changeAdmin' },
  '0x521eb273': { signature: 'proxiableUUID()', category: 'UPGRADEABLE', name: 'proxiableUUID' },

  // Minting & Burning
  '0x40c10f19': { signature: 'mint(address,uint256)', category: 'SECURITY', name: 'mint' },
  '0x1249c58b': { signature: 'mint()', category: 'SECURITY', name: 'mint' },
  '0xa0712d68': { signature: 'mint(uint256)', category: 'SECURITY', name: 'mint' },
  '0xd6a43920': { signature: 'safeMint(address)', category: 'SECURITY', name: 'safeMint' },
  '0x7292bb03': { signature: 'safeMint(address,uint256)', category: 'SECURITY', name: 'safeMint' },
  '0x42966c68': { signature: 'burn(uint256)', category: 'SECURITY', name: 'burn' },
  '0x79cc6790': { signature: 'burnFrom(address,uint256)', category: 'SECURITY', name: 'burnFrom' },

  // Fees & Royalties
  '0x69420000': { signature: 'setFee(uint256)', category: 'FEE', name: 'setFee' },
  '0xb35a9686': { signature: 'setRoyalty(uint256)', category: 'FEE', name: 'setRoyalty' },
  '0x8797b5d1': { signature: 'setDefaultRoyalty(address,uint96)', category: 'FEE', name: 'setDefaultRoyalty' },
  '0x203b57f0': { signature: 'feeBps()', category: 'FEE', name: 'feeBps' },

  // Critical Admin Operations
  '0x3ccfd60b': { signature: 'withdraw()', category: 'SECURITY', name: 'withdraw' },
  '0x5fd8c710': { signature: 'withdraw(uint256)', category: 'SECURITY', name: 'withdraw' },
  '0x853828b6': { signature: 'withdrawAll()', category: 'SECURITY', name: 'withdrawAll' },
  '0xe4e19572': { signature: 'emergencyWithdraw()', category: 'SECURITY', name: 'emergencyWithdraw' },
  '0xd28d8852': { signature: 'blacklist(address)', category: 'SECURITY', name: 'blacklist' },
  '0x6c6e3b2e': { signature: 'freeze(address)', category: 'SECURITY', name: 'freeze' },
};

/**
 * Identify standards based on detected function selectors
 */
export function identifyStandards(selectors: string[]): string[] {
  const set = new Set(selectors.map(s => s.toLowerCase()));
  const standards: string[] = [];

  // ERC-165
  if (set.has('0x01ffc9a7')) {
    standards.push('ERC-165');
  }

  // ERC-20: transfer, approve, balanceOf, totalSupply
  if (set.has('0xa9059cbb') && set.has('0x70a08231') && set.has('0x18160ddd')) {
    standards.push('ERC-20');
  }

  // ERC-721: ownerOf, safeTransferFrom, setApprovalForAll
  if (set.has('0x6352211e') && (set.has('0x42842e0e') || set.has('0xb88d4fde'))) {
    standards.push('ERC-721');
  }

  // ERC-1155: safeTransferFrom(5 args), balanceOf(2 args)
  if (set.has('0xf242432a') && set.has('0x00fdd58e')) {
    standards.push('ERC-1155');
  }

  // ERC-2981: royaltyInfo
  if (set.has('0x2a55205a')) {
    standards.push('ERC-2981');
  }

  // Ownable: owner() + transferOwnership()
  if (set.has('0x8da5cb5b') || set.has('0xf2fde38b')) {
    standards.push('Ownable');
  }

  // AccessControl: hasRole + grantRole
  if (set.has('0x91d14854') && set.has('0x2f2ff15d')) {
    standards.push('AccessControl');
  }

  // Pausable: pause / unpause / paused
  if (set.has('0x8456cb59') || set.has('0x3f4ba83a') || set.has('0x5c975abb')) {
    standards.push('Pausable');
  }

  // Upgradeable: upgradeTo / upgradeToAndCall
  if (set.has('0x3659cfe6') || set.has('0x4f1ef286')) {
    standards.push('Upgradeable');
  }

  return standards;
}
