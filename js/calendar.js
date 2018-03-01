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


    console.log(date.getDate()%noDays);
    i = date.getDate()%noDays - 1;
    j = date.getDay();

    e = document.getElementById('cell_' + i + '.' + j);
    e.innerHTML = day;

    //date.getDay() returns the week day === j

    var currentWeek = 0;
    for(i=0 ; i<NO_DAYS_IN_MONTH[month]; i++){
        date = new Date(year, month, i+1);
        if(date.getDay() === 0){
            currentWeek++;
        }
        e = document.getElementById('cell_' + currentWeek + '.' + date.getDay());
        e.innerHTML = date.getDate();
        console.log(date);

    }



    /*
    for(i=0; i<noWeeks; i++){
        for(j=0; j<noDays; j++){
            e = document.getElementById('cell_' + i + '.' + j);
            e.innerHTML = (i*noDays + j);
        }
    }
    */

}

function selectDate(event) {
    var reload = false;

    console.log("clicked on " + event.target.id);


    if(event.target.id === 'next_month'){
        month = (month + 1)%12;
        reload = true;
    }
    else if(event.target.id === 'prev_month'){
        month = (month + 11)%12;
        reload = true;
    }




    if(reload){
        populateCalendar();
    }
}