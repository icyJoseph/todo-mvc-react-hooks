import React, { Fragment, useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import TodoFooter from "./TodoFooter";
import Credit from "./Credit";
import useLocalStorage from "../hooks/useLocalStorage";
import { findAndReplace } from "../utils";
import { TODOS, ENTER_KEY, ALL_TODOS, ACTIVE_TODOS } from "../constants";

export function TodoMVC() {
  const [editing, setEditing] = useState(null);
  const editingTodo = ({ id }) => () => setEditing(id);

  const [nowShowing, setShowing] = useState(ALL_TODOS);
  const changeShowing = label => () => setShowing(label);

  const [localStorageTodos, saveToLocalStorage] = useLocalStorage(TODOS, []);

  console.log(localStorageTodos);
  const [todos, modifyTodos] = useState(localStorageTodos);

  const [newTodo, setNewTodo] = useState("");

  const toggleAll = e => {
    const checked = e.target.checked;
    const updatedTodos = todos.map(({ completed, ...todo }) => ({
      ...todo,
      completed: checked
    }));
    return modifyTodos(updatedTodos);
  };

  const activeTodoCount = todos.reduce(
    (prev, todo) => (todo.completed ? prev : prev + 1),
    0
  );

  const clearCompleted = () =>
    modifyTodos(todos.filter(todo => !todo.completed));

  const handleChange = e => setNewTodo(e.target.value);

  const handleNewTodoKeyDown = e =>
    e.keyCode === ENTER_KEY &&
    modifyTodos(
      [...todos, { id: Date.now(), title: newTodo, completed: false }].filter(
        ({ title }) => !!title
      )
    );

  useEffect(() => {
    saveToLocalStorage(todos);
    setNewTodo("");
  }, [todos]);

  const completedCount = todos.filter(todo => todo.completed).length;

  const shownTodos = todos.filter(({ completed }) => {
    if (nowShowing === ALL_TODOS) {
      return true;
    }
    return nowShowing === ACTIVE_TODOS ? !completed : completed;
  });

  const toggle = ({ id: todoId }) => () => {
    const updatedTodos = findAndReplace(
      todos,
      ({ id }) => id === todoId,
      ({ completed, ...todo }) => ({ ...todo, completed: !completed })
    );
    return modifyTodos(updatedTodos);
  };

  const destroy = ({ id: todoId }) => () => {
    const withoutTodo = findAndReplace(
      todos,
      ({ id }) => id === todoId,
      () => null
    ).filter(e => e);
    return modifyTodos(withoutTodo);
  };

  const save = ({ id: todoId }) => ({ title: newTitle }) => {
    const updatedTodos = findAndReplace(
      todos,
      ({ id }) => id === todoId,
      todo => ({ ...todo, title: newTitle })
    );
    return modifyTodos(updatedTodos) && setEditing(null);
  };

  const showFooter = !!activeTodoCount || !!completedCount;

  return (
    <Fragment>
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onKeyDown={handleNewTodoKeyDown}
            onChange={handleChange}
            autoFocus={true}
          />
        </header>
        {!!todos.length && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              onChange={toggleAll}
              checked={activeTodoCount === 0}
            />
            <label htmlFor="toggle-all" />
            <ul className="todo-list">
              {shownTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggle(todo)}
                  onDestroy={destroy(todo)}
                  onEdit={editingTodo(todo)}
                  editing={editing === todo.id}
                  onSave={save(todo)}
                  onCancel={editingTodo({ id: null })}
                />
              ))}
            </ul>
          </section>
        )}
        {showFooter && (
          <TodoFooter
            changeShownTodos={changeShowing}
            count={activeTodoCount}
            completedCount={completedCount}
            nowShowing={nowShowing}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>
      <footer className="info">
        <Credit />
      </footer>
    </Fragment>
  );
}

export default React.memo(TodoMVC);
