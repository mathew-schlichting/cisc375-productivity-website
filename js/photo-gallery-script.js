"use strict";


var slideIndex = 1;




function init(){
    console.log('Version 0.0.1');



    loadPictures();
}


function loadPictures(){
    var table = document.getElementById('picture-table');
    var i;
    var j;
    var html = '';

    for(i = 0; i < 4; i++) {
        html += '<tr>';
        for (j = 0; j < 5; j++) {
            html += getTableData(i*5 + j + 1);
        }
        html += '</tr>';
    }

    table.innerHTML = html;
}

function getTableData(i){
    return '<td><div id="picture-' +i+ '" class="picture-tile-container"><img class="picture-tile" onclick="openSlideshow()" onmouseenter="hoverImage(this);" onmouseleave="unhoverImage(this);" src="../media/images/pic' + i + '-thumb.jpg"/></div></td>';
}

function hoverImage(element){
    element.style.width = '168px';
    element.style.height = '120px';
    element.style.left = '0';
    element.style.top = '0';
}

function unhoverImage(element){
    element.style.width = '140px';
    element.style.height = '100px';
    element.style.left = '14px';
    element.style.top = '10px';
}


function openSlideshow() {
    document.getElementById('slideshow-container').style.display = "block";
    showSlides(1);
}

function closeSlideshow() {
    document.getElementById('slideshow-container').style.display = "none";
}



function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}