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



function init(){
    /* Init functionality */
    loadFromStorage();
    checkForEmptyList();

    canvas = document.getElementById('pie-chart');
    context = canvas.getContext('2d');
    updatePieChart();

    resetNewItem();
}

function updatePieChart(){
    var radius = 60;
    var startAngle = 0;
    var centerX = 150;
    var centerY = 75;
    var endAngle = Math.PI * 2; // End point on circle

    context.beginPath();

    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.stroke();


}

function loadFromStorage(){
    var temp;

    temp = localStorage.getItem('categories');
    if(temp === null){
        console.log('in here');
        categories = [];
        addCategory('School', '#adccff');
        addCategory('Work', '#e3b2f7');
        addCategory('Chores', '#fc9494');
        addCategory('Shopping', '#fff3ba');
    }
    else{
        categories = JSON.parse(temp);
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
        addItem(nameInput.value, descriptionInput.value, deadlineInput.value, getCategory(categoryInput.value));
        resetNewItem();
    }
}

function getCategory(name){
    var i;

    for(i=0;i<categories.length;i++){
        if(categories[i].name === name){
            return categories[i];
        }
    }

    return null;
}


function reloadList(){
    var listDom = document.getElementById('todo-list');

    listDom.innerHTML = "";
    for(var i=0;i<listObjects.length;i++){
        listDom.innerHTML += makeHTML(listObjects[i]);
    }
}


function sortList(){
    var sortTechDom = document.getElementById('sorting-options');
    listObjects.sort(sortTechniques[sortTechDom.value]);
    reloadList();
}

function toggleComplete(element){
    var id = element.parentElement.parentElement.parentElement.id;

    for(var i=0;i<listObjects.length;i++){
        if(id === listObjects[i].name){
            listObjects[i].complete = !listObjects[i].complete;
        }
    }

}

function checkForEmptyList(){
    if(listObjects.length > 0){
        document.getElementById('board-container').style.visibility = 'visible';
    }
    else{
        document.getElementById('board-container').style.visibility = 'hidden';
    }
}

function updateSavedList(){
    localStorage.setItem('todoList', JSON.stringify(listObjects));
    localStorage.setItem('categories', JSON.stringify(categories));
    checkForEmptyList();
}

function addItem(taskName, taskDescription, taskDeadline, taskCategory){
    var item = {name: taskName, description: taskDescription, deadline: taskDeadline, category: taskCategory, timestamp: new Date().toDateString(), complete: false};
    var listDom = document.getElementById('todo-list');

    listObjects.push(item);
    listDom.innerHTML += makeHTML(item);

    updateSavedList();
    closeItemCreator();
}

function makeHTML(item){
    return  '<li id="' + item.name + '" class="list-item padding-sm margin-sm" style="background-color: ' + item.category.color + '">'   +
                '<div>' + 'Name: '        + item.name           + '<span style="float: right;">Complete: <input onclick="toggleComplete(this)" ' + (item.complete ? 'checked' : '' ) + ' type="checkbox"/></span>' + '</div>' +
                '<div>' + 'Description: ' + item.description    + '</div>' +
                '<div>' + 'Deadline: '    + item.deadline       + '</div>' +
                '<div>' + 'Category: '    + item.category.name  + '</div>' +
                '<div>' + 'Date Added: '  + item.timestamp      + '<button style="float: right" onclick="openDeletePopup(this)">Delete</button></div>' +
        '</li>';
}

function openDeletePopup(element){
    var dimmerDom = document.getElementById('dimmer');
    var deletePopup = document.getElementById('delete-popup');

    dimmerDom.style.visibility = 'visible';
    deletePopup.style.visibility = 'visible';

    currentDeleteName = element.parentElement.parentElement.id;
}
function confirmDelete(){
    for(var i=0;i<listObjects.length;i++){
        if(listObjects[i].name === currentDeleteName){
            listObjects.splice(i, 1);
        }
    }
    closeDeletePopup();
    updateSavedList();
    reloadList();
}

function closeDeletePopup(){
    var dimmerDom = document.getElementById('dimmer');
    var deletePopup = document.getElementById('delete-popup');

    dimmerDom.style.visibility = 'hidden';
    deletePopup.style.visibility = 'hidden';

    currentDeleteName = '';
}

function openItemCreator(){
    var dimmerDom = document.getElementById('dimmer');
    var newItem = document.getElementById('new-item');

    dimmerDom.style.visibility = 'visible';
    newItem.style.visibility = 'visible';
}

function closeItemCreator(){
    var dimmerDom = document.getElementById('dimmer');
    var newItem = document.getElementById('new-item');

    dimmerDom.style.visibility = 'hidden';
    newItem.style.visibility = 'hidden';
}

function updateSavedCategories(){
    localStorage.setItem('categories', JSON.stringify(categories));
}

function addCategory(catName, catColor){
    var categoryInput = document.getElementById('input-category');
    var obj;

    categoryInput.innerHTML += '<option value="' + catName + '">' + catName + '</option>';

    obj = {name: catName, color: catColor};

    categories.push(obj);

    updateSavedCategories();
}

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

function clearAllStorage(){
    localStorage.clear();
}

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