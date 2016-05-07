//Basic excel style sheet in JS and HTML5\
var $table  = $('#xl-table');
var $header = $('#xl-header');
var $body   = $('#xl-body');
var tableStore = {};

var columns;
var rows;

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

//Generate a single table header cell
function drawHeaderCell(h, index){
  return '<th>' + indexToLetter(index + 1) + '</th>';
}
//Create the table header
function initGridHeader(h, _columns){
  headList = [];
  headList.push('<th id="xl-row-index"></th>'); //Empty column header for row index
  for(col = 0; col < _columns; col++){
    headList.push(drawHeaderCell(h, col));
  }
  h.append(headList.join(""));
}

//Draw a single body cell
function drawBodyCell(b, column, row){
  return '<td contenteditable="true" id="'+ indexToLetter(column + 1) + (row + 1) +'">' + '</td>';
}

//Create table body cells
function initGridBody(b, _columns, _rows){
  bodyList = [];
  for(row = 0; row < _rows; row++){
    bodyList.push('<tr>');
    bodyList.push('<td>' + (row + 1) + '</td>'); //Index for row
    for(col = 0; col < _columns; col++){
      bodyList.push(drawBodyCell(b, col, row));
    }
    bodyList.push('</tr>');
  }
  b.append(bodyList.join(""));
}

function loadSavedData(){
  $.each(tableStore, function(id, value){
    $('#' + id).text(value);
  });
}

//Create initial grid
function initGrid(_columns, _rows){
  initGridHeader($header, _columns);
  initGridBody($body, _columns, _rows);
}

/*
  Listeners
*/

//Update tableStore to save values
$body.keyup(function(e){
  console.log(e.which);

  //Don't update if tab pressed
  if(e.which == 9){
    return
  }
  tableStore[e.target.id] = e.target.innerText;
  console.log(tableStore);
});

//Resfresh button
$('#xl-action-refresh').click(function(e){
  $header.empty();
  $body.empty();
  initGrid(columns, rows);
  loadSavedData();
});


//Init
$(document).ready(function() {
  console.log("INIT");

  //Get table size from data attrib or default to 100
  columns = $table.data('columns') || 100;
  rows    = $table.data('rows') || 100;

  initGrid(columns, rows);
});