import React, { useState, useEffect } from "react";
import { findAndReplace } from "./utils";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const ALL_TODOS = "All";
const TODOS = "Todos";
const ACTIVE_TODOS = "Active";
const SELECTED = "selected";
const COMPLETED_TODOS = "Completed";
const NONE = "";

function TodoFooter({
  changeShownTodos,
  nowShowing,
  completedCount,
  count,
  onClearCompleted
}) {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {TODOS} left
      </span>
      <ul className="filters">
        <li>
          <button
            className={nowShowing === ALL_TODOS ? SELECTED : NONE}
            onClick={() => changeShownTodos(ALL_TODOS)}
          >
            All
          </button>
        </li>{" "}
        <li>
          <button
            className={nowShowing === ACTIVE_TODOS ? SELECTED : NONE}
            onClick={() => changeShownTodos(ACTIVE_TODOS)}
          >
            Active
          </button>
        </li>{" "}
        <li>
          <button
            className={nowShowing === COMPLETED_TODOS ? SELECTED : NONE}
            onClick={() => changeShownTodos(COMPLETED_TODOS)}
          >
            Completed
          </button>
        </li>
      </ul>
      {!!completedCount && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDestroy,
  onEdit,
  editing,
  onSave,
  onCancel
}) {
  const [editText, setEditText] = useState("");

  const handleEdit = () => {
    onEdit();
    setEditText(todo.title);
  };

  const handleSubmit = e => {
    const newTitle = editText.trim();
    if (newTitle) {
      onSave({ title: newTitle });
      return setEditText(newTitle);
    }
    return onDestroy();
  };

  const handleKeyDown = e => {
    if (e.which === ESCAPE_KEY) {
      setEditText(todo.title);
      return onCancel();
    }
    return e.which === ENTER_KEY && handleSubmit(e);
  };

  const handleChange = e => {
    if (editing) {
      return setEditText(e.target.value);
    }
  };

  return (
    <li
      className={`${todo.completed ? "completed" : NONE} ${
        editing ? "editing" : NONE
      }`}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      <input
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
}

export function TodoMVC() {
  const [editing, setEditing] = useState(null);
  const editingTodo = ({ id }) => () => setEditing(id);

  const [nowShowing, setShowing] = useState(ALL_TODOS);
  const changeShowing = show => setShowing(show);

  const [todos, modifyTodos] = useState([]);
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
  );
}

export default TodoMVC;
