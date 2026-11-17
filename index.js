function setCookie(name, value, seconds) {
    const d = new Date();
    d.setTime(d.getTime() + seconds * 1000);

    let expires = "expires=" + d.toUTCString();

    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookieValue(key) {
    let name = key + "=";

    let decodedCookie = decodeURIComponent(document.cookie);

    let ca = decodedCookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let section = ca[i];
        while (section.charAt(0) == " ") {
            section = section.substring(1);
        }

        if (section.indexOf(name) == 0) {
            return section.substring(name.length, section.length);
        }
    }
    return "";
}

const monthInput = document.querySelector("#month");
const yearInput = document.querySelector("#year");
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const oneYear = 365 * 24 * 60 * 60;

const now = new Date();

const savedNotes = getCookieValue("notes");
let notes = savedNotes ? JSON.parse(savedNotes) : {};

function Generate() {
    const month = +monthInput.value;
    const year = +yearInput.value;
    if (!(month >= 1 && month <= 12) || !(year >= 1000 && year <= 9999)) return alert("Ay 1-12, il 1000-9999 arası olmalıdır");


    DrawCalendar(month, year);
}

function DrawCalendar(month, year) {
    document.querySelector("#title").innerHTML = `${months[month - 1]}, ${year}`;

    const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const days = new Date(year, month, 0).getDate();
    const cells = Math.ceil((offset + days) / 7) * 7;

    let html = `<tr>${["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => `<th>${d}</th>`).join("")}</tr>`;

    for (let i = 0; i < cells; i++) {
        const day = i - offset + 1;
        const note = notes[`${year}-${month}-${day}`];
        const isToday = year == now.getFullYear() && month == now.getMonth() + 1 && day == now.getDate();

        if (i % 7 == 0) html += "<tr>";
        html += day < 1 || day > days
            ? "<td></td>"
            : `<td class="${note ? "marked" : ""} ${isToday ? "today" : ""}" title="${note || ""}" onclick="SelectDay(${year},${month},${day})">${day}</td>`;
        if (i % 7 == 6) html += "</tr>";
    }

    document.querySelector("#calendar").innerHTML = html;
}

function SelectDay(year, month, day) {
    const key = `${year}-${month}-${day}`;
    const text = prompt(`${day} ${months[month - 1]} ${year} üçün qeyd (silmək üçün boş buraxın):`, notes[key] || "");
    if (text === null) return;

    if (text.trim()) notes[key] = text.trim();
    else delete notes[key];

    setCookie("notes", JSON.stringify(notes), oneYear);
    DrawCalendar(month, year);
}

monthInput.value = now.getMonth() + 1;
yearInput.value = now.getFullYear();
DrawCalendar(now.getMonth() + 1, now.getFullYear());