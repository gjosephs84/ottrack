const convertTime = (time) => {
    let amPm;
    let hour;
    let minute;

    if (time == 0) {
        return "off"
    };

    if (time >= 1200) {
        amPm = "PM";
        if (time >= 1300) {
            hour = time - 1200
            } else {
            hour = time;
            };
        } else {
        amPm = "AM";
        hour = time;
        };
    minute = time.toString().slice(-2);
    let minuteString = minute[0].toString() + minute[1].toString();
    hour -= Number(minute);
    hour = hour / 100;
    let timeString = `${hour}:${minuteString} ${amPm}`;
    return timeString;
};

export default convertTime;