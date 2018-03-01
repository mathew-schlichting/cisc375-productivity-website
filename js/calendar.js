/**
 * Created by Mathew on 3/1/2018.
 */

var day, month, year;
var noWeeks = 6;
var noDays = 7;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NO_DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


function createCalendar(){
    var calendar = document.getElementById("calendar");
    var html = calendar.innerHTML;
    var i, j;


    for(i=0; i<noWeeks; i++){
        html += '<tr>';
        for(j=0; j<noDays; j++){
            html += '<td id="cell_' + i + '.' + j + '" class="date"></td>'
        }
        html += '</tr>';
    }
    calendar.innerHTML = html;

    calendar.addEventListener("click", selectDate, false);


    var date;

    date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();

    populateCalendar();
}

function populateCalendar(){
    var date;
    var e;
    var i, j;

    date = new Date(year, month, day);
    for(i=0; i<noWeeks; i++){
        for(j=0; j<noDays; j++){
            e = document.getElementById('cell_' + i + '.' + j);
            e.innerHTML = '';
        }
    }

    e = document.getElementById('month');
    e.innerHTML = MONTHS[month];

    i = date.getDate()%noDays - 1;
    j = date.getDay();

    e = document.getElementById('cell_' + i + '.' + j);
    e.innerHTML = day;

    //date.getDay() returns the week day === j

    var currentWeek = 0;
    for(i=0 ; i<NO_DAYS_IN_MONTH[month]; i++){
        date = new Date(year, month, i+1);
        if(date.getDay() === 0 && i !== 0){
            currentWeek++;
        }

        e = document.getElementById('cell_' + currentWeek + '.' + date.getDay());
        e.innerHTML = date.getDate();
    }
}

function selectDate(event) {
    var reload = false;

    if(event.target.id === 'next_month'){
        month = (month + 1)%12;
        if(month === 0){
            year++;
        }
        reload = true;
    }
    else if(event.target.id === 'prev_month'){
        month = (month + 11)%12;
        if(month === 11){
            year--;
        }
        reload = true;
    }
    else if(event.target.id.includes('cell_') && event.target.innerHTML !== ''){
        day = Number(event.target.innerHTML);
        closeCalendar();
    }




    if(reload){
        populateCalendar();
    }
}


function openCalendar(){
    var element = document.getElementById('calendar');
    var newItem = document.getElementById('new-item');

    element.style.display = 'block';
    newItem.style.zIndex = 0;

}


function closeCalendar(){
    var element = document.getElementById('calendar');
    var newItem = document.getElementById('new-item');
    var input = document.getElementById('input-deadline');

    element.style.display = 'none';
    newItem.style.zIndex = 1;

    input.value = day +'-'+ (month+1) +'-'+ year;
}


function isValidDate(date){
    var result = false;
    var split = date.split('-');
    var d, m, y;


    result = split.length === 3;
    if(result){
        d = split[0];
        m = split[1];
        y = split[2];
        result = !isNaN(d), !isNaN(m), !isNaN(y);
        if(result){
            result = m > 0 && m <= 12;
            if(result){
                result = d > 0 && d <= NO_DAYS_IN_MONTH[m];
                result = result && y >= 2000 && y <= 9999;
            }
        }
    }

    return result;
}