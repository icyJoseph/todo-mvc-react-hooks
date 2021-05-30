import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import { TodoItem } from "./TodoItem";
import { TodoFooter } from "./TodoFooter";
import { Credit } from "./Credit";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { findAndReplace } from "../utils";
import { TODOS, ENTER_KEY, ALL_TODOS, ACTIVE_TODOS } from "../constants";

export function TodoMVC() {
  // category of todo's being shown
  const [nowShowing, setShowing] = useState(ALL_TODOS);
  // provide a closure to attach to the category buttons
  const changeShowing = useCallback((label) => setShowing(label), []);

  // get and set on localStorage a TODOS key, default to empty array
  const [localStorageTodos, saveToLocalStorage] = useLocalStorage(TODOS, []);

  // the actual todos and the function to set them!
  const [todos, setTodos] = useState(localStorageTodos);

  useEffect(() => {
    saveToLocalStorage(todos);
  }, [saveToLocalStorage, todos]);

  // the state of the main input, used to create a new todo
  const [newTodo, setNewTodo] = useState("");

  const toggleAll = (e) => {
    const checked = e.target.checked;

    return setTodos((prev) =>
      prev.map(({ completed, ...todo }) => ({
        ...todo,
        completed: checked
      }))
    );
  };

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;

  const clearCompleted = useCallback(
    () => setTodos((prev) => prev.filter((todo) => !todo.completed)),
    []
  );

  const handleChange = (e) => setNewTodo(e.target.value);

  const handleNewTodoKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      setTodos(
        [...todos, { id: Date.now(), title: newTodo, completed: false }].filter(
          ({ title }) => !!title
        )
      );
      setNewTodo("");
    }
  };

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const shownTodos = useMemo(
    () =>
      todos.filter(({ completed }) => {
        if (nowShowing === ALL_TODOS) {
          return true;
        }
        return nowShowing === ACTIVE_TODOS ? !completed : completed;
      }),
    [todos, nowShowing]
  );

  // editing state and setter
  const [editing, setEditing] = useState(null);
  // provide a closure to attach to every todo
  const editingTodo = useCallback(({ id }) => setEditing(id), []);

  const cancel = useCallback(() => editingTodo({ id: null }), [editingTodo]);

  const toggle = useCallback(
    ({ id: todoId }) =>
      setTodos((prev) =>
        findAndReplace(
          prev,
          ({ id }) => id === todoId,
          ({ completed, ...todo }) => ({ ...todo, completed: !completed })
        )
      ),
    []
  );

  const destroy = useCallback(
    ({ id: todoId }) =>
      setTodos((prev) =>
        findAndReplace(
          prev,
          ({ id }) => id === todoId,
          () => null
        ).filter((e) => e)
      ),
    []
  );

  const save = useCallback(
    ({ id: todoId }, { title: newTitle }) =>
      setTodos((prev) =>
        findAndReplace(
          prev,
          ({ id }) => id === todoId,
          (todo) => ({ ...todo, title: newTitle })
        )
      ) && setEditing(null),
    []
  );

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
              {shownTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editing === todo.id}
                  onToggle={toggle(todo)}
                  onDestroy={destroy}
                  onEdit={editingTodo}
                  onSave={save}
                  onCancel={cancel}
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

TodoMVC.displayName = "TodoMVC";
