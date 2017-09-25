/**
 * Created by suchuan on 2017/9/24.
 */

    //把界面划分为坐标系
let WIDTH = 500;
    HEIGHT = 500,
    ROWS = 25,
    COLS = 25,
    SQUAREH = 0,
    SQUAREW = 0;


let speed,//interval对象
    everyTime = 2000,//速度
    state = 0;//游戏状态

class Model {
    constructor(){
        this.nowDot = [];//方块的当前坐标数组，二维数组
        this.state = 0;//方块的初始状态，依此变换方块
        this.type = 0;//方块的种类
        this.nextType = Math.round(Math.random() * 6);//下一个方块种类
        this.nowCenter = []; //方块的中心坐标
    }
    dotToReal(x,y){//每个点实际的坐标
        this.realX = x * SQUAREW;
        this.realY = y * SQUAREH;
    }
    show(x,y,i,is_next){//is_next标识是否是预测块显示
        this.dotToReal(x,y);
        if(i == 0){
            if(is_next == 1) {
                $(".next").remove();
            } else {
                $(".wrapper .moving").remove();
            }
        }
        if(is_next == 1) {
            $(".wrapper").append("<div class='next' style='width:"+SQUAREW+"px;height:"+SQUAREH+"px;position:absolute;top:"+this.realY+"px;left:"+this.realX+"px;'></div>");
        } else {
            $(".wrapper").append("<div class='moving' style='width:"+SQUAREW+"px;height:"+SQUAREH+"px;position:absolute;top:"+this.realY+"px;left:"+this.realX+"px;'></div>");
        }
    }
    getDot(x,y,type,t){//此函数是依照当前方块的种类，由中心坐标得到给出返回四个坐标的数组
        var nowDot;
        switch(type){
            case 0:
                if(t === 0) nowDot = [[x-1,y],[x,y],[x+1,y],[x,y+1]];
                else if(t === 1) nowDot = [[x-1,y],[x,y-1],[x,y],[x,y+1]];
                else if(t === 2) nowDot = [[x-1,y],[x,y-1],[x,y],[x+1,y]];
                else if(t === 3) nowDot = [[x,y-1],[x,y],[x,y+1],[x+1,y]];
                break;
            case 1:
                if(t === 0 || t === 2) nowDot = [[x-1,y],[x,y],[x+1,y],[x+2,y]];
                else if(t === 1 || t ===3) nowDot = [[x,y-1],[x,y],[x,y+1],[x,y+2]];
                break;
            case 2:
                if(t === 0) nowDot = [[x-1,y],[x,y],[x,y+1],[x,y+2]];
                if(t === 1) nowDot = [[x-2,y],[x-1,y],[x,y],[x,y-1]];
                if(t === 2) nowDot = [[x,y-1],[x,y],[x,y+1],[x+1,y+1]];
                if(t === 3) nowDot = [[x,y+1],[x,y],[x+1,y],[x+2,y]];
                break;
            case 3:
                if(t === 0) nowDot = [[x+1,y],[x,y],[x,y+1],[x,y+2]];
                if(t === 1) nowDot = [[x-2,y],[x-1,y],[x,y],[x,y+1]];
                if(t === 2) nowDot = [[x,y-1],[x,y],[x,y+1],[x-1,y+1]];
                if(t === 3) nowDot = [[x,y-1],[x,y],[x+1,y],[x+2,y]];
                break;
            case 4:
                nowDot = [[x,y],[x+1,y],[x,y+1],[x+1,y+1]];
                break;
            case 5:
                if(t === 0 || t === 2) nowDot = [[x-1,y],[x,y],[x,y+1],[x+1,y+1]];
                if(t === 1 || t === 3) nowDot = [[x,y+1],[x,y],[x+1,y],[x+1,y-1]];
                break;
            case 6:
                if(t === 0 || t === 2) nowDot = [[x+1,y],[x,y],[x,y+1],[x-1,y+1]];
                if(t === 1 || t === 3) nowDot = [[x,y-1],[x,y],[x+1,y],[x+1,y+1]];
                break;
        }
        return nowDot;
    }

    getNowDot(){ //由中心坐标得到当前的四个坐标
        let x = this.nowCenter[0];
        let y = this.nowCenter[1];
        let t = this.state % 4;
        this.nowDot = this.getDot(x,y,shapes.type,t);
    }

    showOther(x,y){//x,y是中心坐标，显示由中心坐示代表的方块
        this.nowCenter = [x,y];
        this.getNowDot();
        let i=0;
        for(i;i<this.nowDot.length;i++){
            shapes.show(this.nowDot[i][0],this.nowDot[i][1],i,0);
        }
    }

    nextShow(x,y,t){ //显示预测块
        let nextDot = this.getDot(x,y,shapes.nextType,t);
        let i;
        for(i in nextDot){
            shapes.show(nextDot[i][0],nextDot[i][1],i,1);
        }
    }

    moveLeft(){//方块向左移动一格，只需将中心坐标向左移动一格即可
        let x = this.nowCenter[0];
        let y = this.nowCenter[1];
        this.showOther(x-1,y);
    }

    moveRight(){
        let x = this.nowCenter[0];
        let y = this.nowCenter[1];
        this.showOther(x+1,y);
    }

    moveDown(){
        let x = this.nowCenter[0];
        let y = this.nowCenter[1];
        this.showOther(x,y+1);
    }

    change(){
        this.state++;//方块状态+1
        let x = this.nowCenter[0];
        let y = this.nowCenter[1];
        this.showOther(x,y);
    }
}
var shapes = new Model();