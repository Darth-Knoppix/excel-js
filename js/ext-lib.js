/*
  Code modified from the following
  http://eddmann.com/posts/implementing-the-shunting-yard-algorithm-in-javascript/
  http://kilon.org/blog/2012/06/javascript-rpn-calculator/
*/

function evalExpression(expression){
  //Convert to Polish Notation
  var convertToPN = function(_expression) {
    var ops = {'+': 1, '-': 1, '*': 2, '/': 2};
    var peek = (a) => a[a.length - 1];
    var stack = [];

    return _expression
      .split('')
      .reduce((output, token) => {
        if (parseFloat(token)) {
          output.push(token);
        }

        if (token in ops) {
          while (peek(stack) in ops && ops[token] <= ops[peek(stack)]){
            output.push(stack.pop());
          }
          stack.push(token);
        }

        if (token == '(') {
          stack.push(token);
        }

        if (token == ')') {
          while (peek(stack) != '('){
            output.push(stack.pop());
          }
          stack.pop();
        }

        return output;
      }, [])
      .concat(stack.reverse())
      .join(' ');
  };

  //Calculate polish notation expression
  var calculatePN = function(_expression) {
    var array = _expression.split( /\s+/ ), stack = [], token;

    while( token = array.shift() ) { 
      if ( token == +token ) {
        stack.push( token );
      } else {
        var n2 = stack.pop(), n1 = stack.pop();
        stack.push( eval( n1 + token + ' ' + n2 ) );
      }
    }
    return stack.pop();
  }

  return calculatePN(convertToPN(expression));
}