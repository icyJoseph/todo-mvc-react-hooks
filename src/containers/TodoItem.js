import React, { useState } from "react";
import { ENTER_KEY, ESCAPE_KEY, NONE } from "../constants";

export function TodoItem({
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

export default React.memo(TodoItem);
