import React, { useState } from "react";
import images from "../../images/images";
import { Avatar } from "@mui/material";
import { deepOrange, blue, green } from "@mui/material/colors";
import Column from "../../components/Column/Column";
import Row from "../../components/Row/Row";
import "./home.css";

export default function Home() {
  let { lockIcon, moreIcon } = images;

  const [columns, setColumns] = useState([
    {
      id: 1,
      title: "Columna 1",
      rows: [
        { id: 1, text: "Fila 1" },
        { id: 2, text: "Fila 2" },
      ],
    },
    {
      id: 2,
      title: "Columna 2",
      rows: [],
    },
    {
      id: 3,
      title: "Columna 3",
      rows: [],
    },
  ]);

  const [sourceColumnId, setSourceColumnId] = useState(null);
  const [sourceRowId, setSourceRowId] = useState(null);

  let idCounter = 0;

  const generateId = () => {
    idCounter++;
    return idCounter;
  };

  const addColumn = () => {
    const newColumn = {
      id: Date.now(),
      title: `Columna ${columns.length + 1}`,
      rows: [],
    };
    setColumns([...columns, newColumn]);
  };

  const addRow = (columnId) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        const newRows = [
          ...column.rows,
          { id: Math.random(), text: "Nueva fila" },
        ];
        return { ...column, rows: newRows };
      }
      return column;
    });
    setColumns(newColumns);
  };

  const removeRow = (columnId, rowId) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        const newRows = column.rows.filter((row) => row.id !== rowId);
        return { ...column, rows: newRows };
      }
      return column;
    });
    setColumns(newColumns);
  };

  const removeColumn = (columnId) => {
    const newColumns = columns.filter((column) => column.id !== columnId);
    setColumns(newColumns);
  };

  const handleDragStart = (event, columnId, rowId) => {
    event.dataTransfer.setData("text/plain", rowId);
    setSourceColumnId(columnId);
    setSourceRowId(rowId);
  };

  const handleDragOver = (event, columnId) => {
    event.preventDefault();
  };

  const handleDrop = (event, targetColumnId) => {
    event.preventDefault();
    const rowId = event.dataTransfer.getData("text/plain");
    const draggedItem = columns
      .find((column) => column.id === sourceColumnId)
      .rows.find((row) => row.id == sourceRowId);

    const newColumns = columns.map((column) => {
      if (column.id === targetColumnId) {
        const newRows = [
          ...column.rows,
          { id: generateId(), text: draggedItem.text },
        ];
        return { ...column, rows: newRows };
      } else if (column.id === sourceColumnId) {
        const newRows = column.rows.filter((row) => row.id !== sourceRowId);
        return { ...column, rows: newRows };
      }
      return column;
    });

    setColumns(newColumns);
    setSourceColumnId(null);
    setSourceRowId(null);
  };

  return (
    <>
      <div className=" dflex jcontentSpaceBet bCWhite mt2 minHeight5 alingItems p1">
        <div className="dflex gap15 p1 alingItems">
          <div className="mc-buttonPrivate">
            <img
              src={lockIcon}
              className="mc-buttonPrivateAppsIcon"
              alt="appicons"
            />
            <p className="mc-buttonPrivateAppsIcon-p">Private</p>
          </div>

          <Avatar
            sx={{ bgcolor: blue[500], width: 27, height: 27 }}
            variant="rounded"
          >
            M
          </Avatar>
          <Avatar
            sx={{ bgcolor: green[500], width: 27, height: 27 }}
            variant="rounded"
          >
            J
          </Avatar>
          <Avatar sx={{ width: 27, height: 27 }} variant="rounded">
            G
          </Avatar>
          <Avatar sx={{ width: 27, height: 27 }} variant="rounded">
            A
          </Avatar>
          <Avatar
            sx={{ bgcolor: deepOrange[500], width: 27, height: 27 }}
            variant="rounded"
            className="showMenuAvatar"
          >
            +
          </Avatar>
        </div>
        <div className="mc-buttonPrivate m1">
          <img
            src={moreIcon}
            className="mc-buttonPrivateAppsIcon"
            alt="appicons"
          />
          <p className="mc-buttonPrivateAppsIcon-p">Show Menu</p>
        </div>
      </div>
      <div className="container">
        <div className="columns-container">
          {columns.map((column) => (
            <div
              key={column.id}
              className="column"
              onDrop={(event) => handleDrop(event, column.id)}
              onDragOver={(event) => handleDragOver(event)}
            >
              <div className="column-header">
                <h2>{column.title}</h2>
                <button onClick={() => removeColumn(column.id)}>
                  Eliminar columna
                </button>
              </div>
              {column.rows.map((row) => (
                <div
                  key={row.id}
                  className="row"
                  draggable
                  onDragStart={(event) =>
                    handleDragStart(event, column.id, row.id)
                  }
                >
                  <p className="row-text">{row.text}</p>
                  <button
                    className="remove-row"
                    onClick={() => removeRow(column.id, row.id)}
                  >
                    Eliminar fila
                  </button>
                </div>
              ))}
              <button onClick={() => addRow(column.id)}>Agregar fila</button>
            </div>
          ))}
        </div>
        <button onClick={addColumn} className="button-agregarColumna">
          Agregar otra lista<span>+</span>
        </button>
      </div>
    </>
  );
}
