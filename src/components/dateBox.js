const DateBox = ({date, available}) => {
    let classToGive = "date-box";
    if (!available) classToGive = "date-box db-unavailable";
    const elements = date.split(' ');
    const dayOfWeek = elements[0].toUpperCase();
    const month = elements[1].toUpperCase();
    const day = elements[2];

    return (
        <div className={classToGive}>
            <p className="db-p">{dayOfWeek}</p>
            <h2 className="db-h">{day}</h2>
            <p className="db-p">{month}</p>
        </div>
    )

}

export default DateBox;