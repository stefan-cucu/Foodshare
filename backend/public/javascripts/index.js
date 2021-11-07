let todos = [];
let counter = 0;
let all_selector = false, active_selector = false, completed_selector = false;

async function get_data()
{
    const url = 'http://192.168.88.205:3000/get';
    await fetch(url)
    .then(response => response.json())
    .then(data => reset_todos(data));
}

function reset_todos(mysql_query)
{
    let new_todos = [];
    for(let i = 0; i < mysql_query.length; i++){
        let todo = {
            id: mysql_query[i].id,
            name: mysql_query[i].text,
            completed: mysql_query[i].checked
        };
        new_todos.push(todo);
    }
    todos = new_todos;
    counter = todos.length;
    console.log(counter);
    render_html();
}

function render_html()
{
    console.log(todos);
    let footer = document.getElementById('container-footer');
    let counter_text = document.getElementById('footer_counter');

    document.querySelectorAll('.child').forEach(e => e.remove());

    for(let i = 0; i < counter; i++){
        if(active_selector === true && todos[i].completed === true) continue;
        if(completed_selector === true && todos[i].completed === false) continue;

        let new_child = document.createElement("div");
        new_child.classList += "child";
        new_child.id = "child" + todos[i].id;

        let new_checkbox = document.createElement('input');
        new_checkbox.setAttribute('type', 'checkbox');
        new_checkbox.setAttribute('onchange', 'on_check(this)')
        new_checkbox.classList += "child_checkbox";
        new_checkbox.id = "checkbox"+todos[i].id;
        new_checkbox.checked = todos[i].completed;
        new_child.appendChild(new_checkbox);
        
        let new_input = document.createElement('p');
        new_input.setAttribute('contentEditable', 'true');
        new_input.innerHTML += todos[i].name;
        new_input.classList += "child_text";
        new_input.id = "child_text"+todos[i].id;
        new_input.addEventListener('input', ()=>{
            todos[i].name = new_input.innerHTML;
        })

        if(todos[i].completed === true)
            new_input.classList.add('striked');
        else
            new_input.classList.remove('striked');
        new_child.appendChild(new_input);

        let new_button = document.createElement('input');
        new_button.setAttribute('type', 'button');
        new_button.setAttribute('value', 'x');
        new_button.classList += "child_remove_btn";
        new_button.id = 'child_remove_btn'+todos[i].id;
        new_button.addEventListener("click", remove)
        new_child.appendChild(new_button);

        footer.insertAdjacentElement('beforebegin', new_child);
    }
    counter_text.innerHTML = counter + " items left";
}

function add_to_list()
{
    counter += 1;
    let todo = {
        name : document.getElementById('input_text').value,
        completed : false
    }

    todos.push(todo);
    document.getElementById('input_text').value = '';

    get_data();
}

function on_check(checked_element)
{
    let len = checked_element.id.length;
    let id = parseInt(checked_element.id.slice(8, len));
    todos[id].completed = checked_element.checked;
    get_data();
}

function remove(event)
{
    counter -= 1;

    let len = event.target.id.length;
    let id = parseInt(event.target.id.slice(16, len));
    todos.splice(id, 1);
    console.log(todos);

    get_data();
}

function check_everything()
{
    let everything_checked = true;
    for(let i = 0; i < counter; i++){
        if(todos[i].completed === false){
            everything_checked = false;
            break;
        }
    }
    if(everything_checked)
        for(let i = 0; i < counter; i++)
            todos[i].completed = false;
    else
        for(let i = 0; i < counter; i++)
            todos[i].completed = true;
    get_data();
}

function delete_all_checked()
{
    for(let i = 0; i < counter; i++){
        console.log(todos + i);
        if(todos[i].completed === true){
            todos.splice(i, 1);
            i--;
            counter--;
        }
    }
    console.log(todos);
    get_data();
}

let form = document.querySelector('form');
form.addEventListener('submit', (event)=>{
    event.preventDefault(); 
    //add_to_list();

    data = {
        name : document.getElementById('input_text').value,
        completed : false
    }
    const url = 'http://192.168.88.205:3000/req';
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(get_data())
})

let checker = document.getElementById('input_button');
checker.addEventListener('click', check_everything);

let footer_btn1 = document.getElementById('footer_button1');
let footer_btn2 = document.getElementById('footer_button2');
let footer_btn3 = document.getElementById('footer_button3');

footer_btn1.addEventListener("click", ()=>{
    all_selector = true;
    active_selector = false;
    completed_selector = false;
    footer_btn1.classList.add("selected");
    footer_btn2.classList.remove("selected");
    footer_btn3.classList.remove("selected");
    get_data();
})

footer_btn2.addEventListener("click", ()=>{
    all_selector = false;
    active_selector = true;
    completed_selector = false;
    footer_btn1.classList.remove("selected");
    footer_btn2.classList.add("selected");
    footer_btn3.classList.remove("selected");
    get_data();
})

footer_btn3.addEventListener("click", ()=>{
    all_selector = false;
    active_selector = false;
    completed_selector = true;
    footer_btn1.classList.remove("selected");
    footer_btn2.classList.remove("selected");
    footer_btn3.classList.add("selected");
    get_data();
})

let footer_btn4 = document.getElementById('footer_button4');
footer_btn4.addEventListener('click', delete_all_checked);
