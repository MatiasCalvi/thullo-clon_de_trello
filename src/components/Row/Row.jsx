import React from "react";

function Row({ text, onRemove }) {
  return (
    <div className="row">
      <p>{text}</p>
      <button onClick={onRemove}>Eliminar fila</button>
    </div>
  );
}

export default Row;