const readline = require('readline');
const fs = require('fs');


const todos = [];
const interface = readline.createInterface({input: process.stdin, output: process.stdout})
const menu = `
Your options are:

1. Add a todo.
2. Remove a todo.
3. Mark a todo completed.
4. Mark a todo uncompleted.
5. Quit.

`

const loadTodos = function() {
  todos.splice(0);
  const file = fs.readFileSync('./todos.csv', 'utf8');
  const rows = file.split('\n');
  for (const rowString of rows) {
    const todo = rowString.split(',')
    todos.push(todo);
  }
}

const displayTodos = function(shouldPrintNumber) {
  console.log('\nHere are your current todos:\n')
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const text = todo[0];
    const isComplete = todo[1];
    const num = i + 1;
    let todoLine = '';
    if (shouldPrintNumber) {
      todoLine = todoLine + num + '. ';
    } else {
      todoLine = todoLine + '* ';
    }

    todoLine = todoLine + text + ' - ';
    if (isComplete === 'complete') {
      todoLine = todoLine + '✅';
    } else {
      todoLine = todoLine + '✖';
    }

    console.log(todoLine);
  }
}

const saveTodos = function() {
  const rowStrings = [];
  for (const todo of todos) {
    rowStrings.push(todo[0] + ',' + todo[1]);
  }

  const newContents = rowStrings.join('\n');
  fs.writeFileSync('./todos.csv', newContents);
}

const add = function(text) {
  const todo = [text, 'uncomplete'];
  todos.push(todo);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const remove = function(num) {
  todos.splice(num - 1, 1);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const complete = function(num) {
  [['thing1', 'complete'], ['thing2', 'uncomplete']]
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(num)) {
      todos[i][1] = 'complete';
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const uncomplete = function(num) {
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(num)) {
      todos[i][1] = 'uncomplete';
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const handleMenu = function(cmd) {
  if (cmd === '1') {
    // Add a todo.
    interface.question('\nWhat should go on your list? ', add)
  } else if (cmd === '2') {
    // Remove a todo.
    displayTodos(true);
    interface.question('\nPlease pick a todo to remove: ', remove)
  } else if (cmd === '3') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark complete: ', complete)
  } else if (cmd === '4') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark uncomplete: ', uncomplete)
  } else {
    console.log('Quitting!');
    interface.close();
  }
}

loadTodos();
displayTodos(false);
interface.question(menu, handleMenu);