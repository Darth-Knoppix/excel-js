//Basic excel style sheet in JS and HTML5\

var $table  = $('#xl-table');
var $header = $('#xl-header');
var $body   = $('#xl-body');
var $selected;
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

function calcAllFormulas(){
  console.log('UPDATING');
  var $cell;
  var form;
  $.each(tableStore, function(id, value){
    $cell = $('#' + id);
    form = $cell.attr('data-formula');
    if(typeof form !== typeof undefined){
      $cell.text(calcFormula(form));
    }
  });
}

function loadSavedData(){
  var $cell;
  $.each(tableStore, function(id, value){
    $cell = $('#' + id);
    $cell.text(value['value']);
    $cell.attr('class', value['style']);
    checkFormula($cell);
  });
}

function saveCell(cell){
  tableStore[cell.attr('id')] = {
    'value': cell.text(), 
    'style': cell.attr('class')
  };
}

//Create initial grid
function initGrid(_columns, _rows){
  initGridHeader($header, _columns);
  initGridBody($body, _columns, _rows);
}

function calcFormula(formula){
  formula = formula.substr(1);
  var variables = formula.match(/[A-Z]\d/g);
  var ref;

  $.each(variables, function(index, id){
    ref = new RegExp(id, "g");
    formula = formula.replace(ref, $('#' + id).text());
  });

  return Shunt.parse(formula);
}

function adjacentCell(origin, direction){
  var row = parseInt(origin.match(/[0-9]+$/));
  var column = origin.match(/[A-Z]+/);
  var destination;

  // console.log(column);

  switch(direction){
    case 'left':
      destination = $('#' + origin).prev();
      break;
    case 'right':
      destination = $('#' + origin).next();
      break;
    case 'up':
      destination = $('#' + column + (row - 1));
      break;
    case 'down':
      destination = $('#' + column + (row + 1));
      break;
    default:
      break;
  }
  return destination;
}

//Check if formula present in cell
function checkFormula(cell){
  if(cell.text()[0] !== '='){
    return;
  }

  cell.attr('data-formula', cell.text());
  cell.text(calcFormula(cell.text()));
}

function toggleActionButton(style){
  if($selected.hasClass(style)){
    $('#xl-action-' + style).addClass('depressed');
  }else{
    $('#xl-action-' + style).removeClass('depressed');
  }
}

/*
  Listeners
*/

//Update tableStore to save values
$body.keyup(function(e){
  // console.log(e.which);

  var key = e.which;

  switch(key){
    //Don't update if tab pressed
    case 9:
      calcAllFormulas();
      return;
    case 37: //Selector left keyboard
      $selected = adjacentCell(e.target.id, 'left').focus();
      break;
    case 38: //Selector up keyboard
      $selected = adjacentCell(e.target.id, 'up').focus();
      break;
    case 39: //Selector right keyboard
      $selected = adjacentCell(e.target.id, 'right').focus();
      break;
    case 40: //Selector down keyboard
      $selected = adjacentCell(e.target.id, 'down').focus();
      break;
    default:
      $selected = $(e.target);
      saveCell($selected);
      // console.log(tableStore);
      
      return;
  }
});

//Look for formula on cell change
$body.focusout(function(e){
  checkFormula($(e.target));
  calcAllFormulas();
});

//Action on cell focus
$body.focusin(function(e){
  $selected = $(e.target);

  toggleActionButton('bold');
  toggleActionButton('italic');
  toggleActionButton('underline');

  //Do nothing if no formula exists
  var formulaAttribute = $selected.attr('data-formula');
  if(typeof formulaAttribute === typeof undefined || formulaAttribute === false){
    return;
  }

  //Display formula
  $selected.text($selected.attr('data-formula'));
});

//Refresh button
$('#xl-action-refresh').click(function(e){
  $header.empty();
  $body.empty();
  initGrid(columns, rows);
  loadSavedData();
});

//Bold button
$('#xl-action-bold').click(function(e){
  $selected.focus();
  $(e.target).toggleClass('depressed');
  $selected.toggleClass('bold');
  saveCell($selected);
});

//Italics button
$('#xl-action-italic').click(function(e){
  $selected.focus();
  $(e.target).toggleClass('depressed');
  $selected.toggleClass('italic');
  saveCell($selected);
});

//Bold button
$('#xl-action-underline').click(function(e){
  $selected.focus();
  $(e.target).toggleClass('depressed');
  $selected.toggleClass('underline');
  saveCell($selected);
});

//Init
$(document).ready(function() {
  console.log("INIT");

  //Get table size from data attrib or default to 100
  columns = $table.data('columns') || 100;
  rows    = $table.data('rows') || 100;

  initGrid(columns, rows);
});