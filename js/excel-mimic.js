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

//Draw a single table header cell
function drawHeaderCell(h, index){
  h.append('<th>' + indexToLetter(index + 1) + '</th>');
}
//Create the table header
function initGridHeader(h, columns){
  for(col = 0; col < columns; col++){
    drawHeaderCell(h, col);
  }
}

//Draw a single body cell
function drawBodyCell(b, column, row){
  return '<td contenteditable="true" id="'+ indexToLetter(column + 1) + (row + 1) +'">' + '</td>';
}

//Create table body cells
function initGridBody(b, columns, rows){
  bodyList = [];
  for(row = 0; row < columns; row++){
    bodyList.push('<tr>');
    for(col = 0; col < rows; col++){
      bodyList.push(drawBodyCell(b, col, row));
    }
    bodyList.push('</tr>');
  }
  b.append(bodyList.join(""));
}

//Create initial grid
function initGrid(columns, rows){
  initGridHeader($header, columns);
  initGridBody($body, columns, rows);
}

$(document).ready(function() {
  console.log("INIT");
  initGrid(100, 100);
});