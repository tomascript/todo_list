let itemsList, todos; 
const main = document.querySelector('.main')
const input = document.querySelector('#form-todo input[type="text"]')
const deleteAllIcon = document.querySelector('.delete-all i')
const locStorage = window.localStorage;

todos = JSON.parse(locStorage.getItem('todos'));
if (!todos) todos = []

const addItemToMarkup = item => {
    itemsList = document.querySelector('.items-list')
    itemsList.insertAdjacentHTML('beforeend', 
    `
    <li class="row">${item}<span class="icon-span"><i class="fas fa-trash-alt"></i></span></li>
    `)
}

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    if (todos.length > 0) {
        for (todo of todos) {
            addItemToMarkup(todo)
        }
    }
    input.focus()
});

const clickFunction = (e) => {

    e.preventDefault();
    const items = Array.from(main.children[0].children)
    
    if (items.includes(e.target)) {
        if (e.type === 'click') {
            e.target.classList.toggle('checkout')
        } 
        return;  
     }

     if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'I') {
        const item = e.target.parentNode.parentNode
        item.parentNode.removeChild(item)
        todos = JSON.parse(locStorage.getItem('todos'));
        const updatedList = todos.filter(todo => todo !== item.textContent)
        locStorage.setItem('todos', JSON.stringify(updatedList))
        
        input.focus();
     }
}

main.addEventListener('click', clickFunction);

deleteAllIcon.addEventListener('click', (e) => {
    e.preventDefault();
    locStorage.removeItem('todos');
    itemsList = document.querySelectorAll('.row')
    
    if (itemsList) {
        itemsList.forEach(item => {
            item.parentNode.removeChild(item)
        })
    }
})

document.addEventListener('keypress', (e) => {
   
    if (e.which === 13 && input.value) {

        addItemToMarkup(input.value);

        todos.push(input.value)
        locStorage.setItem('todos', JSON.stringify(todos))

        console.log(locStorage.todos)

        input.value = ''
        input.focus();
        
        e.preventDefault();
        return;
    }
})





