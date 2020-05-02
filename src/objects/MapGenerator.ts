import { Point } from "./Point"
import { Field } from "./Field"


export class MapGenerator{
    rows:number
    cols:number
    bombs:number
    offset:Point[] = 
    [
        new Point(-1, -1), new Point(-1, 0), new Point(-1,  1),
        new Point( 0, -1),                   new Point( 0,  1),
        new Point( 1, -1), new Point( 1, 0), new Point( 1,  1)
    ]

    bombCordsConst:Point[];

    constructor(rows:number, cols:number, bombs:number){
        this.rows = rows;
        this.cols = cols;
        this.bombs = bombs;
        this.bombCordsConst = this.InitBombCordsConst(this.rows, this.cols);
    }

    GenerateMap(firstClick:Point, map: any[][]) : [Field[][], Point[]]{
        var updatedMap = map.slice();
        var workBombCords = this.bombCordsConst.slice();
        var rows = this.rows;
        var cols = this.cols
        var offset = this.offset;

        workBombCords[firstClick.row * cols + firstClick.col].avoid = true;        
        var tempPoint;
        offset.forEach(function(offPoint){
            tempPoint = firstClick.Add_Point(offPoint);
            if(tempPoint.Inside_Boundries(rows, cols)){
                workBombCords[tempPoint.row * cols + tempPoint.col].avoid = true;
            }
        });

        workBombCords = workBombCords.filter(x => x.avoid === false)
        var chosenBombs = this.GenerateBombCord(workBombCords)
        chosenBombs.forEach(function(pnt){
            var fieldWithBomb:Field = updatedMap[pnt.row][pnt.col];
            fieldWithBomb.isBomb = true;
            offset.forEach(function(offPoint){
                var toAddBomb = pnt.Add_Point(offPoint)
                if(toAddBomb.Inside_Boundries(rows, cols)){
                    var fieldNeighBomb:Field = updatedMap[toAddBomb.row][toAddBomb.col]
                    fieldNeighBomb.nBombs += 1;
                }
            })
        })
        return [updatedMap, chosenBombs];
    }

    GenerateBombCord(bombCords:Point[]){
        var chosenPoints = [];

        var index;
        for (let bombCount = 0; bombCount < this.bombs; bombCount++) {
            index = this.GetRandomIndex(0, bombCords.length)
            chosenPoints.push(bombCords[index]);
            bombCords.splice(index, 1);            
        }

        return chosenPoints;
    }

    GetRandomIndex(min:number, max:number){
        return Math.floor(Math.random() * (max - min) + min)
    }




    InitBombCordsConst(rows:number, cols:number){
        var point;
        var array = [];
        for (let row = 0; row < this.rows; row++)
        {
            for (let column = 0; column < this.cols; column++)
            {
                point = new Point(row, column);
                array.push(point);
            }
        }
        return array;
    }
}