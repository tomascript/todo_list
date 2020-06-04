let itemsList, todos; 
const main = document.querySelector('.main')
const input = document.querySelector('#form-todo input[type="text"]')
const deleteAllIcon = document.querySelector('.delete-all i')
const locStorage = window.localStorage;

const getTodos = () => {
    todos = JSON.parse(locStorage.getItem('todos'));
    if (!todos) todos = []
}

const isDuplicate = (val) => {
    const lis = document.querySelectorAll('.items-list > li')
   
    for (li of lis ) {
        if (val === li.textContent) {
            return true;
        }
    }
    return false;    
}

const addItemToMarkup = (itemText, isChecked) => {
    let classToAdd;
    if (isChecked) {
        classToAdd = 'row checkout'
    } else {
        classToAdd = 'row'
    }
    itemsList = document.querySelector('.items-list');

    itemsList.insertAdjacentHTML('beforeend', 
    `
    <li class="${classToAdd}">${itemText}<span class="icon-span"><i class="fas fa-trash-alt"></i></span></li>
    `)
}

document.addEventListener('DOMContentLoaded', (e) => {

    getTodos();
    if (todos.length > 0 && todos instanceof Array) {
        for (todo of todos) {
            addItemToMarkup(todo.itemText, todo.isChecked)
        }
    }
    input.focus()
});

const clickFunction = (e) => {
    
    // e.preventDefault();
    // e.stopPropagation();
    
    const items = Array.from(main.children[0].children)
    
    if (items.includes(e.target)) {
        
        e.target.classList.toggle('checkout')
        getTodos();

        for (todo of todos) {
            if (todo.itemText === e.target.textContent) {
                todo.isChecked = !todo.isChecked;
                break;
            }
        } 
        locStorage.setItem('todos', JSON.stringify(todos))
        return;  
    }

     if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'I') {
        const item = e.target.parentNode.parentNode
        const updatedList = todos.filter(todo => todo.itemText !== item.textContent)

        item.parentNode.removeChild(item)

        locStorage.setItem('todos', JSON.stringify(updatedList))
        
        input.focus();
     }
}

main.addEventListener('click', clickFunction);

deleteAllIcon.addEventListener('click', (e) => {

    // e.preventDefault();
    // e.stopPropagation();

    locStorage.removeItem('todos');
    itemsList = document.querySelectorAll('.row')
    
    if (itemsList) {
        itemsList.forEach(item => {
            item.parentNode.removeChild(item)
        })
    }
    input.focus();
})

document.addEventListener('keypress', (e) => {

    // e.preventDefault();
    // e.stopPropagation();
    getTodos();

    if (e.which === 13 && input.value ) {

        if (!isDuplicate(input.value)) {
            
            const newItem = ({
                    itemText: input.value, 
                    isChecked: false
            })
            todos.push(newItem)
            locStorage.setItem('todos', JSON.stringify(todos))

            addItemToMarkup(newItem.itemText, newItem.check);

            input.value = ''
            input.focus();
        }
    }
})





