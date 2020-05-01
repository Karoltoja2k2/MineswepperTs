import { Point } from './objects/Point'
import { Field } from './objects/Field'
import { MapGenerator } from './objects/MapGenerator';

import './styles.scss'
import Grid from './components/grid';
import Game from './components/game';

let mapGrid: Field[][];
let mapGenerator:MapGenerator;
let firstClick = true;
let gameOver = false;
let run = false;
let mouseDownField:Field;
let lmbDown = false;
let rmbDown = false;

let rows = 0;
let columns = 0;
let bombs = 0;
let chosenSize = 0;
let squareSize = 32;

let time;
let bombsRemaining;
let shownFieldsCount;
let bombCounter:HTMLHeadElement;
let timeCounter:HTMLHeadElement;

const offset:Point[] = 
[
    new Point(-1, -1), new Point(-1, 0), new Point(-1,  1),
    new Point( 0, -1),                   new Point( 0,  1),
    new Point( 1, -1), new Point( 1, 0), new Point( 1,  1)
]

const app = function(){    
    
    document.getElementById('root')!.innerHTML = Game()

    document.getElementById('newGameBtn')?.addEventListener('click', NewGame)
    document.getElementById('changeSizeBtn')!.addEventListener('click', SetLevel)
    document.getElementById('settingBtn')?.addEventListener('click', SettingsWindowOpener)
    document.getElementById('dropdown-content')?.addEventListener('mouseleave', SettingsWindowOpener)

    var nameInput = document.getElementById('nameInput')
    nameInput.addEventListener('input', SetNickname)
    var nick = window.localStorage.getItem('name')
    if (nick != null && nick.trim().length != 0){
        nameInput.value = nick        
    }


    document.getElementById('squareSizeSlider')?.addEventListener('input', SetSquareSize)
    bombCounter = document.getElementById('bombCounter')!
    timeCounter = document.getElementById('timeCounter')!
    SetLevel();
}
app();

let settingsOpen = false;

function SetNickname(event:InputEvent){
    var nick = event.target.value;
    if (nick.length < 50){
        window.localStorage.setItem('name', `${event.target.value}`)
    }
    console.log(window.localStorage.getItem('name'))
}


function SettingsWindowOpener(event){
    console.log('asd')

    if (settingsOpen){
        document.getElementById('dropdown-content')?.setAttribute('style', 'display: none;')
        settingsOpen = !settingsOpen;
    } else {
        document.getElementById('dropdown-content')?.setAttribute('style', 'display: flex;')
        settingsOpen = !settingsOpen;
    }
}


function SetSquareSize(event:InputEvent = null){
    console.log(event)

    if(event != null){
        squareSize = event.target.value
    }
    
    if(squareSize * columns + 10 < 236){
        return;
    }
    var grid = document.getElementById('grid')
    grid!.setAttribute('style', 
        `grid-template-columns: repeat(${columns}, ${squareSize}px);
         grid-template-rows: repeat(${rows}, ${squareSize}px);
         font-size: ${squareSize - 2}px`)
}

async function StartTimeCounter(){
    time = 0;
    var interval = setInterval(() => {
        if(run){
            time++;
            updateCounters();  
        } else {
            clearInterval(interval);    
        }
      }, 1000);
  };


function SetLevel(){
    console.log('asd')

    if(chosenSize < 5){
        chosenSize++;
    } else {
        chosenSize = 1
    }
    
    switch(chosenSize){
        case 1:
            SetSize(9, 9, 10)
            return;
        case 2:
            SetSize(16, 16, 40)
            return;
        case 3:
            SetSize(16, 30, 99)
            return;
        case 4:
            SetSize(38, 60, 500)
            return;
        case 5:
            SetSize(100, 60, 999)
            return;
    }


}

function updateCounters(){
    bombCounter.innerHTML = ("00" + `${bombsRemaining}`).slice(-3)
    if (time < 1000){
        timeCounter.innerHTML = ("00" + `${time}`).slice(-3);
    } else {
        timeCounter.innerHTML = "999";
    }
}

function SetSize(r:number, c:number, b:number){
    rows = r;
    columns = c;
    bombs = b;
    console.log('asd')

    SetSquareSize();
    RestartGameInfo();

    mapGrid = new Array(rows)
    for (let i = 0; i < rows; i++){
        mapGrid[i]=new Array(columns)
    }

    console.log(mapGrid)
    grid!.innerHTML = ''
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j] = new Field(i, j);
            var btn:HTMLButtonElement = mapGrid[i][j].btn
            btn.addEventListener('mousedown', MouseDown)
            btn.addEventListener('mouseup', MouseUp)
            btn.addEventListener('contextmenu', ContextMenu)
            grid!.append(btn)
        }        
    }        
    mapGenerator = new MapGenerator(rows, columns, bombs)
}

function ContextMenu(event:MouseEvent){
    event.preventDefault()
}


