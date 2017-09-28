class Control {
    constructor(){
        this.score = 0;//分数
        this.dot = [[]];//记录地图坐标，dot[x][y]=0，表示坐标(x,y)没有块，否则有块
        this.lose = 0;
    }

    init(){ //初始化地图坐标
        for(let i = 0;i<COLS;i++){
            this.dot[i] = [];
            for(let j = 0;j<=ROWS;j++){
                if(j === ROWS) this.dot[i][j] = 1;
                else this.dot[i][j] = 0;
            }
        }
    }

    checkDown(){
        for(let i in shapes.nowDot){
            let x = shapes.nowDot[i][0];
            let y = shapes.nowDot[i][1] + 1;
            if(this.dot[x][y] !== 0) return 0;
        }
        return 1;
    }
    checkLeft(){
        for(let i in shapes.nowDot){
            let x = shapes.nowDot[i][0] - 1;
            let y = shapes.nowDot[i][1];
            if(x < 0 || this.dot[x][y] !== 0) return 0;
        }
        return 1;
    }
    checkRight(){
        for(let i in shapes.nowDot){
            let x = shapes.nowDot[i][0] + 1;
            let y = shapes.nowDot[i][1];
            if(x >= COLS || this.dot[x][y] !== 0) return 0;
        }
        return 1;
    }
    checkChange(){//检查是否可以变换，方法是假如变换了，是否块坐标对应的地图坐标为1或出边界，若有则无法变换
        let x = shapes.nowCenter[0];
        let y = shapes.nowCenter[1];
        let t = (shapes.state + 1) % 4;
        let nextDot;
        nextDot = shapes.getDot(x,y,shapes.type,t);
        for(let i in nextDot){
            let x = nextDot[i][0];
            let y = nextDot[i][1];
            if( x < 0 || x > COLS-1 || y > ROWS-1 || this.dot[x][y] !== 0) return 0;
        }
        return 1;
    }
    paint(){//依照地图坐标重绘地图
        $(".wrapper .already").remove();
        for(let i = 0;i < COLS;i++){
            for(let j = 0;j < ROWS;j++){
                if(this.dot[i][j] != 0){
                    shapes.dotToReal(i,j);
                    $(".wrapper").append("<div class='already' style='width:"+SQUAREW+"px;height:"+SQUAREH+"px;position:absolute;top:"+shapes.realY+"px;left:"+shapes.realX+"px;'></div>");
                }
            }
        }
    }
    checkDel(){//消行
        let from = ROWS - 1;
        for(from;from > 0;from--){
            let flag = 0;
            for(let j = 0;j < COLS;j++){
                if(this.dot[j][from] === 0){
                    flag = 1;//有0存在则不可消
                    break;
                }
            }
            if(flag == 0){//可消行
                this.score++;
                for(let i = 0;i < COLS;i++){
                    this.dot[i].splice(from,1);
                    this.dot[i].splice(0,0,0);
                }
                from++;//回退
            }
        }
        this.paint();//重绘
        $(".score").text("得分:"+this.score+"分");
    }
    moveNext(){//下移方块
        if(this.checkDown()) {
            shapes.moveDown();
        } else{//不可移了
            for(let i in shapes.nowDot){
                let x = shapes.nowDot[i][0];
                let y = shapes.nowDot[i][1];
                this.dot[x][y] = 1;
                if(y === 0){
                    clearInterval(speed);
                    alert('你输了');
                    state = 0;
                    return;
                }
            }
            this.checkDel();//检测消行
            shapes.type = shapes.nextType;
            shapes.nextType = Math.round(Math.random() * 6);//重新产生方块
            shapes.showOther(4,0);
            shapes.nextShow(COLS+3,0,0);
        }
    }
    run(){
        speed = setInterval(()=>{
            this.moveNext()
        },everyTime);
    }
    start(){//开始游戏
        shapes.nextShow(COLS+3,0,0);
        shapes.type = Math.round(Math.random());
        shapes.showOther(4,0);
        this.init();
        this.paint();
        this.run();
    }
    restart(){//重新开始
        speed = setInterval(()=>{
            this.moveNext()
        },everyTime);
    }
    pause(){
        clearInterval(speed);
    }
}

var shapesControl = new Control();


$(document).keydown(function(event){
    if(event.keyCode == 37) {
        if(shapesControl.checkLeft()) {
            shapes.moveLeft();
        }
    }
    else if(event.keyCode == 39) {
        if(shapesControl.checkRight()) {
            shapes.moveRight();
        }
    }
    else if(event.keyCode == 38) {
        if(shapesControl.checkChange()) {
            shapes.change();
        }
    }
    else if(event.keyCode == 40){
        shapesControl.moveNext();
    }
    if(event.keyCode == 13) {
        SQUAREH = HEIGHT / ROWS;//块的高度
        SQUAREW = WIDTH / COLS;//每块宽度
        if(state == 0){
            shapesControl.start();
            state = 1;
        } else if(state == 1){
            shapesControl.pause();
            state = 2;
        } else{
            shapesControl.restart();
            state = 1;
        }
    }
});