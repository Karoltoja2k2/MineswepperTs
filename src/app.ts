import { Point } from './objects/Point'
import { Field } from './objects/Field'
import { MapGenerator } from './objects/MapGenerator';

import './styles.scss'
import Game from './components/game';

let mapGrid: Field[][];
let temporaryShownFields:Field[] = [];
let bombPoints : Point[];
let mapGenerator:MapGenerator;
let firstClick = true;
let gameOver = false;
let showBombs = false;
let run = false;
let mouseDownField:Field;
let lmbDown = false;
let rmbDown = false;

let rows = 0;
let columns = 0;
let bombs = 0;
let chosenLevel = 0;
let squareSize = 32;

let time:number;
let bombsRemaining:number;
let shownFieldsCount:number;
let bombCounter:HTMLElement;
let timeCounter:HTMLElement;

let background:HTMLElement;
let grid:HTMLElement;
let slider:HTMLInputElement;
let settingsBtn:HTMLElement;
let settingsOpen = false;

const numberColors:string[] = ['lightgray', 'darkcyan', 'green', 'darkred', 'darkslateblue', 'brown', 'seagreen', 'orange', 'black']
const backGroundColors:string[] = ['#126748', '#c3df47', '#f1ce5a', '#f1a35a', '#f16c5a']


const offset:Point[] = 
[
    new Point(-1, -1), new Point(-1, 0), new Point(-1,  1),
    new Point( 0, -1),                   new Point( 0,  1),
    new Point( 1, -1), new Point( 1, 0), new Point( 1,  1)
]

const app = function(){        
    document.getElementById('root')!.innerHTML = Game()
    SetEventListeners()
    SetLevel();
}
app();

function SetEventListeners(){
    grid = document.getElementById('grid')!
    background = document.getElementById('background')!
    document.getElementById('newGameBtn')?.addEventListener('click', NewGame)
    document.getElementById('changeSizeBtn')!.addEventListener('click', SetLevel)
    settingsBtn = document.getElementById('settingsBtn')!
    settingsBtn.addEventListener('mouseenter', SettingsWindowOpener)
    SettingsWindowOpener()
    document.getElementById('dropdown-content')?.addEventListener('mouseleave', SettingsWindowOpener)

    var nameInput = document.getElementById('nameInput')! as HTMLInputElement
    nameInput.addEventListener('input', e => {SetNickname})
    var nick = window.localStorage.getItem('name')
    if (nick != null && nick.trim().length != 0){
        nameInput.value = nick
    }
    slider = document.getElementById('squareSizeSlider')! as HTMLInputElement
    slider.addEventListener('input', SetSquareSize)
    bombCounter = document.getElementById('bombCounter')!
    timeCounter = document.getElementById('timeCounter')!
}

function SetLevel(){
    if(chosenLevel < 5){
        chosenLevel++;
    } else {
        chosenLevel = 1
    }     
    background.style.background = backGroundColors[chosenLevel - 1]; 
    switch(chosenLevel){
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
            SetSize(16, 30, 200)
            return;
        case 5:
            SetSize(32, 60, 500)
            return;
    }
}

function SetSize(r:number, c:number, b:number){
    rows = r;
    columns = c;
    bombs = b;
    SetSquareSize();
    RestartGameInfo();
    mapGrid = new Array(rows)
    for (let i = 0; i < rows; i++){
        mapGrid[i]=new Array(columns)
    }
    grid.innerHTML = ''
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j] = new Field(i, j);
            var btn:HTMLButtonElement = mapGrid[i][j].btn
            btn.addEventListener('mousedown', MouseDown)
            btn.addEventListener('mouseup', MouseUp)
            btn.addEventListener('contextmenu', ContextMenu)
            grid.append(btn)
        }        
    }        
    mapGenerator = new MapGenerator(rows, columns, bombs)
}


function RestartGameInfo(){
    firstClick = true;
    run = false;
    gameOver = false;
    showBombs = false;
    bombsRemaining = bombs;
    time = 0;
    shownFieldsCount = 0;
    updateCounters()
}

