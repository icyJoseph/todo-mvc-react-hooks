import React, { useCallback } from "react";
import { Button } from "../components/Button";
import {
  TODOS,
  ALL_TODOS,
  SELECTED,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  NONE
} from "../constants";

const TodoCategory = ({ label, nowShowing, changeShownTodos }) => {
  const clickHandler = useCallback(
    () => changeShownTodos(label),
    [changeShownTodos, label]
  );
  return (
    <li>
      <Button
        label={label}
        clickHandler={clickHandler}
        cls={nowShowing === label ? SELECTED : NONE}
      />
    </li>
  );
};
export function TodoFooter({
  changeShownTodos,
  nowShowing,
  completedCount,
  count,
  onClearCompleted
}) {
  const todoCategories = [ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS];

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {TODOS} left
      </span>
      <ul className="filters">
        {todoCategories.map((label) => (
          <TodoCategory
            key={label}
            label={label}
            changeShownTodos={changeShownTodos}
            nowShowing={nowShowing}
          />
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
