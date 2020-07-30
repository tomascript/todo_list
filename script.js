let todos, lis;
const main = document.querySelector('.main');
const itemsList = main.querySelector('.items-list');
const input = document.querySelector('#form-todo input[type="text"]');
const deleteAllIcon = document.querySelector('.delete-all i');
const locStorage = window.localStorage;

const getTodos = () => {
  todos = JSON.parse(locStorage.getItem('todos'));
  if (!todos) todos = [];
};

const isDuplicate = val => {
  lis = itemsList.querySelectorAll('li');

  if (lis) {
    for (li of lis) {
      if (val === li.textContent) {
        return true;
      }
    }
  }
  return false;
};

const addItemToMarkup = (itemText, isChecked) => {
  let classToAdd;
  if (isChecked) {
    classToAdd = 'row checkout';
  } else {
    classToAdd = 'row';
  }
  itemsList.insertAdjacentHTML(
    'beforeend',
    `
    <li class="${classToAdd}">${itemText}<span class="icon-span"><i class="fas fa-trash-alt"></i></span></li>
    `
  );
};

document.addEventListener('DOMContentLoaded', e => {
  getTodos();

  if (todos.length > 0 && todos instanceof Array) {
    for (todo of todos) {
      addItemToMarkup(todo.itemText, todo.isChecked);
    }
  }
  input.focus();
});

const clickFunction = e => {
  // e.preventDefault();
  //   e.stopPropagation();

  getTodos();
  lis = Array.from(itemsList.querySelectorAll('li'));

  if (e.target.nodeName === 'LI' && lis.includes(e.target)) {
    e.target.classList.toggle('checkout');

    for (todo of todos) {
      if (todo.itemText === e.target.textContent) {
        todo.isChecked = !todo.isChecked;
        break;
      }
    }
    locStorage.setItem('todos', JSON.stringify(todos));
    return;
  }

  if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'I') {
    const item = e.target.closest('li');
    const updatedList = todos.filter(
      todo => todo.itemText !== item.textContent
    );

    locStorage.setItem('todos', JSON.stringify(updatedList));
    item.parentNode.removeChild(item);

    input.focus();
  }
};

main.addEventListener('click', clickFunction);

deleteAllIcon.addEventListener('click', e => {
  // e.preventDefault();
  // e.stopPropagation();

  locStorage.removeItem('todos');
  lis = itemsList.querySelectorAll('li');

  if (lis) {
    lis.forEach(item => {
      item.parentNode.removeChild(item);
    });
  }
  input.focus();
});

document.addEventListener('keypress', e => {
  // e.preventDefault();
  // e.stopPropagation();

  if (e.which === 13 && input.value) {
    getTodos();
    if (!isDuplicate(input.value.trim())) {
      const newItem = {
        itemText: input.value.trim(),
        isChecked: false
      };
      todos.push(newItem);
      locStorage.setItem('todos', JSON.stringify(todos));

      addItemToMarkup(newItem.itemText, newItem.isChecked);
    }
    input.value = '';
    input.focus();
  }
});
