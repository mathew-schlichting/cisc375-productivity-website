"use strict";

var currentDeleteName = '';

var listObjects = [];
var categories = [];
var sortTechniques = {
    CategoryUp: function(a, b){
        if(a.category.name > b.category.name){
            return 1;
        }
        return -1;
    },
    CategoryDown: function(a, b){
        if(a.category.name > b.category.name){
            return -1;
        }
        return 1;
    },
    DateUp: function(a, b){
        if(a.deadline > b.deadline){
            return 1;
        }
        return -1;
    },
    DateDown: function(a, b){
        if(a.deadline > b.deadline){
            return -1;
        }
        return 1;
    },
    Incomplete: function(a, b){
        if(a.complete){
            if(!b.complete) {
                return 1;
            }
        }
        return -1;
    }
};

var canvas;
var context;
var sections = [];


function init(){
    /* Init functionality */
    loadFromStorage();
    checkForEmptyList();

    canvas = document.getElementById('pie-chart');
    context = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    updatePieChart();
    canvas.onmousemove = canvasMouseMove;

    resetNewItem();
}


/* This loads the to-dos and the categories saved */
function loadFromStorage(){
    var temp;
    var i;

    temp = localStorage.getItem('categories');
    if(temp === null || temp === undefined){
        categories = [];
        addCategory('School', '#adccff');
        addCategory('Work', '#e3b2f7');
        addCategory('Chores', '#fc9494');
        addCategory('Shopping', '#fff3ba');
    }
    else{
        categories = JSON.parse(temp);
        for(i=0; i<categories.length; i++){
            updateCategoryHTML(categories[i].name);
        }
    }

    temp = localStorage.getItem('todoList');
    if(temp === null){
        listObjects = [];
    }
    else{
        listObjects = JSON.parse(temp);
    }
    reloadList();
}


/* On submit of the item */
function submitItem(){
    var nameInput = document.getElementById('input-name');
    var descriptionInput = document.getElementById('input-description');
    var deadlineInput = document.getElementById('input-deadline');
    var categoryInput = document.getElementById('input-category');
    var add = true;


    for (var i = 0; i < listObjects.length; i++) {
        if (nameInput.value === listObjects[i].name) {
            alert('You already have a task with that name!')
            add = false;
        }
    }

    if(add) {
        addItem(nameInput.value, descriptionInput.value, deadlineInput.value, getCategory(categoryInput.value), false);
        resetNewItem();
    }

    updatePieChart();
}


// returns the category object that matches the name
function getCategory(name){
    var i;

    for(i=0;i<categories.length;i++){
        if(categories[i].name === name){
            return categories[i];
        }
    }

    return null;
}

//reloads the html list of the todos
function reloadList(){
    var listDom = document.getElementById('todo-list');

    listDom.innerHTML = "";
    for(var i=0;i<listObjects.length;i++){
        listDom.innerHTML += makeHTML(listObjects[i]);
    }
}

//sorts the list of the todos
function sortList(){
    var sortTechDom = document.getElementById('sorting-options');
    listObjects.sort(sortTechniques[sortTechDom.value]);
    reloadList();
}

//toggle complete of the clicked todos
function toggleComplete(element){
    var id = element.parentElement.parentElement.parentElement.id;

    for(var i=0;i<listObjects.length;i++){
        if(id === listObjects[i].name){
            listObjects[i].complete = !listObjects[i].complete;
        }
    }

}

//if the list is empty
function checkForEmptyList(){
    if(listObjects.length > 0){
        document.getElementById('board-container').style.visibility = 'visible';
    }
    else{
        document.getElementById('board-container').style.visibility = 'hidden';
    }
}

//save the list in local storage
function updateSavedList(){
    localStorage.setItem('todoList', JSON.stringify(listObjects));
    localStorage.setItem('categories', JSON.stringify(categories));
    checkForEmptyList();
}


//add an item to the list object
function addItem(taskName, taskDescription, taskDeadline, taskCategory, isHighlighted){
    var item = {name: taskName, description: taskDescription, deadline: taskDeadline, category: taskCategory, timestamp: new Date().toDateString(), complete: false, highlighted: isHighlighted};
    var listDom = document.getElementById('todo-list');

    listObjects.push(item);
    listDom.innerHTML += makeHTML(item);

    updateSavedList();
    closeItemCreator();
}


//make the html for a to-do item
function makeHTML(item){
    return  '<li id="' + item.name + '" class="list-item padding-sm margin-sm' + (item.highlighted ? ' highlighted-item' : '') + '" style="background-color: ' + item.category.color + '">'   +
                '<div>' + 'Name: '        + item.name           + '<span style="float: right;">Complete: <input onclick="toggleComplete(this)" ' + (item.complete ? 'checked' : '' ) + ' type="checkbox"/></span>' + '</div>' +
                '<div>' + 'Description: ' + item.description    + '</div>' +
                '<div>' + 'Deadline: '    + item.deadline       + '</div>' +
                '<div>' + 'Category: '    + item.category.name  + '</div>' +
                '<div>' + 'Date Added: '  + item.timestamp      + '<button style="float: right" onclick="openDeletePopup(this)">Delete</button></div>' +
        '</li>';
}

//open the popup for delete confirmation
function openDeletePopup(element){
    var dimmerDom = document.getElementById('dimmer');
    var deletePopup = document.getElementById('delete-popup');

    dimmerDom.style.visibility = 'visible';
    deletePopup.style.visibility = 'visible';

    currentDeleteName = element.parentElement.parentElement.id;
}

