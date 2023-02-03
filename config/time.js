export function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${ampm}`;
}
export function saveTheday(date) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    let day = weekday[date.getDay()];
    return day;
}

export function date(dateObj) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let myDate = `${dateObj.getUTCDate()} ${monthNames[(dateObj.getMonth())]} ${(dateObj.getUTCFullYear())}`;
    return myDate;
}
