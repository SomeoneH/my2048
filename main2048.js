
var board = new Array();
var score = 0;
var hasconflicted = new Array();
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {
    if (documentWidth > 500){
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSideSpace = 20;
    }
    $("#grid-container").css("width", gridContainerWidth - 2 * cellSideSpace);

    $("#grid-container").css("width", gridContainerWidth - 2 * cellSideSpace);
    $("#grid-container").css("height", gridContainerWidth - 2 * cellSideSpace);
    $("#grid-container").css("padding", cellSideSpace);
    $("#grid-container").css("border-radius", 0.02 * gridContainerWidth);

    $(".grid-cell").css("width", cellSideLength);
    $(".grid-cell").css("height", cellSideLength);
    $(".grid-cell").css("border-radius", 0.04 * cellSideLength);
}

function test() {
    Math.random();
}

function newgame() {
    //分数清零
    score = 0 ;
	updateScore(score);
	// $("#score").text(score);
	// document.getElementById("score").innerHTML=0;
    //初始化棋盘
    init();
    //随机在两个格子上生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for( var i = 0; i < 4; i++){
        for ( var j = 0; j < 4; j++){
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top" , getPosTop(i,j));
            gridCell.css("left" , getPosLeft(i,j));
            // var gridCell = document.getElementById("grid-cell-" + i + "-" + j);
            // gridCell.style.top = (20+i*120)+"px";
            // gridCell.style.left = (20+j*120)+"px";
        }
    }
    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        hasconflicted[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasconflicted[i][j] = false;
        }
    }
    updateBoardView();
}

function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");
            var numberCellDiv = $("#number-cell-" + i +"-" + j);

            if (board[i][j] == 0){
                numberCellDiv.css("width","0px");
                numberCellDiv.css("height","0px");
                numberCellDiv.css("top",getPosTop(i,j) + cellSideLength / 2);
                numberCellDiv.css("left",getPosLeft(i,j) + cellSideLength / 2);
            }

            else{
                numberCellDiv.css("width",cellSideLength);
                numberCellDiv.css("height",cellSideLength);
                numberCellDiv.css("top",getPosTop(i,j));
                numberCellDiv.css("left",getPosLeft(i,j));
                numberCellDiv.text(board[i][j]);
                // numberCellDiv.textContent = "board[i][j]";
                numberCellDiv.css("background-color",getBackgroundColor(board[i][j]));
                numberCellDiv.css("color",getNumberColor(board[i][j]));
            }
            hasconflicted[i][j] = false;
            }
        }
    $(".number-cell").css("line-height", cellSideLength + "px");
    $(".number-cell").css("font-size", 0.6 * cellSideLength + "px");
}

function generateOneNumber() {
    if (nospace(board))
        return false;
    //随机一个位置
    var randX = parseInt(Math.floor(Math.random()*4));
    var randY = parseInt(Math.floor(Math.random()*4));
    //死循环的方式在格子很少的时候，容易让程序变得卡顿，这里改成先循环固定次数的随机值，假如找不到空位置的情况下再遍历查找的方式；
    // while (true)
    var times = 0;
    while (times < 50) {
        if (board[randX][randY] == 0)
            break;
         randX = parseInt(Math.floor(Math.random()*4));
         randY = parseInt(Math.floor(Math.random()*4));

         times ++;
    }
    if (times == 50)
        for (var i =0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if (board[i][j] == 0){
                    randX = i;
                    randY = j;
                };

    //随机一个数字（2和4各50%）
    var ranNumber = Math.random() < 0.5? 2:4;
    //在随机位置显示这个随机数字
    board[randX][randY] = ranNumber;
    showNumberWithAnimation(randX, randY, ranNumber);
    return true;
}

$(document).keydown( function(event) {
    // if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)
    //     event.preventDefault();
    //
    switch ( event.keyCode ) {
        case 37:  //left
            event.preventDefault();
            if (moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38:   //up
            event.preventDefault();
            if (moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39:   //right
            event.preventDefault();
            if (moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40:   //down
            event.preventDefault();
            if (moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default :   // No motion
            break;
    }
});

document.addEventListener("touchstart", function(event){
   startx = event.touches[0].pageX;
   starty = event.touches[0].pageY;
});

document.addEventListener("touchend", function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;

    if (Math.abs(deltax) < 0.05 * documentWidth && Math.abs(deltay) < 0.05 * documentWidth)
        return;
    //X方向上的划动
    if (Math.abs(deltax) >= Math.abs(deltay)){

        if (endx - startx > 0){
            //向右划动
            if (moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{
            //向左划动
            if (moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
    //y方向上的划动
    else{
        if (endy - starty > 0){
            //向下划动
            if (moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{
            //向上划动
            if (moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
});

function isGameOver() {
    if (nospace(board) && nomove(board)){
        gameOver();
    }
    // console.log("还能玩");
};

function gameOver() {
    alert("哎呀!完了鸭");
}

//向左移动
function moveLeft() {
    if (!canMoveLeft( board )){
        return false;
    }
    else {
        //moveleft
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0){
                //针对有数字的块进行判定循环
                for (var k = 0; k < j; k++){
                    if (board[i][k] == 0 && noBlockHorizontal (i,k,j,board)) {
                        //move
                        showMoveAnimation(i , j , i , k);
                        board[i][k] = board[i][j];
                        // console.log("数字变更了")
                        board[i][j] = 0;
                        // console.log("数字归零了")
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal (i,k,j,board) && !hasconflicted[i][k]){
                        //move
                        showMoveAnimation(i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasconflicted[i][j] = true;
                        continue;
                        }
                    }
        }
        setTimeout("updateBoardView()",200);
        return true;
    }
};
//向上移动
function moveUp() {
    if (!canMoveUp(board)){
        return false;
    }
    else{
        //moveup
        for (var i = 1; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if (board[i][j] != 0){
                    for (var k = 0; k < i; k++)
                        if (board[k][j] == 0 && noBlockvertical(k, i, j, board)){
                        // if (board[k][j] == 0 && noBlockHorizontal(k, j, i, board)){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if (board[k][j] == board[i][j] && noBlockvertical(k,i,j,board) && !hasconflicted[k][j]){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateScore(score);
                            hasconflicted[k][j] = true;
                            continue;
                        }
                }
        setTimeout("updateBoardView()",200);
        return true;
    }
};
//向右移动
function moveRight() {
    if (!canMoveRight()){
        return false;
    }
    else {
        for (var i = 0; i < 4; i++)
            for (var j = 2; j >= 0; j--)
                if (board[i][j] != 0)
                    for (var k = 3; j < k; k--){
                        if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasconflicted[i][k]){
                            showMoveAnimation(i, j, i, k);
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            score += board[i][k];
                            updateScore(score);
                            hasconflicted[i][k] = true;
                            continue;
                        }
                    }
        setTimeout("updateBoardView()",200);
        return true;
    }
};
//向下移动
function moveDown() {
    if (!canMoveDown(board)){
        return false;
    }
    else{
        // for (var i = 0; i < 3; i++)
        //     for (var j = 0; j <4; j++)
            for (var j = 0; j < 4; j++)
                for (var i = 2; i >= 0; i--)
                if (board[i][j] != 0)
                    // for (var k = i+1; k < 4; k++)
                    for (var k = 3; i < k; k--)
                        if (board[k][j] == 0 && noBlockvertical(i, k, j, board)){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if (board[k][j] == board[i][j] && noBlockvertical(i, k, j, board) && !hasconflicted[k][j]){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateScore(score);
                            hasconflicted[k][j] = true;
                            continue;
                        }
        setTimeout("updateBoardView()",200);
        return true;
    }
};

