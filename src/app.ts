import { Point } from './objects/Point'
import { Field } from './objects/Field'
import { MapGenerator } from './objects/MapGenerator';

var rows = 16;
var columns = 30;
var bombs = 99;


var mapGrid = new Array(rows)
for (let i = 0; i < rows; i++){
    mapGrid[i]=new Array(columns)
}

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        mapGrid[i][j] = new Field(i, j);
    }
    
}

var mapGenerator:MapGenerator = new MapGenerator(rows, columns, bombs)

mapGrid = mapGenerator.GenerateMap(new Point(0,0), mapGrid)
