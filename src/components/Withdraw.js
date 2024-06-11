import React from 'react';
import { ethers } from 'ethers';

const Withdraw = ({ tokenMaster, provider, account }) => {

  const withdraw = async () => {
    try {
      const signer = provider.getSigner();
      const contractWithSigner = tokenMaster.connect(signer);
      const transaction = await contractWithSigner.withdraw_by_owner();
      await transaction.wait();
      alert('Withdrawal successful!');
    } catch (error) {
      alert('Withdrawal failed', error);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid black' }}>
      <h3>Withdraw Funds</h3>
      <button onClick={withdraw} style={{ padding: '10px', background: 'green', color: 'white', cursor: 'pointer' }}>
        Withdraw
      </button>
    </div>
  );
};

export default Withdraw;
