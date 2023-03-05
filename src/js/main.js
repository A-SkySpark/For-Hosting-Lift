class Queue {
    constructor() {
        this.items = {}
        this.frontIndex = 0
        this.backIndex = 0
    }
    enqueue(item) {
        this.items[this.backIndex] = item
        this.backIndex++
        return item + ' inserted'
    }
    dequeue() {
        const item = this.items[this.frontIndex]
        delete this.items[this.frontIndex]
        this.frontIndex++
        return item
    }
    peek() {
        return this.items[this.frontIndex]
    }

    size(){
        return (this.backIndex-this.frontIndex);
    }

    isEmpty(){
        if(this.frontIndex === this.backIndex)
         return true;
        return false;

    }

}

let floors = 0;
let lifts = 0;
let body = document.getElementById("body");

var Map = new Map();  // to map lift number with the current floor number

let queue = new Queue(); //Queue to maintain the list of pending requests

//to build the initial input form
const buildForm = () => {

    let promptBox = document.createElement("div");
    promptBox.id = "prompt-box";
    body.appendChild(promptBox);

    let uList = document.createElement("ul");
    uList.id = "box";

    let li1 = document.createElement("li");
    let heading = document.createElement("label")
    heading.innerHTML = "Enter the number of Floors and Lifts you want";
    li1.appendChild(heading);


    let li2 = document.createElement("li");
    let fLabel = document.createElement("label");
    fLabel.innerHTML = "Floors";
    let floorTxt = document.createElement("input");
    floorTxt.id = "floorTxt";
    floorTxt.setAttribute("type" , "text");

    let lLabel = document.createElement("label");
    lLabel.innerHTML = "Lifts";
    let liftTxt = document.createElement("input");
    liftTxt.id = "liftTxt";
    liftTxt.setAttribute("type" , "text");

    li2.appendChild(fLabel);
    li2.appendChild(floorTxt);
    li2.appendChild(lLabel);
    li2.appendChild(liftTxt);


    let li3 = document.createElement("li");
    let btn = document.createElement("button");
    btn.innerHTML = "Generate";
    btn.setAttribute("onclick" , "generate()");
    btn.className = "generate";
    li3.appendChild(btn);

    uList.appendChild(li1);
    uList.appendChild(li2);
    uList.appendChild(li3);

    promptBox.appendChild(uList);

}

//on clicking the generate button the following function is excecuted
const generate = () => {
    floors = document.getElementById("floorTxt").value;
    lifts = document.getElementById("liftTxt").value;
   //PENDING: to add check for non-Integer or negative integer input. 

    if(floors == 0 && lifts == 0){
       alert( "You'll enjoy more if there were lifts and floors. (Please enter values greater than zero)");
        
    }

    else if(floors == 0 && lifts > 0){
        alert("I'll suggest building some floors to put the lift in it. (Please enter floor value greater than zero.)");
    }

    else if(floors > 0 && lifts == 0){
        alert("I bet you'll love the lift feature ;). (Please enter Lift value greater than zero.");
    }

    else if(floors == 1){
        alert("Make at least two floors for the lifts to move")
    }

    else
    {
        document.getElementById("prompt-box").remove();
        buildIt();
    }

}

// PENDING: reset button and regenrate button
// const regenerate = () =>{
//     document.getElementById("container").remove();
//     document.getElementById("regenerate").remove();
//     document.getElementById("reset").remove();
//     document.getElementById("pending").remove();
//     buildForm();
// }

//function to find the NEAREST idle lift
const findIdleLift = (callingFloor) => {
    let buffer = 0;
    let min = Number.MAX_SAFE_INTEGER;

    for(let i = 1 ; i <= lifts ; i++){
        
        chkLift = document.getElementById("lift"+i);
        if(chkLift.getAttribute("state") === "idle"){
            let distance = Math.abs(callingFloor - parseInt(chkLift.getAttribute("myFloor")));
            if(min>distance){
                buffer = i;
                min = distance;
            }
        }   
    }
    if(buffer>0){
        return buffer;
    }
    return null;
}

//function to find relative distance between calling floor and current floor
const findRelativeDistance = (theLift, toFloor) => {
    let myFloor = theLift.getAttribute("myFloor");
    return (Math.abs(toFloor - myFloor));
}

//function to set the state busy for the time required to travel the distance
const setBusy = (theLift , distance) => {
    if(distance === undefined){
        distance = 0;
    }
    theLift.setAttribute("state" , "busy");
    setTimeout(() => {theLift.setAttribute("state" , "idle"); console.log("liftNowidle")} , ((distance*2)+5)*1000);
}

//function to open the lift door
const openDoor = (doorId) => {
    const leftdoor = document.getElementById("door"+doorId);
    leftdoor.classList.add('open-doors');
    setTimeout(() => {leftdoor.classList.remove('open-doors')} , 2500);
}

