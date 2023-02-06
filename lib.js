// Anfang initApp
export function initApp() {
  const addButton = document.querySelector("#add-button");
  const deleteButton = document.querySelector("#delete-button");
  const todoInput = document.querySelector("#todo-input");
  const todoList = document.querySelector("#todo-list");
  const radioContainer = document.querySelector("#radio-container");
  const fetchAdress = "http://localhost:4730/todos";
  let data; // State
  showAllTodos();

  // ### TODO-TEMPLATE ###
  function todoTemplate(descText, isDone) {
    const newTodoLi = document.createElement("li");
    const checkBox = document.createElement("input");
    const cboxLabel = document.createElement("label");
    // li stylen
    newTodoLi.setAttribute("class", "todo-item");
    if (isDone === true) {
      newTodoLi.style.textDecoration = "line-through";
      checkBox.checked = "true";
    }
    // checkbox stylen
    checkBox.type = "checkbox";
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "todo-item__checkbox");
    // label stylen
    cboxLabel.setAttribute("class", "todo-item__text");
    // zusammenbauen:
    newTodoLi.appendChild(checkBox);
    cboxLabel.innerText = descText;
    newTodoLi.appendChild(cboxLabel);
    todoList.appendChild(newTodoLi);
  }

  // ### POST per KEYPRESS New Todos ###
  function addTodoOnEnter(e) {
    if (e.key.toLowerCase() === "enter") {
      addTodo();
    }
  }
  todoInput.addEventListener("keypress", addTodoOnEnter);

  // ### POST per BUTTON New Todos ###
  function addTodo() {
    const newTodoText = todoInput.value;
    todoInput.value = "";
    todoTemplate(newTodoText);
    // FETCH -> POST
    const newTodo = {
      description: newTodoText,
      done: false,
    };
    fetch(fetchAdress, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((newTodoFromApi) => {});
  }
  addButton.addEventListener("click", addTodo);

  // ### PUT Checked = Done:TRUE ###
  function isChecked(e) {
    let newFetchAdress;
    for (let updatedTodo of data) {
      newFetchAdress = fetchAdress + "/" + updatedTodo.id;

      if (updatedTodo.description === e.target.parentElement.innerText) {
        if (e.target.checked) {
          updatedTodo.done = true;
        } else {
          updatedTodo.done = false;
        }
        // FETCH -> PUT
        fetch(newFetchAdress, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(updatedTodo),
        })
          .then((response) => response.json())
          .then((updatedTodoFromApi) => {});
      }
    }
  }
  todoList.addEventListener("change", isChecked);

  // ### REMOVE DONE TODOS ###
  function removeDoneTodos() {
    let newFetchAdress;
    for (let todo of data) {
      if (todo.done === true) {
        newFetchAdress = fetchAdress + "/" + todo.id;
        // FETCH DELETE
        fetch(newFetchAdress, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then(() => {});
        // FETCH DELETE ENDE
      }
    }
  }
  deleteButton.addEventListener("click", removeDoneTodos);

  // ### FILTER ###
  function filterTodos(e) {
    switch (e.target.value) {
      case "all":
        showAllTodos();
        break;
      case "open":
        showOpenTodos();
        break;
      case "done":
        showDoneTodos();
        break;
    }
  }
  radioContainer.addEventListener("change", filterTodos);

  // ### Filter - ALL
  function showAllTodos() {
    todoList.innerHTML = "";
    fetch(fetchAdress)
      .then((res) => res.json())
      .then((todosFromApi) => {
        for (let todo of todosFromApi) {
          todoTemplate(todo.description, todo.done);
        }
        data = todosFromApi;
      });
  }
  // ### Filter - OPEN
  function showOpenTodos() {
    todoList.innerHTML = "";
    for (let openTodo of data) {
      if (openTodo.done === false) {
        todoTemplate(openTodo.description, openTodo.done);
      }
    }
  }
  // ### Filter - DONE
  function showDoneTodos() {
    todoList.innerHTML = "";
    for (let openTodo of data) {
      if (openTodo.done === true) {
        todoTemplate(openTodo.description, openTodo.done);
      }
    }
  }
} // Ende initApp
