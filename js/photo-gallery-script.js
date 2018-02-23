"use strict";


var currentSlide = 1;
var slideElements = [];


function init(){
    console.log('Version 0.0.1');

    var i;



    loadThumbnails();
    loadSlideshow();
    slideElements = document.getElementsByClassName("slide");

    window.onkeyup = keyPress;
}

function loadSlideshow(){
    var slideshow = document.getElementById('slideshow');
    var i;
    var html = '';

    for(i=0; i<20; i++){
        html += getSlideData(i+1);
    }

    slideshow.innerHTML = html;
}


function loadThumbnails(){
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


function getSlideData(i){
    return '<div class="slide"><img src="../media/images/pic' + i + '.jpg" style="width: 100%; height: 100%;"></div>';
}

function getTableData(i){
    return '<td><div id="picture-' +i+ '" class="picture-tile-container" onclick="openSlideshow(this)" ><img class="picture-tile" src="../media/images/pic' + i + '-thumb.jpg"/></div></td>';
}


function openSlideshow(element) {
    var view = document.getElementById('slideshow-view');
    view.style.display = 'block';
    
    // get id to bring up correct picture
    var id = element.id.split('-')[1];
    focusSlide(id - 1);
}

function closeSlideshow() {
    document.getElementById('slideshow-view').style.display = 'none';
}


function keyPress(event){
    if(event.keyCode === 37){//left arrow key
        prevSlide();
    }
    else if(event.keyCode === 39){//right arrow key
        nextSlide();
    }
    else if(event.keyCode === 27){//escape key
        closeSlideshow();
    }
}

function nextSlide(){
    changeSlide((currentSlide+1)%slideElements.length);
}

function prevSlide(){
    changeSlide((currentSlide + slideElements.length - 1) % slideElements.length);
}

function focusSlide(slide){
    currentSlide = slide;
    fade(slideElements[currentSlide], 0, 1, 20);//fade in new)
}

function changeSlide(slide) {
    fade(slideElements[currentSlide], 1, -1, 20);//fade out old
    focusSlide(slide)
}

function fadeOut(element, speed){
    var o;
    o = 1;

    var fade = setInterval(function(){
        element.style.opacity = o;
        o -= .1;
        if(o <= 0){
            clearInterval(fade);
            element.style.display = 'none';
        }
    }, speed);
}

function fade(element, start, direction, speed){
    var o;

    o = start;
    element.style.opacity = o;

    if(direction > 0) {
        element.style.display = 'block';
    }

    var fade = setInterval(function(){
        element.style.opacity = o;
        o += .1 * direction;
        if(o >= 1){
            clearInterval(fade);
        }
        else if(o <= 0){
            clearInterval(fade);
            element.style.display = 'none';
        }
    }, speed);
}



