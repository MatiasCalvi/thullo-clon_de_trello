import React from "react";

function Column({ title, children }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      <div className="rows">{children}</div>
    </div>
  );
}

export default Column;