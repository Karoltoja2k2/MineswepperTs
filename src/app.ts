import { Point } from './objects/Point'
import { Field } from './objects/Field'
import { MapGenerator } from './objects/MapGenerator';

import './styles.scss'
import Grid from './components/grid';
import Game from './components/game';

let mapGrid: Field[][];
let mapGenerator:MapGenerator;
let firstClick = true;

let rows = 9;
let columns = 9;
let bombs = 10;
let chosenSize = 1;

const offset:Point[] = 
[
    new Point(-1, -1), new Point(-1, 0), new Point(-1,  1),
    new Point( 0, -1),                   new Point( 0,  1),
    new Point( 1, -1), new Point( 1, 0), new Point( 1,  1)
]

const app = function(){    
    
    mapGrid = new Array(rows)
    for (let i = 0; i < rows; i++){
        mapGrid[i]=new Array(columns)
    }

    document.getElementById('root')!.innerHTML = Game()
    var grid = document.getElementById('grid')
    grid?.setAttribute('class', `grid${chosenSize}`)
    document.getElementById('newGameBtn')?.addEventListener('click', NewGame)
    document.getElementById('changeSizeBtn')!.addEventListener('click', ChangeSize)

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j] = new Field(i, j);
            var btn:HTMLButtonElement = mapGrid[i][j].btn
            btn.addEventListener('click', MouseClick)
            btn.addEventListener('contextmenu', MouseClick)
            grid!.append(btn)
        }        
    }        
    mapGenerator = new MapGenerator(rows, columns, bombs)
}

app();

function ChangeSize(){
    if(chosenSize < 5){
        chosenSize++;
    } else {
        chosenSize = 1
    }

    console.log(chosenSize)
    
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

function SetSize(r:number, c:number, b:number){
    rows = r;
    columns = c;
    bombs = b;

    var grid = document.getElementById('grid')
    grid?.setAttribute('class', `grid${chosenSize}`)

    mapGrid = new Array(rows)
    for (let i = 0; i < rows; i++){
        mapGrid[i]=new Array(columns)
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j] = new Field(i, j);
            var btn:HTMLButtonElement = mapGrid[i][j].btn
            btn.addEventListener('click', MouseClick)
            btn.addEventListener('contextmenu', MouseClick)
            grid!.append(btn)
        }        
    }        
    mapGenerator = new MapGenerator(rows, columns, bombs)
}

function NewGame(){
    firstClick = true;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            mapGrid[i][j].RestartField();            
        }        
    }    
}


export function MouseClick(event:MouseEvent){
    event.preventDefault()

    var btn = event.target as Element
    var cords = btn.attributes[0].value.split('-')
    var row = parseInt(cords[0])
    var col = parseInt(cords[1])

    if (firstClick){
        firstClick = false;
        mapGrid = mapGenerator.GenerateMap(new Point(row, col), mapGrid)
    }

    var lmb = event.button == 0 ? true : false;
    var clickedField:Field = mapGrid[row][col]

    if(lmb){
        if(clickedField.isHidden == true && clickedField.isFlag == false){
            LmbClickHidden(clickedField);
        } else {
            LmbClickShown(clickedField)
        }
    } else {
        RmbClick(clickedField)
    }

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
    }
}

export function RmbClick(clickedField:Field){
    if(clickedField.isHidden){
        clickedField.isFlag = !clickedField.isFlag;
        var className = clickedField.isFlag ? 'flagged' : 'hidden'
        clickedField.btn.setAttribute('class', className)
    }
}

function GameOver(succes:boolean){
    NewGame();
}