let temporaryShownFields:Field[] = [];
function MouseDown(event:MouseEvent){
    event.preventDefault()
    if(gameOver){
        return;
    }
    console.log(lmbDown)
    console.log(rmbDown)
    if (lmbDown || rmbDown){
        return;
    }

    var btn = event.target as Element
    var cords = btn.attributes[0].value.split('-')
    var row = parseInt(cords[0])
    var col = parseInt(cords[1])
    mouseDownField = mapGrid[row][col];
    if(event.button == 0){
        lmbDown = true;
        if(!mouseDownField.isFlag && mouseDownField.isHidden){
            mouseDownField.btn.setAttribute('class', 'shown')
        } else if (!mouseDownField.isHidden && !mouseDownField.isFlag) {
            offset.forEach(function(offpoint){
                var tempPoint = mouseDownField.pnt.Add_Point(offpoint)
                if (tempPoint.Inside_Boundries(rows, columns)){
                    var tempField:Field = mapGrid[tempPoint.row][tempPoint.col]
                    if (tempField.isHidden && !tempField.isFlag){
                        tempField.btn.setAttribute('class', 'shown')
                        temporaryShownFields.push(tempField);
                    }
                }

            })
        } 
    } else if (event.button == 2) {
        rmbDown = true;
        if(mouseDownField.isHidden){
            RmbClick(mouseDownField);
        }
    }

}

function MouseUp(event:MouseEvent){
    event.preventDefault()
    if (gameOver == true){
        return;
    }
    if (event.button == 2){
        rmbDown = false;
    }

    if (event.button == 0){
        lmbDown = false
        var btn = event.target as Element
        var cords = btn.attributes[0].value.split('-')
        var row = parseInt(cords[0])
        var col = parseInt(cords[1])
        var clickedField = mapGrid[row][col];

        if (clickedField.pnt != mouseDownField.pnt){
            if (mouseDownField.isHidden && !mouseDownField.isFlag){
                mouseDownField.btn.setAttribute('class', 'hidden')
                return;              
            } else if (!mouseDownField.isHidden && !mouseDownField.isFlag){
                    if (temporaryShownFields.length != 0){
                        temporaryShownFields.forEach(function(field){
                            field.btn.setAttribute('class', 'hidden')
                        })
                        temporaryShownFields = []
                    }
                }            
        }

        if (firstClick){
            FirstClickEvent()
        }

        if(clickedField.isHidden && !clickedField.isFlag){
            LmbClickHidden(clickedField);
            // mouseDownField.btn.removeEventListener('mouseleave', MouseLeave)
        } else if (!clickedField.isHidden) {
            LmbClickShown(clickedField);

        }

    }
}


function RestartGameInfo(){
    firstClick = true;
    run = false;
    gameOver = false;
    bombsRemaining = bombs;
    time = 0;
    shownFieldsCount = 0;
    updateCounters()
}

function NewGame(){    
    RestartGameInfo()
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j].RestartField();            
        }        
    }    
}

function FirstClickEvent(){
    firstClick = false;
    run = true;
    mapGrid = mapGenerator.GenerateMap(mouseDownField.pnt, mapGrid)
    StartTimeCounter();
}


const colors:string[] = ['lightgray', 'darkcyan', 'green', 'darkred', 'darkslateblue', 'brown', 'seagreen', 'orange', 'black']


function LmbClickHidden(clickedField:Field){
    var btn:HTMLButtonElement = clickedField.btn;
    if (clickedField.isBomb){
        btn.innerHTML = 'B'
        btn.setAttribute('class', 'bomb')
        GameOver(false);
        return;
    }
    if(clickedField.isFlag){
        return;
    }
    clickedField.isHidden = false;
    clickedField.btn.innerHTML = clickedField.nBombs == 0 ? "" : `${clickedField.nBombs}`
    clickedField.btn.setAttribute('style', `color: ${colors[clickedField.nBombs]};`)
    clickedField.btn.setAttribute('class', 'shown')

    shownFieldsCount++;

    if (clickedField.nBombs == 0){
        offset.forEach(function(offPoint){
            var tempPoint = clickedField.pnt.Add_Point(offPoint)
            if(tempPoint.Inside_Boundries(rows, columns)){
                var tempField:Field = mapGrid[tempPoint.row][tempPoint.col];
                if (tempField.isHidden == true && tempField.isFlag == false){
                    LmbClickHidden(tempField);
                }
            }
        })
    }

    if (shownFieldsCount == columns * rows - bombs)
    {
        GameOver(true);
    }
}

function LmbClickShown(clickedField:Field){
    var nearBombs = clickedField.nBombs;
    var flaggedFields = 0;
    
    var safeFields:Field[] = [];

    offset.forEach(function(offPoint){
        var tempPoint = clickedField.pnt.Add_Point(offPoint)
        if (!tempPoint.Inside_Boundries(rows, columns)){
            return;
        }

        var fieldToBeClicked = mapGrid[tempPoint.row][tempPoint.col]
        if (fieldToBeClicked.isFlag){
            flaggedFields++;
        } else if (fieldToBeClicked.isHidden){
            safeFields.push(fieldToBeClicked)
        }
    })

    if(flaggedFields == nearBombs){
        safeFields.forEach(function(fTC){
            if (fTC.isHidden){
                LmbClickHidden(fTC)
            }
        })
    } else {
        console.log(temporaryShownFields)
        if (temporaryShownFields.length != 0){
            temporaryShownFields.forEach(function(field){
                field.btn.setAttribute('class', 'hidden')
            })
        }
    }
    temporaryShownFields = []

}

export function RmbClick(clickedField:Field){
    if(clickedField.isHidden){
        if (firstClick){
            FirstClickEvent()
        }

        clickedField.isFlag = !clickedField.isFlag;
        bombsRemaining += clickedField.isFlag ? -1 : 1
        updateCounters()
        var className = clickedField.isFlag ? 'flagged' : 'hidden'
        clickedField.btn.setAttribute('class', className)
    }
}

function GameOver(succes:boolean){
    gameOver = true;
    run = false;
    console.log(`Win - ${succes}`);
    console.log(`Time - ${time}`);

}