//confirming the delete of a to-do
function confirmDelete(){
    for(var i=0;i<listObjects.length;i++){
        if(listObjects[i].name === currentDeleteName){
            listObjects.splice(i, 1);
        }
    }
    closeDeletePopup();
    updateSavedList();
    reloadList();
    updatePieChart();
}

//close the delete popup
function closeDeletePopup(){
    var dimmerDom = document.getElementById('dimmer');
    var deletePopup = document.getElementById('delete-popup');

    dimmerDom.style.visibility = 'hidden';
    deletePopup.style.visibility = 'hidden';

    currentDeleteName = '';
}

//open the item popup
function openItemCreator(){
    var dimmerDom = document.getElementById('dimmer');
    var newItem = document.getElementById('new-item');

    dimmerDom.style.visibility = 'visible';
    newItem.style.visibility = 'visible';
}

//close the item popup
function closeItemCreator(){
    var dimmerDom = document.getElementById('dimmer');
    var newItem = document.getElementById('new-item');

    dimmerDom.style.visibility = 'hidden';
    newItem.style.visibility = 'hidden';
}


//save the categories in local storage
function updateSavedCategories(){
    localStorage.setItem('categories', JSON.stringify(categories));
}

//add a new category
function addCategory(catName, catColor){
    var obj;

    updateCategoryHTML(catName);

    obj = {name: catName, color: catColor};

    categories.push(obj);

    updateSavedCategories();
}

//update the dropdown html for the categories
function updateCategoryHTML(catName){
    var categoryInput = document.getElementById('input-category');
    categoryInput.innerHTML += '<option value="' + catName + '">' + catName + '</option>';
}

//submit the new category
function submitCategory() {
    var categoryInput = document.getElementById('input-category');
    var name = document.getElementById('input-new-category-name').value;
    var color = document.getElementById('input-new-category-color').value;
    var add = true;

    for (var i = 0; i < categories.length; i++) {
        if (name === categories[i].name) {
            alert('You already have a category with that name!')
            add = false;
        }
    }

    if (add) {
        addCategory(name, color);
        categoryInput.value = name;
    }
}

//clears all of the storage and reloads the page
function clearAllStorage(){
    localStorage.clear();
    location.reload();
}

//sets the item popup to default stuff
function resetNewItem(){
    var nameInput = document.getElementById('input-name');
    var descriptionInput = document.getElementById('input-description');
    var deadlineInput = document.getElementById('input-deadline');
    var categoryInput = document.getElementById('input-category');

    nameInput.value = '';
    descriptionInput.value = '';
    deadlineInput.value = '2018-01-01'; //todo
    categoryInput.value = categories[0].name;
}




/******************* Pie Chart Code **********************************************************************/
function canvasMouseMove(event){
    var point = canvasMouseLocation(event);
    var graphPoint;//centered on graph point
    var i;
    var radius;
    var inPie = false;

    radius = canvas.width/2;
    graphPoint = {x: point.x - canvas.width/2, y: -(point.y - canvas.height/2)};


    for (i=0; i < sections.length; i++) {
        if(isInCircle(graphPoint, radius) && isWithinAngle(sections[i].start, sections[i].end, graphPoint)){
            highlightObjectsWithCategory(i);
            i = sections.length;//break from loop
            inPie = true;
        }
    }

    if(!inPie){
        unhighlightAll();
    }
}

function unhighlightAll(){
    var i;
    for(i=0; i<listObjects.length;i++){
        listObjects[i].highlighted = false;
    }
    reloadList();
}

function highlightObjectsWithCategory(category){
    var i;

    for(i=0; i<listObjects.length;i++){
        if(listObjects[i].category.name === categories[category].name){
            listObjects[i].highlighted = true;
        }
        else{
            listObjects[i].highlighted = false;
        }
    }

    reloadList();
}

function canvasMouseLocation(event){
    var canvasLocation = canvas.getBoundingClientRect();
    return {
        x: event.clientX - canvasLocation.left,
        y: event.clientY - canvasLocation.top
    };
}



function isWithinAngle(a1, a2, point){
    var pointAngle;

    pointAngle = Math.atan(point.y / point.x);
    if(point.x < 0){
        pointAngle += Math.PI;
    }
    else if(point.y < 0){
        pointAngle += Math.PI * 2;
    }

    return pointAngle > a1 && pointAngle < a2;
}

function isInCircle(point, radius){
    var c2 = point.x * point.x + point.y * point.y;
    return c2 <= radius * radius;
}


function updatePieChart(){
    var prevSection = 0;
    var numberOfCategories = {};
    var i;
    var centerX, centerY;
    var radius = canvas.width/2 - 10;

    //clear first pie chart
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //find center of canvas
    centerX = canvas.width  / 2;
    centerY = canvas.height / 2;

    //set all objects to zero
    for(i=0; i<categories.length; i++){
        numberOfCategories[categories[i].name] = 0;
    }

    //count all categories
    for(i=0; i<listObjects.length; i++){
        numberOfCategories[listObjects[i].category.name]++;
    }


    sections = [];

    //draw each section
    for(i=0; i<categories.length; i++){
        sections.push({end: Math.PI * 2 - prevSection, start: Math.PI * 2 - (prevSection + (Math.PI * 2 * (numberOfCategories[categories[i].name] / listObjects.length)))});
        context.fillStyle = categories[i].color;
        context.beginPath();
        context.arc     (centerX, centerY, radius, prevSection, prevSection + (Math.PI * 2 * (numberOfCategories[categories[i].name] / listObjects.length)), false);
        context.lineTo  (centerX, centerY);
        context.fill();
        prevSection += Math.PI * 2 * (numberOfCategories[categories[i].name] / listObjects.length);
    }
}