//the function calls an idle lift to the given floor
const call = (toFloor) => {
    
            const theId = findIdleLift(toFloor);

            if(theId===null){
                //all lifts are busy
                return;
            }

            //if lift already present of the floor just open the door
            else if(Map.has(toFloor)){
                
                if(document.getElementById("lift"+(Map.get(toFloor))).getAttribute("state") === "busy"){
                    return;
                }
                else{
                queue.dequeue();
                setBusy(document.getElementById("lift"+(Map.get(toFloor)) , 0));
                openDoor(Map.get(toFloor));
                
                return;
                }
            }


            else{
                queue.dequeue();
                const callLift = document.getElementById("lift"+theId);
                const relDist = findRelativeDistance(callLift, toFloor);
                setBusy(callLift , relDist);

                if(Map.has(parseInt(callLift.getAttribute("myFloor"))))
                    Map.delete(parseInt(callLift.getAttribute("myFloor")));

                callLift.setAttribute("myfloor", toFloor);

                Map.set(toFloor,theId);
               
                callLift.style.transition = "" + relDist*2 + "s linear";
                callLift.style.transform = "translate(0,"+ -6.5*(toFloor-1) +"rem)";
                
                setTimeout(()=>{openDoor(theId)}, relDist*2*1000);
            
    }
    
}

//check every 100milliseconds for any pending requests
setInterval(() => {if(!queue.isEmpty()){
    call(queue.peek());
}}, 100);

const makeRequest = (toTheFloor) => {
    queue.enqueue(toTheFloor);
}

//dynamically building all the elements here
const buildIt = () => {

    let container = document.createElement("div");
    container.id = "container";
    body.appendChild(container);

    // PENDING: reset button and regenrate button
    // let regenerate = document.createElement("button");
    // regenerate.className = "twoButtons";
    // regenerate.id = "regenerate";
    // regenerate.innerHTML = "Regenerate";
    // regenerate.setAttribute("onclick" , "regenerate()");
    // body.appendChild(regenerate);

    // let reset = document.createElement("button");
    // reset.className = "twoButtons";
    // reset.id = "reset";
    // reset.innerHTML = "Reset";
    // reset.setAttribute("onclick" , "reset()");
    // body.appendChild(reset);

    

    let pendingLabel = document.createElement("label");
    pendingLabel.id = "pending";
    pendingLabel.innerHTML = "Number of Pending requests: 0"
    body.appendChild(pendingLabel);

    //This updates the request pending list
    setInterval(()=>{document.getElementById("pending").innerHTML = "Number of pending requests: "+queue.size()}, 100); 

    for(let i = floors ; i > 0 ; i--){

        

         //creating the Space for Lifts - 'lift-duct'
         let liftDuct = document.createElement('div');
         liftDuct.classList.add("liftDuct");
         
         
         //creating the floor div (holds buttons and liftDuct)
         let floorElement = document.createElement('div');
         floorElement.classList.add("floor");
 
         //creating lift
         if(i==1){
 
             let liftHolder = document.createElement('div')
             liftHolder.classList.add('lift-holder');
             
             for(let i = 0 ; i < lifts ; i++){
                 let lift = document.createElement('div');
                 lift.classList.add('lift');
                 lift.setAttribute("state", "idle");
                 
 
                 let liftDoorLeft = document.createElement('div');
                 liftDoorLeft.classList.add('lift-door-left');
                 liftDoorLeft.id = "door"+(i+1);
                 let liftDoorRight = document.createElement('div');
                 liftDoorRight.classList.add('lift-door-right');
                 lift.appendChild(liftDoorLeft);
                 lift.appendChild(liftDoorRight);
                 lift.id = "lift"+(i+1);
                 lift.setAttribute("myFloor" , "1");
 
                 liftHolder.appendChild(lift);
             }
             liftDuct.appendChild(liftHolder);
         }


         // creating button
        let buttonPalette = document.createElement('div');
        buttonPalette.classList.add("buttonPalette");

        let buttonUp = document.createElement('button');
        var upLogo = document.createElement('img'); upLogo.src = './Images/upBig.svg';
        buttonUp.appendChild(upLogo); 
        buttonUp.classList.add('btn');
        buttonUp.classList.add('up');
        buttonUp.setAttribute("onclick" ,  "makeRequest("+i+")");


        let buttonDown = document.createElement('button');
        let downLogo = document.createElement('img'); downLogo.src = './Images/downBig.svg';
        buttonDown.appendChild(downLogo);
        buttonDown.classList.add('btn');
        buttonDown.classList.add('down');
        buttonDown.setAttribute("onclick" ,  "makeRequest("+i+")");



        let floorId = document.createElement('floorId');
        floorId.classList.add('floorId');
        let floorNum = document.createTextNode(''+i)
        floorId.appendChild(floorNum);

       
        buttonPalette.appendChild(buttonUp);
        buttonPalette.appendChild(floorId);
        buttonPalette.appendChild(buttonDown);


        floorElement.appendChild(buttonPalette);
        floorElement.appendChild(liftDuct);
        
        container.appendChild(floorElement);

    }
};

buildForm();



