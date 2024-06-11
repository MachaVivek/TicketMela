import React from 'react';

const TokenMasterSummary = ({ showSummary, onClose }) => {
    if (!showSummary) return null; // Render nothing if showSummary is false

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="modal-background">
            <div className="modal-content">
                <span className="close-button" onClick={handleClose}>&times;</span>
                <h1 className="title">TokenMaster Project Summary</h1>
                <div className="section">
                    <h2 className="section-title">Summary</h2>
                    <p className="description">
                        The TokenMaster project implements a blockchain-based ticketing system using NFTs (non-fungible tokens). It is deployed on the Ethereum blockchain and allows users to purchase event tickets as NFTs.
                    </p>
                </div>
                <div className="section">
                    <h2 className="section-title">Key Features</h2>
                    <ul className="feature-list">
                        <li>Contract Inheritance from ERC721 standard</li>
                        <li>Administrative privileges for contract owner</li>
                        <li>Event management with details such as name, cost, date, and location</li>
                        <li>Users can purchase tickets by minting NFTs</li>
                        <li>Seat allocation and ticket ownership tracking</li>
                        <li>Withdrawal function for contract owner to withdraw funds</li>
                    </ul>
                </div>
                <div className="section">
                    <h2 className="section-title">Contract Functions</h2>
                    <ul className="function-list">
                        <li><span className="function-name">list</span>: Add new events to the contract</li>
                        <li><span className="function-name">mint</span>: Purchase tickets by minting NFTs</li>
                        <li><span className="function-name">withdraw_by_owner</span>: Withdraw funds as contract owner</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TokenMasterSummary;
