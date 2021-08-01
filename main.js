   
// ---------Board Representation
var boardSquares = [];
for (var i=0;i<=64;i++) {
boardSquares[i]=0;
        var squareX=(i % 8);
        var squareY = Math.floor(i/8);
        if((squareY==6)){
            boardSquares[i]=1;
       }
       if((squareY==1)){
            boardSquares[i]=7;
       }
       switch(i) {
    case 0:case 7:
    boardSquares[i]=10;break;
    case 1:case 6:
    boardSquares[i]=9;break;
    case 2:case 5:
    boardSquares[i]=8;break;

    case 63:case 56:
    boardSquares[i]=4;break;
    case 62:case 57:
    boardSquares[i]=3;break;
    case 61:case 58:
    boardSquares[i]=2;break;
    
    case 59:
    boardSquares[i]=5;break;
    case 60:
    boardSquares[i]=6;break;
    case 3:
    boardSquares[i]=11;break;
    case 4:
    boardSquares[i]=12;break;
    
       }
    }
    function boardSquaresReversed(){
        var reversed = [];
        for (var i=0;i<=63;i++) {
            switch(boardSquares[i]){
                case 0: reversed.unshift(0); break;
                case 1: reversed.unshift(7); break;
                case 2: reversed.unshift(8); break;
                case 3: reversed.unshift(9); break;
                case 4: reversed.unshift(10); break;
                case 5: reversed.unshift(11); break;
                case 6: reversed.unshift(12); break;
                case 7: reversed.unshift(1); break;
                case 8: reversed.unshift(2); break;
                case 9: reversed.unshift(3); break;
                case 10: reversed.unshift(4); break;
                case 11: reversed.unshift(5); break;
                case 12: reversed.unshift(6); break;
            }}
        
        return reversed;
    }


	const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    
    var boardResolution = canvas.width;


    var pieces = new Array();
    for (let i = 1; i <= 12; i++) {
        pieces[i] = new Image();
    pieces[i].src = 'resources/'+i+'.png';
    }
    pieces[13] = new Image();
    pieces[14] = new Image();
    pieces[15] = new Image();
    pieces[16] = new Image();
    
    pieces[13].src = 'resources/legalMoveDot.png';
    pieces[14].src = 'resources/redDot.png';
    pieces[15].src = 'resources/sword.png';
    pieces[16].src = 'resources/sword_b.png';

    pieces[12].onload = function(){renderStills();}

   // ctx.drawImage(pieces[1],0, 0, boardResolution/8, boardResolution/8);



    