function NewGame(){    
    RestartGameInfo()
    if (!settingsOpen){
        settingsBtn.style.display = 'block';
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j].RestartField();            
        }        
    }    
}

function FirstClickEvent(){
    firstClick = false;
    run = true;
    [mapGrid, bombPoints] = mapGenerator.GenerateMap(mouseDownField.pnt, mapGrid)
    settingsBtn.style.display = 'none'
    StartTimeCounter();
}

function GameOver(succes:boolean){
    if (!settingsOpen){
        settingsBtn.style.display = 'block';
    }
    gameOver = true;
    run = false;  
    showBombs = true;
    var style = succes ? 'bomb-defused' : 'bomb'
    ShowAllBombs(style)
}

function ShowAllBombs(style:string){
    var i = 0;
    var interval2 = setInterval(() => {
        if(showBombs == false || i >= bombPoints.length){
            clearInterval(interval2);    

        } else {
            var point = bombPoints[i]
            mapGrid[point.row][point.col].btn.setAttribute('class', style)
            console.log(i)
            i++;
        }
    }, 1);
}

function StartTimeCounter(){
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

function updateCounters(){
    if (bombsRemaining < 0 && bombsRemaining > -10){
        bombCounter.innerHTML = ("-0" + `${bombsRemaining * -1}`)
    } else if (bombsRemaining <= -10){
        bombCounter.innerHTML = ("-" + `${bombsRemaining * -1}`)        
    } else if (bombsRemaining < -99){
        bombCounter.innerHTML = ("-99")
    } else if (bombsRemaining >= 0){
        bombCounter.innerHTML = ("00" + `${bombsRemaining}`).slice(-3)
    }

    if (time < 1000){
        timeCounter.innerHTML = ("00" + `${time}`).slice(-3);
    } else {
        timeCounter.innerHTML = "999";
    }
}

function SetNickname(event?:InputEvent){
    var elem = <HTMLInputElement>event!.target;
    if (elem.value.length < 50){
        window.localStorage.setItem('name', `${elem.value}`)
    }
    console.log(window.localStorage.getItem('name'))
}

function SettingsWindowOpener(event?:MouseEvent){
    if (!settingsOpen){
        document.getElementById('dropdown-content')?.setAttribute('style', 'display: flex;')
        settingsBtn.style.display = 'none'
        settingsOpen = !settingsOpen;
    } else {
        document.getElementById('dropdown-content')?.setAttribute('style', 'display: none;')
        settingsBtn.style.display = 'block'
        settingsOpen = !settingsOpen;
    }
}

function SetSquareSize(event?:Event){
    squareSize = parseInt(slider.value)
    if(squareSize * columns + 10 < 236){        
        squareSize = 226 / columns;
        if(event){
            return;
        }
    } else if (squareSize * columns + 20 > window.innerWidth) {
        squareSize = Math.floor((window.innerWidth - 20) / columns);

        if(event){
            return;
        }  
    }

    var grid = document.getElementById('grid')
    grid!.setAttribute('style', 
        `grid-template-columns: repeat(${columns}, ${squareSize}px);
         grid-template-rows: repeat(${rows}, ${squareSize}px);
         font-size: ${squareSize - 2}px`)
}


// MOUSE EVENT HANDLERS AND CLICK METHODS

function ContextMenu(event:MouseEvent){
    event.preventDefault()
}

function MouseDown(event:MouseEvent){
    event.preventDefault()
    if(gameOver){
        return;
    }
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
function LmbClickHidden(clickedField:Field){
    var btn:HTMLButtonElement = clickedField.btn;
    if (clickedField.isBomb){
        btn.setAttribute('class', 'bomb')
        GameOver(false);
        return;
    }
    if(clickedField.isFlag){
        return;
    }
    clickedField.isHidden = false;
    clickedField.btn.innerHTML = clickedField.nBombs == 0 ? "" : `${clickedField.nBombs}`
    clickedField.btn.setAttribute('style', `color: ${numberColors[clickedField.nBombs]};`)
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

function RmbClick(clickedField:Field){
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