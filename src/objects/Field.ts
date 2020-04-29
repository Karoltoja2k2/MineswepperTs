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
        this.btn = this.CreateFieldButton(this.pnt)
        this.isBomb = false
        this.isFlag = false
        this.isHidden = true
        this.nBombs = 0
    }

    RestartField(){
        this.isBomb = false
        this.isFlag = false
        this.isHidden = true
        this.nBombs = 0
        this.btn.setAttribute('class', 'hidden')
        this.btn.setAttribute('style', '')
        this.btn.innerHTML = '';
    }

    CreateFieldButton(pnt:Point){
        var btn = document.createElement('button');
        btn.setAttribute('id', pnt.ToString())
        btn.setAttribute('class', 'hidden')
        return btn;
    }
}