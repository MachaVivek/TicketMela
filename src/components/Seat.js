const Seat = ({ i, step, columnStart, maxColumns, rowStart, maxRows, seatsTaken, buyHandler }) => {
    // console.log(i,step,columnStart, maxColumns, rowStart, maxRows, seatsTaken)
    return (
        <div
            onClick={() => buyHandler(i + step)}
            className={seatsTaken.find(seat => Number(seat) == i + step) ? "event_css__seats--taken" : "event_css__seats"}
            style={{
                gridColumn: `${((i % maxColumns) + 1) + columnStart}`,
                gridRow: `${Math.ceil(((i + 1) / maxRows)) + rowStart}`
            }}
        >
            {i + step}
        </div>
    );
}

export default Seat;