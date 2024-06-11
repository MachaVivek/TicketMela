import { useState } from 'react';
import { ethers } from 'ethers';

const AddEventForm = ({ tokenMaster, provider, account }) => {
  const [eventName, setEventName] = useState('');
  const [ticketCost, setTicketCost] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signer = provider.getSigner();
    const tokenMasterWithSigner = tokenMaster.connect(signer);

    try {
      const tx = await tokenMasterWithSigner.list(
        eventName,
        ethers.utils.parseUnits(ticketCost, 'ether'),
        totalTickets,
        date,
        time,
        location
      );
      await tx.wait();
      alert('Event added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add event');
    }
  };

  const handleDateChange = (event) => {
    const inputDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate >= today) {
      const formattedDate = inputDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      console.log(formattedDate);
      setDate(formattedDate);
    } else {
      setDate('');
      alert('The date cannot be in the past.');
    }
  };

  return (
    <div className='add-event-form-container'>
      
    <form onSubmit={handleSubmit} className="add-event-form" style={{ border: '2px solid black', margin: '10px', padding: '10px' }}>

    <h2>Add event form</h2>
      <div>
        <label>Event Name:</label>
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
      </div>
      <div>
        <label>Ticket Cost (ETH):</label>
        <input type="text" value={ticketCost} onChange={(e) => setTicketCost(e.target.value)} required />
      </div>
      <div>
        <label>Total Tickets:</label>
        <input type="number" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} required />
      </div>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={handleDateChange} required />
      </div>
      <div>
        <label>Time:</label>
        <input type="text" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <button type="submit">Add Event</button>
    </form>
    </div>
  );
};

export default AddEventForm;
