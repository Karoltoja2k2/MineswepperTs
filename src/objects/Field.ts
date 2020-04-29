import { Point } from "./Point";

export class Field{
    pnt:Point
    btn:HTMLButtonElement
    isBomb:boolean
    isFlag:boolean
    isHidden:boolean
    nBombs:number
    
    constructor(row:number, col:number){
        this.pnt = new Point(row, col)
        this.btn = document.createElement('button')
        this.isBomb = false
        this.isFlag = false
        this.isHidden = true
        this.nBombs = 0
    }
}