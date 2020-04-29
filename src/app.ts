import { Point } from './objects/Point'
import { Field } from './objects/Field'
import { MapGenerator } from './objects/MapGenerator';

import './styles.scss'
import Grid from './components/grid';

let mapGrid: Field[][];
let mapGenerator:MapGenerator;
let firstClick = true;

let rows = 16;
let columns = 30;
let bombs = 99;

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

    document.getElementById('root')!.innerHTML = Grid()
    var grid = document.getElementById('grid')
    document.getElementById('newGameBtn')!.addEventListener('click', NewGame)

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

const colors:string[] = ['lightgray', 'darkcyan', 'green', 'red', 'darkslateblue', 'brown', 'seagreen', 'orange', 'black']


function LmbClickHidden(clickedField:Field){
    clickedField.isHidden = false;
    var btn:HTMLButtonElement = clickedField.btn;
    if (clickedField.isBomb){
        btn.innerHTML = 'B'
        btn.setAttribute('class', 'bomb')
        GameOver(false);
        return;
    }
    clickedField.btn.innerHTML = clickedField.nBombs == 0 ? "" : `${clickedField.nBombs}`
    // clickedField.btn.setAttribute('style', `color: ${colors[clickedField.nBombs]};`)
    // clickedField.btn.style.color = `red`
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
    
}

export function RmbClick(clickedField:Field){
    if(clickedField.isHidden){
        console.log('works')
        clickedField.isFlag = !clickedField.isFlag;
        var color = clickedField.isFlag ? 'orange' : 'darkblue'
        clickedField.btn.setAttribute('style', `background: ${color};`)
    }
}

function GameOver(succes:boolean){
    NewGame();
}


