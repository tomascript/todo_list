let itemsList; 
const main = document.querySelector('.main')
const input = document.querySelector('#form-todo input[type="text"]')
const deleteAllIcon = document.querySelector('.delete-all i')

const clickFunction = (e) => {

    const items = Array.from(main.children[0].children)
    
    if (items.includes(e.target)) {
        if (e.type === 'click') {
            e.target.classList.toggle('checkout')
        } 
        e.stopPropagation();
        return;  
     }

     if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'I') {
        const item = e.target.parentNode.parentNode
        item.parentNode.removeChild(item)
        e.stopPropagation();
        return;
     }
}

main.addEventListener('click', clickFunction)

deleteAllIcon.addEventListener('click', (e) => {
    itemsList = document.querySelectorAll('.row')
    
    if (itemsList) {
        itemsList.forEach(item => {
            item.parentNode.removeChild(item)
        })
        e.stopPropagation();
        return;
    }
})

document.addEventListener('keypress', (e) => {
   
    if (e.which === 13 && input.value) {
        itemsList = document.querySelector('.items-list')
        itemsList.insertAdjacentHTML('beforeend', 
        `
        <li class="row">${input.value}<span class="icon-span"><i class="fas fa-trash-alt"></i></span></li>
        `)
        input.value = ''
        e.stopPropagation();
        return;
    }
})





