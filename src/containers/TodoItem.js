import React, { useState } from "react";
import { ENTER_KEY, ESCAPE_KEY, NONE } from "../constants";

export function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel
}) {
  const [editText, setEditText] = useState("");

  const handleEdit = () => {
    onEdit(todo);
    setEditText(todo.title);
  };

  const handleSubmit = (e) => {
    const newTitle = editText.trim();
    if (newTitle) {
      onSave(todo, { title: newTitle });
      return setEditText(newTitle);
    }
    return onDestroy(todo);
  };

  const handleKeyDown = (e) => {
    if (e.which === ESCAPE_KEY) {
      setEditText(todo.title);
      return onCancel();
    }
    return e.which === ENTER_KEY && handleSubmit(e);
  };

  const handleChange = (e) => {
    if (isEditing) {
      return setEditText(e.target.value);
    }
  };

  return (
    <li
      className={`${todo.completed ? "completed" : NONE} ${
        isEditing ? "editing" : NONE
      }`}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => onDestroy(todo)} />
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

TodoItem.displayName = "TodoItem";
