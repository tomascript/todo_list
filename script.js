let todos, lis, currentText;
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
    <li class="${classToAdd}"><div>${itemText}</div><span class="icon-span"><i class="fas fa-trash-alt"></i><i class="fas fa-pencil-alt"></i></span></li>
    `
  );
};

const clickFunction = e => {
  e.stopPropagation();

  getTodos();
  lis = Array.from(itemsList.querySelectorAll('li'));
  let clickedListItem;
  const parent = e.target.parentNode;

  if (e.target.nodeName === 'LI' && lis.includes(e.target)) {
    clickedListItem = e.target;
  }

  if (parent.nodeName === 'LI' && lis.includes(parent)) {
    clickedListItem = parent;
  }
  if (clickedListItem) {
    clickedListItem.classList.toggle('checkout');

    for (todo of todos) {
      if (todo.itemText === clickedListItem.textContent) {
        todo.isChecked = !todo.isChecked;
        break;
      }
    }
    locStorage.setItem('todos', JSON.stringify(todos));
    return;
  }

  //delete
  if (e.target.nodeName === 'I' && e.target.className === 'fas fa-trash-alt') {
    const item = e.target.closest('li');
    const updatedList = todos.filter(
      todo => todo.itemText !== item.textContent
    );
    locStorage.setItem('todos', JSON.stringify(updatedList));
    item.parentNode.removeChild(item);
    input.focus();
    return;
  }

  //edit
  if (e.target.nodeName === 'I' && e.target.className === 'fas fa-pencil-alt') {
    const currentListItem = e.target.parentNode.parentNode;
    currentText = currentListItem.textContent;
    const div = currentListItem.querySelector('div');
    div.innerHTML = `<form id="editing"><input type="text" value="${currentText}" class="edit-input" selected /></form>`;
    div.querySelector('input').select();
    const edit = currentListItem.querySelector('#editing');
    edit.onsubmit = e => {
      e.preventDefault();
      const newText = edit.firstChild.value.trim();
      if (newText === '') return;
      getTodos();
      if (todos.find(todo => todo.itemText === newText)) return;
      todos.forEach(todo => {
        if (todo.itemText === currentText) {
          todo.itemText = newText;
        }
      });
      locStorage.setItem('todos', JSON.stringify(todos));
      div.innerHTML = newText;
      input.focus();
    };
    return;
  }
  location.reload();
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

main.addEventListener('click', clickFunction);

deleteAllIcon.addEventListener('click', e => {
  locStorage.removeItem('todos');
  lis = itemsList.querySelectorAll('li');

  if (lis) {
    lis.forEach(item => {
      item.parentNode.removeChild(item);
    });
  }
  input.focus();
});

document.addEventListener('keydown', e => {
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
  if (e.which === 27) {
    location.reload();
  }
});

document.addEventListener('click', e => {
  location.reload();
  input.focus();
});
