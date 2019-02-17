import React from "react";

export function Credit() {
  return (
    <div>
      The{" "}
      <a href="http://todomvc.com/" target="_blank" rel="noopener noreferrer">
        Todo MVC
      </a>{" "}
      project was Created by{" "}
      <a
        href="https://github.com/petehunt"
        target="_blank"
        rel="noopener noreferrer"
      >
        petehunt
      </a>
      .
      <br />
      This version was creacted by{" "}
      <a
        href="https://github.com/icyJoseph"
        target="_blank"
        rel="noopener noreferrer"
      >
        icyJoseph
      </a>
      , and it uses{" "}
      <a
        href="https://reactjs.org/docs/hooks-intro.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        React Hooks
      </a>
      .
    </div>
  );
}

export default React.memo(Credit);
