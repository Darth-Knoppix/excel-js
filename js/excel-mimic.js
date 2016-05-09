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
    var mod = index % alphabetLength;
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

function addCells(vars){
  console.log('ADDITION');
  var output = 0;
  $.each(vars, function(index, id){
    console.log($('#' + id).val());
    output += parseFloat($('#' + id).innerText);
  });
  return output;
}

function calcFormula(formula){
  formula = formula.substr(1);
  console.log('FORMULA');
  var variables = formula.match(/[A-Z]\d/g);
  var ref;

  $.each(variables, function(index, id){
    ref = new RegExp(id, "g");
    formula = formula.replace(ref, $('#' + id).text());
  });

  return evalExpression(formula);
}

/*
  Listeners
*/

//Update tableStore to save values
$body.keyup(function(e){
  // console.log(e.which);

  //Don't update if tab pressed
  if(e.which == 9){
    return;
  }
  tableStore[e.target.id] = e.target.innerText;
  // console.log(tableStore);
});

//Look for formula on cell change
$body.focusout(function(e){
  // console.log(e.target.id);
  if(e.target.innerText[0] !== '='){
    return;
  }

  e.target.setAttribute('data-formula', e.target.innerText);
  e.target.innerText = calcFormula(e.target.innerText);
});

//Show formula if exists
$body.focusin(function(e){

  //Do nothing if no formula exists
  var formulaAttribute = $(e.target).attr('data-formula');
  if(typeof formulaAttribute === typeof undefined || formulaAttribute === false){
    return;
  }

  //Display formula
  e.target.innerText = $(e.target).attr('data-formula');
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