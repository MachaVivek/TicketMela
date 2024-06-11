import { ethers } from 'ethers'
import { useState } from 'react';
import Aboutus from './AboutUs'
import TokenMasterSummary from './Summary';
const Navigation = ({ account, setAccount }) => {
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

    const toggleAboutUs = () => {
        setShowAboutUs(!showAboutUs);
    };

    const toggleShowSummary = () => {
      setShowSummary(!showSummary);
  };

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }
  
  return (
    <nav className="nav-container" style={{border: '2px solid black', padding: '20px', margin: '10px'}}>
      <div className=''>
        <h1 style={{alignContent: 'center', textAlign: 'center'}}>TicketMela</h1>
      </div>

      <div>
          <span>
          <button onClick={toggleShowSummary}>About Website</button>
                {showSummary && <TokenMasterSummary showSummary={showSummary} onClose={toggleShowSummary} />}
            </span>
          <span>  </span>
            <span>
              <button onClick={toggleAboutUs}>About Us</button>
            {showAboutUs && <Aboutus onClose={toggleAboutUs} />}
            </span>

            <span>   </span>

            <span>
            {account ? (
              <button
                type="button"
                className=''
              >
                {account.slice(0, 6) + '...' + account.slice(38, 42)}
              </button>
            ) : (
              <button
                type="button"
                className=''
                onClick={connectHandler}
              >
                Connect
              </button>
            )}
            </span>
            

            

      </div>
      
      
    </nav>
  );
}

export default Navigation;