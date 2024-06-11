import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
// Import Components
import Seat from './Seat';

// Import Assets
import close from '../assets/close.svg';

const SeatChart = ({ event, tokenMaster, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false);
  const [hasSold, setHasSold] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [transactionReceipt, setTransactionReceipt] = useState(null);

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMaster.get_seats_taken(event.id)
    setSeatsTaken(seatsTaken)
  }

  const buyHandler = async (_seat) => {

    setHasSold(false);
    setIsLoading(true);
    setSelectedSeat(_seat);
    setTokenId(null);
    try {
      const signer = await provider.getSigner();
      const transaction = await tokenMaster.connect(signer).mint(event.id, _seat, { value: event.ticket_cost });
      const receipt = await transaction.wait();
      setTransactionReceipt(receipt);

      const transferEvent = receipt.events.find(event => event.event === 'Transfer');
      const newTokenId = transferEvent.args.tokenId;
      setTokenId(newTokenId.toString());

      setHasSold(true);
      setShowModal(true); // Show the modal after a successful purchase
    } catch (error) {
      console.error('Error minting ticket:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // console.log(event);
    getSeatsTaken();
  }, [hasSold]);

  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor('black');
    doc.text('TicketMela', 20, 10);

    doc.setFontSize(20);
    doc.setTextColor('green');
    doc.text('Success', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor('black');
    doc.text(`Seat ${selectedSeat} successfully purchased!`, 20, 30);
    doc.text(`Minted Token ID: ${tokenId}`, 20, 40);

    doc.setFontSize(14);
    doc.setTextColor('green');
    doc.text('Event Details:', 20, 50);

    doc.setFontSize(12);
    doc.setTextColor('black');
    doc.text(`Event Name: ${event.event_name}`, 20, 60);
    doc.text(`Date: ${event.date}`, 20, 70);
    doc.text(`Location: ${event.event_location}`, 20, 80);

    doc.setFontSize(14);
    doc.setTextColor('green');
    doc.text('Transaction Receipt:', 20, 90);

    doc.setFontSize(12);
    doc.setTextColor('black');
    doc.text(`Block Number: ${transactionReceipt.blockNumber}`, 20, 100);
    doc.text(`Gas Used: ${transactionReceipt.gasUsed.toString()}`, 20, 110);
    doc.text(`Status: ${transactionReceipt.status ? 'Success' : 'Failure'}`, 20, 120);

    doc.save('ticket_information.pdf');
  };

  return (
    <div className="event_css">
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            {isLoading && <p>Minting ticket, please wait...</p>}
            {tokenId && (
              <div style={{backgroundColor: 'green', padding: '10px', borderRadius: '10px', margin: '20px'}}>
                <p style={{fontWeight: 'bold'}}>Success</p>
                <ul>
                  <p>Seat {selectedSeat} successfully purchased!</p>
                  <p>Minted Token ID: {tokenId}</p>
                </ul>
                <p style={{fontWeight: 'bold'}}>Event Details:</p>
                <ul>
                  <p>Event Name: {event.event_name}</p>
                  <p>Date: {event.date}</p>
                  <p>Location: {event.event_location}</p>
                </ul>
                <p style={{fontWeight: 'bold'}}>Transaction Receipt:</p>
                <ul>
                  <p>Block Number: {transactionReceipt.blockNumber}</p>
                  <p>Gas Used: {transactionReceipt.gasUsed.toString()}</p>
                  <p>Status: {transactionReceipt.status ? 'Success' : 'Failure'}</p>
                </ul>
                <button onClick={downloadPdf}>Download PDF</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="event_css__seating">
        <h1>{event.event_name} Seating Map</h1>
        <button onClick={() => setToggle(false)} className="event_css__close">
          <img src={close} alt="Close" />
        </button>

        <div className="event_css__stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken &&  Array(25).fill(1).map((e, i) => (
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        ))}

        <div className="event_css__spacer--1">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(event.total_tickets) - 50).fill(1).map((e, i) => (
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        ))}

        <div className="event_css__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken  && Array(25).fill(1).map((e, i) => (
          <Seat
            i={i}
            step={(Number(event.total_tickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};

export default SeatChart;
