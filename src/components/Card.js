import { ethers } from 'ethers';

const Card = ({ event, toggle, setToggle, setEvent }) => {
  const togglePop = () => {
    setEvent(event);
    setToggle(!toggle);
  };

  return (
    <div className='card-container'>
      <div className=''>
        <p className=''>
          <strong>{event.date}</strong><br />{event.time}
        </p>

        <h3 className=''>
          {event.event_name}
        </h3>

        <p className=''>
          <small>{event.event_location}</small>
        </p>

        <p className=''>
          <strong>
            {ethers.utils.formatUnits(event.ticket_cost.toString(), 'ether')}
          </strong>
          ETH
        </p>

        {event.tickets.toString() === "0" ? (
          <button
            type=""
            className=''
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type=""
            className=''
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>

      <hr />
    </div >
  );
};

export default Card;
