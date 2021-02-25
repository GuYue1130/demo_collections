var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy= 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile() {
    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    
    $('#grid-container').css('width',gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02 * gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }

    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j) );
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] == false;
        }
    $(".number-cell").css('line-height', cellSideLength+'px');
    $(".number-cell").css('font-size', 0.4 * cellSideLength+'px');

}

function generateOneNumber(){

    if( nospace( board ) )
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );
    
    while( true ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );
    }

    //随机一个数字
    var randNumber = Math.random() < 0.9 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}

$(document).keydown( function( event ) {
    switch( event.keyCode ) {
        case 37: //左
            event.preventDefault();
            if( moveLeft() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
            break;
        case 38: //上
            event.preventDefault();
            if( moveUp() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
            break;
        case 39: //右
            event.preventDefault();
            if( moveRight() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
            break;
        case 40: //下
            event.preventDefault();
            if( moveDown() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart' , function( event ) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend' , function( event ) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if ( Math.abs( deltax ) < 0.3 * documentWidth && Math.abs( deltay ) < 0.3 * documentWidth ) {
        return ;
    }

    if( Math.abs( deltax ) >= Math.abs( deltay )) {
        //x轴
        if( deltax > 0 ) {
            event.preventDefault();
            //向右移动
            if( moveRight() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
        } else if( deltax < 0 ){
            event.preventDefault();
            //向左移动
            if( moveLeft() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
        }
    } else {
        if( deltay > 0 ) {
            if( moveDown() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
        } else if( deltay < 0 ){
            //向上移动
            if( moveUp() ) {
                setTimeout("generateOneNumber()", 250);
                setTimeout("isgameover()", 400);
            }
        }
    }
});

function isgameover() {
    if( nospace( board ) && ( nomove( board ))) {
        gameover();
    }
}

function gameover() {
    alert(" TOT Game Over TOT ");
}

function moveLeft() {
    if( !canMoveLeft( board ) ){
        return false;
    }

    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){
                //判断是否能向左移动
                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noLeftBlock( i , k , j , board )){
                        //需要移动了
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if ( board[i][k] == board[i][j] && noLeftBlock( i , k , j , board  ) && !hasConflicted[i][k] ){
                        //移动
                        //需要相加
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j] * 2;
                        board[i][j] = 0;
                        //分数增长
                        score += board[i][k];
                        updateScore( score );
                        break;  
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if( !canMoveRight( board ) ){
        return false;
    }

    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                //判断是否能向右移动
                for( var k = 3 ; k > j ; k -- ){
                    if( board[i][k] == 0 && noRightBlock( i , k , j , board )){
                        //需要移动了
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if ( board[i][k] == board[i][j] && noRightBlock( i , k , j , board  ) && !hasConflicted[i][k] ){
                        //移动
                        //需要相加
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j] * 2;
                        board[i][j] = 0;
                        //分数增长
                        score += board[i][k];
                        updateScore( score );
                        break;  
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if( !canMoveUp( board ) ){
        return false;
    }

    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                //判断是否能向上移动
                for( var k = 0 ; k < i ; k ++ ){
                    if( board[k][j] == 0 && noUpBlock( i , k , j , board )){
                        //需要移动了
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if ( board[k][j] == board[i][j] && noUpBlock( i , k , j , board  ) && !hasConflicted[k][j] ) {
                        //移动
                        //需要相加
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j] * 2;
                        board[i][j] = 0;
                        //分数增长
                        score += board[k][j];
                        updateScore( score );
                        break;   
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if( !canMoveDown( board ) ){
        return false;
    }

    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                //判断是否能向下移动
                for( var k = 3 ; k > i  ; k -- ){
                    if( board[k][j] == 0 && noDownBlock( i , k , j , board )){
                        //需要移动了
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if ( board[k][j] == board[i][j] && noDownBlock( i , k , j , board  ) && !hasConflicted[k][j] ){
                        //移动
                        //需要相加
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j] * 2;
                        board[i][j] = 0;
                        //分数增长
                        score += board[k][j];
                        updateScore( score );
                        break;  
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}