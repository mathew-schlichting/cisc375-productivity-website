/**
 * Created by Mathew on 2/28/2018.
 */
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
        listObjects[i].highlighted = listObjects[i].category.name === categories[category].name;
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


    //draw circle for pie to be placed on
    context.fillStyle = 'black';
    context.beginPath();
    context.arc     (centerX, centerY, radius+5, 0, Math.PI * 2, false);
    context.lineTo  (centerX, centerY);
    context.fill();



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
