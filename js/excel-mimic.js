//Basic excel style sheet in JS and HTML5\
var $table  = $('#xl-table');
var $header = $('#xl-header');
var $body   = $('#xl-body');

function letter(num){
  var alpha = "A".charCodeAt(0);
  return String.fromCharCode(alpha + num - 1);
}

//Generate letter naming for columns
function indexToLetter(index){
  var name;
  var alphabetLength = 26;

  if (index <= alphabetLength){
    result = letter(index)
  }else{
    var mod   = index % alphabetLength;
    var iterations  = Math.floor(index / alphabetLength);
    if(mod === 0){
      result = letter(iterations - 1) + letter(alphabetLength);
    }else{
      result = letter(iterations) + letter(mod);
    }
  }
  return result;
}

//Create a single table header cell
function drawHeaderCell(h, index){
  h.append('<th>' + indexToLetter(index + 1) + '</th>');
}
//Create the table header
function initGridHeader(h, columns){
  for(col = 0; col < columns; col++){
    drawHeaderCell(h, col);
  }
}

//Create table cells
function initGridBody(b, rows){

}

//Create initial grid
function initGrid(columns, rows){
  initGridHeader($header, columns);
  initGridBody($body, rows);
}

$(document).ready(function() {
  console.log("INIT");
  initGrid(100, 100);
});