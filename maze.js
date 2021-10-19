let maze = document.querySelector(".maze");
let con = maze.getContext('2d');

let current;

class Maze{
    constructor(size, rows, columns){
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    setup(){
        for(let r=0; r<this.rows; r++){
            let row = [];
            for(let c=0; c<this.columns; c++){
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }


    draw(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        current.visited = true;

        for(let r=0; r<this.rows; r++){
            for(let c=0; c<this.columns; c++){
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }

        let next = current.checkNeighbours();

        if(next){
            next.visited = true;

            this.stack.push(current);
            
            current.highlight(this.columns);

            current.removeWalls(current, next);

            current = next;
        }
        else if(this.stack.length>0){
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }

        if(this.stack.length == 0){
            return;
        }

        window.requestAnimationFrame(() => {
            this.draw();
        })
    }
}

class Cell{
    constructor(rowNum, colNum, parentGrid, parentSize){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall : true,
            rightWall : true,
            bottomWall : true,
            leftWall : true,
        };
    }

    checkNeighbours(){
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];

        let top = row !== 0 ? grid[row-1][col] : undefined;
        let right = col !== grid.length-1 ? grid[row][col+1] : undefined;
        let bottom = row !== grid.length-1 ? grid[row+1][col] : undefined;
        let left = col !== 0 ? grid[row][col-1] : undefined;

        if(top && !top.visited) neighbours.push(top);
        if(right && !right.visited) neighbours.push(right);
        if(bottom && !bottom.visited) neighbours.push(bottom);
        if(left && !left.visited) neighbours.push(left);

        if(neighbours.length !== 0){
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        }
        else{
            return undefined;
        }
    }


    drawTopWall(x, y, size, columns, rows){
        con.beginPath();
        con.moveTo(x,y);
        con.lineTo(x + size / columns, y);
        con.stroke();
    }

    drawRightWall(x, y, size, columns, rows){
        con.beginPath();
        con.moveTo(x + size / columns,y);
        con.lineTo(x + size / columns, y + size / rows);
        con.stroke();
    }

    drawBottomWall(x, y, size, columns, rows){
        con.beginPath();
        con.moveTo(x,y + size / rows);
        con.lineTo(x + size / columns, y + size / rows);
        con.stroke();
    }

    drawLeftWall(x, y, size, columns, rows){
        con.beginPath();
        con.moveTo(x,y);
        con.lineTo(x, y + size / rows);
        con.stroke();
    }

    highlight(columns){
        let x = (this.colNum * this.parentSize) / columns+1;
        let y =(this.rowNum * this.parentSize) / columns+1;

        con.fillStyle = 'purple';
        con.fillRect(x, y, this.parentSize/columns-3, this.parentSize/columns-3);
    }

    removeWalls(cell1, cell2){
        let x = (cell1.colNum - cell2.colNum);

        if(x == 1){
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        }
        else if(x == -1){
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        let y = (cell1.rowNum - cell2.rowNum);

        if(y == 1){
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        }
        else if(y == -1){
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    show(size, rows, columns){
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;

        con.strokeStyle = "white";
        con.fillStyle = "black";
        con.lineWidth = 2;

        if(this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
        if(this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
        if(this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
        if(this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
        if(this.visited){
            con.fillRect(x+1, y+1, size/columns-2, size/rows-2);
        }
    }
}

let newMaze = new Maze(500, 10, 10);
newMaze.setup();
newMaze.draw();