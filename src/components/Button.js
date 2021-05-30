import React from "react";

export function Button({ label, clickHandler, cls }) {
  return (
    <button className={cls} onClick={clickHandler}>
      {label}
    </button>
  );
}
