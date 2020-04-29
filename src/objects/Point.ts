export class Point {
    col: number;
    row: number;
    avoid:boolean;
    constructor(row: number, column: number){
        this.col = column;
        this.row = row;
        this.avoid = false; 
    }

    Add_Point(toAdd: Point){
        return new Point(this.row + toAdd.row, this.col + toAdd.col)
    }

    Inside_Boundries(rows:number, columns:number){
        if(this.row < 0 || this.row >= rows || this.col < 0 || this.col >= columns){
            return false;
        } 
        return true;
    }

    ToString(){
        return `${this.row}-${this.col}`
    }
}