//function draw() {
//    ctx.drawImage(pieces[1],0, 0, boardResolution/8, boardResolution/8);
//}
//setInterval(draw, 1000);
var relativeX = 0;
var relativeY = 0;
var mousedownBool = false;
function renderStills(){
    for(var i=0;i<=64-1;i++){
            var squareX=(i % 8);
            var squareY = Math.floor(i/8);
            if((boardSquares[i]!=0)&& draggedPiece !=i){
                ctx.drawImage(pieces[boardSquares[i]],squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
            }}

}
function updateCursorIcon(){
    var selectionX = Math.ceil(relativeX/boardResolution*8)-1;
     var selectionY = Math.ceil(relativeY/boardResolution*8)-1;
     var selection = (((selectionY*8)-1)+selectionX)+1;
     if(mousedownBool && draggedPiece>0){
        document.body.style.cursor = 'grabbing';
     }
     else if (boardSquares[selection]>0){
        document.body.style.cursor = 'grab';
     }else{
        document.body.style.cursor = 'default';
     }
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function mouseMoveHandler(e) {
     relativeX = e.clientX - canvas.offsetLeft;
     relativeY = e.clientY - canvas.offsetTop;
updateCursorIcon();
    if(mousedownBool&&mouseOnBoard(e)){

        drawBackground();

//Draws legal move dots
updateLegalMoves();
        for(var i=0;i<=legalMovesToShow.length;i++){
            var squareX=(legalMovesToShow[i] % 8);
            var squareY = Math.floor(legalMovesToShow[i]/8);
            if(getPiece(squareX,squareY,boardSquares)==0){
                ctx.drawImage(pieces[13],squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
                
            }else{
                ctx.drawImage(pieces[14],squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
            }
          
        }



        renderStills(); //draws still pieces

        for(var i=0;i<=legalMovesToShow.length;i++){  //this chunk draws the sword on attackable pieces
            var squareX=(legalMovesToShow[i] % 8);
            var squareY = Math.floor(legalMovesToShow[i]/8);
            if(getPiece(squareX,squareY,boardSquares)!=0){
                if(getPiece(squareX,squareY,boardSquares)>6){
                ctx.drawImage(pieces[15],squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
                }else{
                    ctx.drawImage(pieces[16],squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
                }
            }
        }


if(draggedPiece>=0){//draws grabbed piece
        ctx.drawImage(pieces[boardSquares[draggedPiece]],relativeX-boardResolution/16, relativeY-boardResolution/16, boardResolution/8, boardResolution/8);
    }


    }
}
function mouseOnBoard(e){
    relativeX = e.clientX - canvas.offsetLeft;
     relativeY = e.clientY - canvas.offsetTop;
     if(relativeX<=boardResolution&&relativeX>=0&&relativeY<=boardResolution&&relativeY>=0){
return true;
     }
     return false;
}
var draggedPiece=15;

function mouseDownHandler(e){
mousedownBool=true;

//console.log(e.clientX);
    relativeX = e.clientX - canvas.offsetLeft;
     relativeY = e.clientY - canvas.offsetTop;

     var selectionX = Math.ceil(relativeX/boardResolution*8)-1;
     var selectionY = Math.ceil(relativeY/boardResolution*8)-1;

    var selection = (((selectionY*8)-1)+selectionX)+1;
    if(boardSquares[selection]==0){
        draggedPiece=-1;
    }else{
        draggedPiece = selection;
        updateLegalMoves(selection);
    }
    updateCursorIcon();
    
}

var legalMovesToShow = [0,15,23,47];
function updateLegalMoves(){
legalMovesToShow = [];
for(var i=0;i<=64;i++){
    if(rulebook(draggedPiece,i)){
        legalMovesToShow.push(i);
    }

}
    

}
function mouseUpHandler(e) {
mousedownBool=false;
updateCursorIcon();
relativeX = e.clientX - canvas.offsetLeft;
     relativeY = e.clientY - canvas.offsetTop;

     var selectionX = Math.ceil(relativeX/boardResolution*8)-1;
     var selectionY = Math.ceil(relativeY/boardResolution*8)-1;
     var selection = (((selectionY*8)-1)+selectionX)+1;;
     if(draggedPiece>=0&&rulebook(draggedPiece,selection)){
         var fromValue = boardSquares[draggedPiece];
         boardSquares[draggedPiece]=0;
         boardSquares[selection] = fromValue;//A MOVE HAS BEEN MADE HERE
        whitesMove=!whitesMove;

 }
     draggedPiece=-1;
        if(relativeX<=boardResolution){
     drawBackground();
     for(var i=0;i<=64-1;i++){
            var squareX=(i % 8);
            var squareY = Math.floor(i/8);
            if((boardSquares[i]!=0)&& draggedPiece !=i){
                ctx.drawImage(pieces[boardSquares[i]],squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
            }}

        }

}

function getPiece(myx,myy,board){
return board[(((myy*8))+myx)];
}

var whitesMove = true;
function rulebook(source,destination){

    var internalBoard = boardSquares;
    if(!whitesMove){internalBoard=boardSquaresReversed()}

if(!whitesMove){
    source=63-source;
   destination=63-destination;
}
    var sourceX=(source % 8);
    var sourceY = Math.floor(source/8);
    var destX=(destination % 8);
    var destY = Math.floor(destination/8);


if (internalBoard[source]==0){
    return false;
}
if(getPiece(destX,destY,internalBoard)<=6&&getPiece(destX,destY,internalBoard)!=0){return false;}//doesn't let you self-attack

if(sourceX==destX&&sourceY==destY){return false;}

    if(internalBoard[source]==1){//pawns
    if(sourceX==destX){
        if((sourceY==6&&destY==4) && (getPiece(sourceX,sourceY-2,internalBoard)==0)&& (getPiece(sourceX,sourceY-1,internalBoard)==0)){return true;}
        if((sourceY-1==destY) && (getPiece(sourceX,sourceY-1,internalBoard)==0)){return true;}//forward movement
    }
    if(((sourceX+1==destX && sourceY-1==destY )||(sourceX-1==destX && sourceY-1==destY))&& getPiece(destX,destY,internalBoard)>6){return true;} //attacks

    }//closing pawns

    if(internalBoard[source]==6){//king
        if(Math.abs(sourceX-destX)<=1&&Math.abs(sourceY-destY)<=1&&(getPiece(destX,destY,internalBoard)>6||getPiece(destX,destY,internalBoard)==0)){
return true;
        }
    }

    if(internalBoard[source]==2){//bishop

    if(Math.abs(sourceX-destX) != Math.abs(sourceY - destY)){return false;} //fails if not perfectly diagonal
        
    if(getPiece(destX,destY,internalBoard)==0 | getPiece(destX, destY,internalBoard) > 6){
        var scanDirX=0;
        var scanDirY=0;
        if (sourceX > destX){scanDirX = 0 - 1;}
        else{scanDirX = 1;}
        if (sourceY > destY){scanDirY = 0 - 1;}
        else{scanDirY = 1;}


            return true;
        

        
    
    }

    }




return false;

}



function drawBackground(){
    var bgSquare = 0;
    
  while(bgSquare<=64){
        var squareX=(bgSquare % 8);
       var squareY = Math.floor(bgSquare/8);

if((squareX+squareY)%2){
    ctx.beginPath();
 ctx.rect(squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
                 ctx.fillStyle = "#779AAF";
                 ctx.fill();       
            ctx.closePath();
}else{
    ctx.beginPath();
 ctx.rect(squareX*boardResolution/8, squareY*boardResolution/8, boardResolution/8, boardResolution/8);
                 ctx.fillStyle = "#d5E1E5";
                 ctx.fill();       
            ctx.closePath();
            
}    

bgSquare +=1;
 
}
}
drawBackground();