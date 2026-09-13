// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketBookNFT
 * @notice ERC-721 Digital Asset with ERC-2981 royalty support for MarketBook platform.
 */
contract MarketBookNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _nextTokenId;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed recipient,
        string tokenURI,
        uint96 royaltyBps
    );

    constructor() ERC721("MarketBook Asset", "MBK") Ownable(msg.sender) {
        // Default royalty: 2.5% (250 basis points) to deployer
        _setDefaultRoyalty(msg.sender, 250);
    }

    /**
     * @notice Mint an NFT with metadata URI and optional custom royalty percentage.
     * @param recipient The wallet address receiving the token
     * @param tokenURI The IPFS or HTTP metadata URI
     * @param royaltyBps Basis points for royalty (e.g., 250 = 2.5%)
     */
    function mint(
        address recipient,
        string memory tokenURI,
        uint96 royaltyBps
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(royaltyBps <= 1000, "Royalty cannot exceed 10%");

        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        if (royaltyBps > 0) {
            _setTokenRoyalty(tokenId, msg.sender, royaltyBps);
        }

        emit NFTMinted(tokenId, msg.sender, recipient, tokenURI, royaltyBps);
        return tokenId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
