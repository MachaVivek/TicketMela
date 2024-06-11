// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// openzeppelin library gives the implementation of the NFT tokens
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//  In blockchain-based ticketing, NFTs (non-fungible tokens) are typically issued whenever a person buys a ticket.

// owr smartcontract is inheriting the ERC721 so we can use that functions
contract TokenMaster is ERC721{
    // owner in this case is the smart contract creator or developer whic has rights to edit and add funcitions in smart contract
    address public owner;
    uint256 public total_events;
    uint256 public total_supply;  // number of nfts present

    struct Event_details{
        uint256 id;
        string event_name;
        uint256 ticket_cost;
        uint256 total_tickets;
        uint256 tickets;
        string date;
        string time;
        string event_location;

    }

    // to track the events hosted
    mapping(uint256 => Event_details) events_map;

    // to track the seats which are given to which address
    // id of event, seat number, address
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;

    // to track seats already taken
    // id of event, seat numbers
    mapping(uint256 => uint256[]) seats_already_taken;

    // to track whether the given address is buyed ticket or not
    //  id of event, user_address, bool to represent ticket buyed or not
    mapping(uint256 => mapping(address => bool)) public has_bought;

    // before modifer to check whether the person is the owner or not
    modifier only_owner {
        _;
        require(msg.sender == owner, "Only owner can perform this action");
        
    }

    // pass the nft name and nft symbol to construtor for creating it
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner= msg.sender;
    }

    function list(string memory _event_name,uint256 _ticket_cost, uint256 _total_tickets, string memory _date, string memory _time, string memory _event_location) public only_owner{
        total_events++ ;
        events_map[total_events]= Event_details(
            total_events,
            _event_name,
            _ticket_cost,
            _total_tickets,
            _total_tickets,
            _date,
            _time,
            _event_location
        );
    }

    function get_event_details(uint256 _id) public view returns(Event_details memory){
        return events_map[_id];
    }

    function mint(uint256 _id, uint256 _seat_number) public payable{
        // this function is to issue a ticket in the form of NFT after user buys the ticket for an event

        require(_id != 0, "Event id cannot be zero");
        require(_id <= total_events, "This event id is invalid");
        require(msg.value >= events_map[_id].ticket_cost, "Insufficient amount to buy ticket");
        require(_seat_number <= events_map[_id].total_tickets, "This seat number is invalid");

        events_map[_id].tickets--;  // update the tickets left

        has_bought[_id][msg.sender]= true; // update the status of user for particular event

        seatTaken[_id][_seat_number]=msg.sender; // assign the seat

        seats_already_taken[_id].push(_seat_number); // update seats currenlty taken

        total_supply++;
        // the _safeMint function is inbuilt in openzeppelin library
        // this takes receiver address and the token id
        _safeMint(msg.sender, total_supply);
    }

    function get_seats_taken(uint256 _id) public view returns(uint256[] memory){
        return seats_already_taken[_id];
    }

    // Yes, when deploying a smart contract using Hardhat, the default behavior is that the first account from Hardhat's list of generated accounts will be the contract owner. This is typically the account you use to deploy the contract.the smart contract owner is the first account in the list of generated accounts.
    
    function withdraw_by_owner() public only_owner{
        // this makes the deployer who added the event, that is the owner to take the ether sent by the user to his wallet after buying the ticket for the event
        (bool success, )= owner.call{value: address(this).balance}("");
        require(success, "Failed to withdraw");
    }
}
