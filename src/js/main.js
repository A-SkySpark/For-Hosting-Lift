let floors = prompt("Enter the number of floors you want.");

let container = document.getElementById("container");



    for(let i = floors ; i > 0 ; i--){

        //creating the Buttons for calling the lift
        let buttonPalette = document.createElement('div');
        buttonPalette.classList.add("buttonPalette");

        let buttonUp = document.createElement('button');
        var upLogo = document.createElement('img'); upLogo.src = './Images/upBig.svg';
        upLogo.classList.add('arrow');
        buttonUp.appendChild(upLogo);
        
        buttonUp.classList.add('btn');
        buttonUp.classList.add('up');
        let buttonDown = document.createElement('button');
        let downLogo = document.createElement('img'); downLogo.src = './Images/downBig.svg';
        buttonDown.appendChild(downLogo);
        buttonDown.classList.add('btn');
        buttonDown.classList.add('down');

        let floorId = document.createElement('floorId');
        floorId.classList.add('floorId');
        let floorNum = document.createTextNode(''+i)
        floorId.appendChild(floorNum);

        buttonPalette.appendChild(floorId);
        buttonPalette.appendChild(buttonUp);
        buttonPalette.appendChild(buttonDown);
        

        //creating the Space for Lifts - 'lift-duct'
        let liftDuct = document.createElement('div');
        liftDuct.classList.add("liftDuct");
        
        
        //creating the floor div (holds buttons and liftDuct)
        let floorElement = document.createElement('div');
        floorElement.classList.add("floor");
        floorElement.appendChild(buttonPalette);
        floorElement.appendChild(liftDuct);


        container.appendChild(floorElement);


        // let divElementText = document.createTextNode('floor'+i)
        // divElement.appendChild(divElementText)
    }