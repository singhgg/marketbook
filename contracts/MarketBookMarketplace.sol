// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketBookMarketplace
 * @notice Cross-market digital asset marketplace supporting atomic listings, offers, fee distribution, and royalties.
 */
contract MarketBookMarketplace is ReentrancyGuard, Ownable {
    uint256 public platformFeeBps = 100; // 1.00%
    address payable public feeRecipient;

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    struct Offer {
        address bidder;
        address nftContract;
        uint256 tokenId;
        uint256 amount;
        bool active;
    }

    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // nftContract => tokenId => bidder => Offer
    mapping(address => mapping(uint256 => mapping(address => Offer))) public offers;

    event ItemListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    event ItemSold(address indexed nftContract, uint256 indexed tokenId, address seller, address indexed buyer, uint256 price);
    event OfferCreated(address indexed nftContract, uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event OfferCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed bidder);
    event OfferAccepted(address indexed nftContract, uint256 indexed tokenId, address seller, address indexed bidder, uint256 amount);
    event PlatformFeeUpdated(uint256 newFeeBps);

    constructor() Ownable(msg.sender) {
        feeRecipient = payable(msg.sender);
    }

    function setPlatformFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 500, "Fee cannot exceed 5%");
        platformFeeBps = _feeBps;
        emit PlatformFeeUpdated(_feeBps);
    }

    function setFeeRecipient(address payable _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid recipient");
        feeRecipient = _recipient;
    }

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        IERC721 token = IERC721(nftContract);
        require(token.ownerOf(tokenId) == msg.sender, "Caller does not own token");
        require(
            token.isApprovedForAll(msg.sender, address(this)) || token.getApproved(tokenId) == address(this),
            "Marketplace not approved to transfer token"
        );

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });

        emit ItemListed(nftContract, tokenId, msg.sender, price);
    }

    function cancelListing(address nftContract, uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "Only seller can cancel listing");

        listing.active = false;
        emit ListingCancelled(nftContract, tokenId, msg.sender);
    }

    function buyNFT(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Listing is not active");
        require(msg.value >= listing.price, "Insufficient payment sent");

        listing.active = false;
        address seller = listing.seller;
        uint256 salePrice = listing.price;

        _payoutAndTransfer(nftContract, tokenId, seller, msg.sender, salePrice);

        // Refund any excess
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }

        emit ItemSold(nftContract, tokenId, seller, msg.sender, salePrice);
    }

    function makeOffer(address nftContract, uint256 tokenId) external payable nonReentrant {
        require(msg.value > 0, "Offer amount must be greater than zero");
        
        Offer storage existingOffer = offers[nftContract][tokenId][msg.sender];
        if (existingOffer.active) {
            // Refund existing offer first
            payable(msg.sender).transfer(existingOffer.amount);
        }

        offers[nftContract][tokenId][msg.sender] = Offer({
            bidder: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: msg.value,
            active: true
        });

        emit OfferCreated(nftContract, tokenId, msg.sender, msg.value);
    }

    function cancelOffer(address nftContract, uint256 tokenId) external nonReentrant {
        Offer storage offer = offers[nftContract][tokenId][msg.sender];
        require(offer.active, "Offer is not active");

        uint256 refundAmount = offer.amount;
        offer.active = false;

        payable(msg.sender).transfer(refundAmount);
        emit OfferCancelled(nftContract, tokenId, msg.sender);
    }

    function acceptOffer(address nftContract, uint256 tokenId, address bidder) external nonReentrant {
        IERC721 token = IERC721(nftContract);
        require(token.ownerOf(tokenId) == msg.sender, "Only owner can accept offer");

        Offer storage offer = offers[nftContract][tokenId][bidder];
        require(offer.active, "Offer is not active");

        uint256 amount = offer.amount;
        offer.active = false;

        // Deactivate active listing if any
        if (listings[nftContract][tokenId].active) {
            listings[nftContract][tokenId].active = false;
        }

        _payoutAndTransfer(nftContract, tokenId, msg.sender, bidder, amount);

        emit OfferAccepted(nftContract, tokenId, msg.sender, bidder, amount);
    }

    function _payoutAndTransfer(
        address nftContract,
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 totalAmount
    ) internal {
        uint256 remainingAmount = totalAmount;

        // Platform fee
        uint256 platformFee = (totalAmount * platformFeeBps) / 10000;
        if (platformFee > 0) {
            feeRecipient.transfer(platformFee);
            remainingAmount -= platformFee;
        }

        // ERC-2981 Royalties support
        try IERC2981(nftContract).royaltyInfo(tokenId, totalAmount) returns (address royaltyReceiver, uint256 royaltyAmount) {
            if (royaltyReceiver != address(0) && royaltyAmount > 0 && royaltyAmount < remainingAmount) {
                payable(royaltyReceiver).transfer(royaltyAmount);
                remainingAmount -= royaltyAmount;
            }
        } catch {
            // Contract doesn't support ERC-2981, continue
        }

        // Remainder to seller
        payable(seller).transfer(remainingAmount);

        // Transfer NFT to buyer
        IERC721(nftContract).safeTransferFrom(seller, buyer, tokenId);
    }
}
