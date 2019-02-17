import React from "react";
import Button from "../components/Button";
import {
  TODOS,
  ALL_TODOS,
  SELECTED,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  NONE
} from "../constants";

export function TodoFooter({
  changeShownTodos,
  nowShowing,
  completedCount,
  count,
  onClearCompleted
}) {
  const TodoCategories = [ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS];
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {TODOS} left
      </span>
      <ul className="filters">
        {TodoCategories.map(label => (
          <li key={label}>
            <Button
              label={label}
              clickHandler={changeShownTodos(label)}
              cls={nowShowing === label ? SELECTED : NONE}
            />
          </li>
        ))}
      </ul>
      {!!completedCount && (
        <Button
          label={"Clear completed"}
          cls="clear-completed"
          clickHandler={onClearCompleted}
        />
      )}
    </footer>
  );
}

export default React.memo(TodoFooter);
