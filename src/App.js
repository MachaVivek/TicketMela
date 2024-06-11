import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Route, Routes} from "react-router-dom";
// Components
import Navigation from './components/Navigation'
import Card from './components/Card'
import SeatChart from './components/SeatChart'
import AddEventForm from './components/AddEventForm'
import Withdraw from './components/Withdraw'


// ABIs
import TokenMaster from './abis/TokenMaster.json'
// Config
import config from './config.json'

function App() {

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const [tokenMaster, setTokenMaster] = useState(null);
  const [totalEvents, setTotalEvents] = useState([]);

  const [event, setEvent] = useState({})
  const [toggle, setToggle] = useState(false);

  const [owner, setOwner] = useState(null);

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterName, setFilterName] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(4); 

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredEvents.slice(indexOfFirstCard, indexOfLastCard);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);


  const load_block_chain_data = async () => {

    // loading the smart contracts
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const tokenMaster = new ethers.Contract(config[network.chainId].TokenMaster.address, TokenMaster, provider);
    setTokenMaster(tokenMaster);
    console.log(tokenMaster.address);

    const owner= await tokenMaster.owner();
    setOwner(owner);
    console.log("Owner is ",owner);

    const events_length = await tokenMaster.total_events();
    const totalEvents = [];
    for (var i = 1; i <= events_length; i++) {
      const event = await tokenMaster.get_event_details(i);
      totalEvents.push(event);
    }
    setTotalEvents(totalEvents);
    setFilteredEvents(totalEvents);

    // whenever account is changed then account will be changed, the below code make refresh whenever the account changed automatically
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const formatted_account = ethers.utils.getAddress(accounts[0]);
      setAccount(formatted_account);
    });

    // 
  }

  const filterEvents = () => {

    let filtered = totalEvents;

    if (filterDate) {
      filtered = filtered.filter(event => event.date === filterDate);
    }

   

    if (filterLocation) {
      filtered = filtered.filter(event => 
        event.event_location && event.event_location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (filterName) {
      filtered = filtered.filter(event => 
        event.event_name && event.event_name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    load_block_chain_data();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filterDate, filterLocation, filterName, totalEvents]);

  return (
    <div>
      <div>
        <Navigation account={account} setAccount={setAccount} />
      </div>

      {account && owner && account.toLowerCase() === owner.toLowerCase() && (
        <div>
        <AddEventForm tokenMaster={tokenMaster} provider={provider} account={account} />
        <Withdraw tokenMaster={tokenMaster} provider={provider} account={account} />
        </div>
      )}

      <div style={{ border: '2px solid #333', borderRadius: '8px', margin: '10px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Filter Events</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Date:</label>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Location:</label>
          <input type="text" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Event Name:</label>
          <input type="text" value={filterName} onChange={(e) => setFilterName(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
      </div>


      <div className='' style={{border: '2px solid black', margin: '10px', padding: '10px' }}>
              {currentCards.map((_event, index) => (
                <Card
                  event={_event}
                  id={index + 1}
                  tokenMaster={tokenMaster}
                  provider={provider}
                  account={account}
                  toggle={toggle}
                  setToggle={setToggle}
                  setEvent={setEvent}
                  key={index}
                />
              ))}
      </div>
      {toggle && (
        <SeatChart
          event={event}
          tokenMaster={tokenMaster}
          provider={provider}
          account={account}
          setToggle={setToggle}
        />
      )}

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={indexOfLastCard >= filteredEvents.length}>
          Next
        </button>
      </div>
      <div style={{margin:"10px"}}>  </div>
    </div>

  );
}

export default App;
