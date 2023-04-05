import React, { useEffect, useState } from "react";
import images from "../../images/images";
import { Avatar } from "@mui/material";
import { deepOrange, blue, green } from "@mui/material/colors";
import { Button, TextField, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

import { v4 as uuidv4 } from "uuid";
import "./home.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { margin } from "@mui/system";

const useStyles = makeStyles({
  buttonSave: {
    backgroundColor: "green !important",
    color: "white !important",
    paddingRight: "15px!important",
    "&:hover !important": {
      backgroundColor: "darkpurple !important",
    },
    textTransform: "capitalize !important",
  },
  textArea: {
    width: "100%",
  },
  buttonEdit: {
    color: "white !important",
    textTransform: "capitalize !important",
    backgroundColor: "green !important",
    paddingRight: "18px!important",
    "&:hover": {
      backgroundColor: "darkgreen !important",
    },
  },
  container: {
    position: "relative",
    minHeight: 250,
    padding:'10px',
    backgroundColor: "#f1f1f1",
    display:'flex',
  },
  textCenter:{
    textAlign:'center',
  },
});

export default function Home() {
  let {
    lockIcon,
    moreIcon,
    account,
    group,
    label,
    image,
    description,
    pencil,
    save,
  } = images;
  const classes = useStyles();

  const [editingRowId, setEditingRowId] = useState(null);
  const [newRowName, setNewRowName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectColumn, setSelectColumn] = useState(null);

  const [columns, setColumns] = useState([
    {
      id: uuidv4(),
      title: "Backlog",
      rows: [
        {
          id: uuidv4().toString(),
          text: "✌ Add What you'd like to work on below",
          description: "",
          imageUrl: "",
        },
        { id: uuidv4().toString(), text: "Github challenge", imageUrl: "" },
      ],
    },
    {
      id: uuidv4().toString(),
      title: "In Progress",
      rows: [
        {
          id: uuidv4().toString(),
          text: "✌ Move Anything that is actually started here",
          description: "",
          imageUrl: "",
        },
      ],
    },
    {
      id: uuidv4().toString(),
      title: "In Review",
      rows: [],
    },
  ]);

  const addColumn = () => {
    const newColumn = {
      id: uuidv4().toString(),
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
          { id: uuidv4().toString(), text: "Nueva fila" },
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

  const handleDragOver = (event, columnId) => {
    event.preventDefault();
  };

  const handleDragStart = (event, columnId, rowId) => {
    event.dataTransfer.setData("text/plain", rowId);
    event.dataTransfer.setData("text/col-id", columnId);
  };

  const handleDrop = (event, targetColumnId) => {
    event.preventDefault();
    const rowId = event.dataTransfer.getData("text/plain");
    const sourceColumnId = event.dataTransfer.getData("text/col-id");
  
    if (!rowId || !sourceColumnId) {
      return;
    }
  
    const draggedColumn = columns.find((column) => column.id === sourceColumnId);
    const draggedItem = draggedColumn.rows.find((row) => row.id === rowId);
  
    if (sourceColumnId === targetColumnId) {
      return;
    }
  
    const newColumns = columns.map((column) => {
      if (column.id === targetColumnId) {
        const newRows = [
          ...column.rows,
          { id: draggedItem.id, text: draggedItem.text },
        ];
        return { ...column, rows: newRows };
      } else if (column.id === sourceColumnId) {
        const newRows = column.rows.filter((row) => row.id !== rowId);
        return { ...column, rows: newRows };
      }
      return column;
    });
  
    setColumns(newColumns);
  };

  console.log(columns);

  const handleSaveRowName = (columnId, rowId, newName) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        const newRows = column.rows.map((row) => {
          if (row.id === rowId) {
            return { ...row, text: newName };
          } else {
            return row;
          }
        });
        return { ...column, rows: newRows };
      } else {
        return column;
      }
    });
    setColumns(newColumns);
  };

  const handleMenuClick = (event, columnId, rowId) => {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${columnId}-${rowId}`);
    menu.style.display = menu.style.display === "block" ? "none" : "block";
    const buttonRect = event.target.getBoundingClientRect();
    menu.style.top = buttonRect.bottom + "px";
    menu.style.left = buttonRect.left + "px";
  };

  const [editMode, setEditMode] = useState(false);
  const [valueDescription, setValueDescription] = useState("");

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = (rowId, value) => {
    setEditMode(false);
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      for (let column of newColumns) {
        for (let row of column.rows) {
          if (row.id === rowId) {
            row.description = value;
            break;
          }
        }
      }
      return newColumns;
    });
  };

  return (
    <>
      <div className=" dflex jcontentSpaceBet bCWhite mt2 minHeight5 alingItems p1 flexW">
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
                <button
                  onClick={(e) => {
                    removeColumn(column.id);
                    e.stopPropagation();
                  }}
                >
                  ✘
                </button>
              </div>
              {showModal ? (
                <div className="modal">
                  <div className="modal-containerImg">
                    <img
                      src="https://a4.espncdn.com/combiner/i?img=%2Fphoto%2F2022%2F1231%2Fr1112335_1296x729_16%2D9.jpg"
                      alt=""
                      draggable="false"
                    />
                    <button
                      className="modal-close"
                      onClick={() => setShowModal(false)}
                    >
                      ✘
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="modal-bodyC1">
                      <div>
                        <h3 className="modal-title">{`${selectedRow.text} `}</h3>
                        <p className="modal-subtitle">
                          In the list{" "}
                          <span className="modal-titleList">{`${selectColumn.title}`}</span>
                        </p>
                      </div>
                      <div className="modal-description-container">
                        <div className="modal-description">
                          <img
                            className="modal-photeDescription"
                            src={description}
                            draggable="false"
                            alt=""
                          />
                          <h5>Description</h5>
                        </div>
                        {!editMode ? (
                          <Button
                            className={classes.buttonEdit}
                            onClick={handleEditClick}
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            className={classes.buttonSave}
                            onClick={() => {
                              handleSaveClick(
                                selectedRow?.id,
                                valueDescription
                              );
                            }}
                            startIcon={<SaveIcon />}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                      {editMode ? (
                        <div className="modal-notation">
                          <TextField
                            id="filled-multiline-static"
                            multiline
                            rows={10}
                            defaultValue={
                              valueDescription
                                ? valueDescription
                                : "Write the description of this card"
                            }
                            onChange={(e) =>{
                              setValueDescription(e.target.value);
                              e.stopPropagation()}
                            }
                            variant="filled"
                            className={classes.textArea}
                          />
                        </div>
                      ) : (
                        <div className="modal-notation">
                          {valueDescription !== "" ? (
                            <Paper className={classes.container}>
                              <div className={classes.message} style={{ whiteSpace: "pre-wrap" }}>
                                <Typography variant="body1">
                                <span>{valueDescription}</span>
                                </Typography>
                              </div>
                            </Paper>
                          ) : (
                            <Paper className={classes.container}>
                              <div className={classes.textCenter}>
                                <Typography variant="body1">
                                  If you want to write a description for this
                                  card, click on the "Edit" button.
                                </Typography>
                              </div>
                            </Paper>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="modal-bodyC2">
                      <div className="modal-bodyC2-c1">
                        <img src={account} draggable="false" alt="" />
                        <h5>Actions</h5>
                      </div>
                      <button className="modal-bodyC2-label">
                        <img src={group} draggable="false" alt="" />
                        Members
                      </button>
                      <button className="modal-bodyC2-label">
                        <img src={label} draggable="false" alt="" />
                        Labels
                      </button>
                      <button className="modal-bodyC2-label">
                        <img src={image} draggable="false" alt="" />
                        Cover
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              {column.rows.map((row) => (
                <div
                  key={row.id}
                  className="row"
                  draggable
                  onDragStart={(event) =>
                    handleDragStart(event, column.id, row.id)
                  }
                  onClick={() => {
                    setSelectedRow(row);
                    setSelectColumn(column);
                    setShowModal(true);
                  }}
                >
                  {editingRowId === row.id ? (
                    <>
                      <input
                        value={newRowName}
                        onChange={(event) => {
                          setNewRowName(event.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="dflex gap10 mr10">
                        <button
                          onClick={(e) => {
                            handleSaveRowName(column.id, row.id, newRowName);
                            setEditingRowId(null);
                            e.stopPropagation();
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={(e) => {
                            setEditingRowId(null);
                            e.stopPropagation();
                          }}
                        >
                          ✘
                        </button>
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      <p className="row-text">{row.text}</p>
                      <button
                        className="menu-button"
                        onClick={(event) =>
                          handleMenuClick(event, column.id, row.id)
                        }
                      >
                        <img src={moreIcon} alt="options" />
                      </button>
                      <div
                        id={`menu-${column.id}-${row.id}`}
                        className="dropdown-menu"
                      >
                        <ul>
                          <li
                            onClick={(e) => {
                              setEditingRowId(row.id);
                              setNewRowName(row.text);
                              e.stopPropagation();
                            }}
                          >
                            Editar
                          </li>
                          <li>Compartir</li>
                          <li>Exportar</li>
                        </ul>
                      </div>
                      <button
                        className="remove-row"
                        onClick={(e) => {
                          removeRow(column.id, row.id);
                          e.stopPropagation();
                        }}
                      >
                        ✘
                      </button>{" "}
                    </>
                  )}
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

/* <p>Ideas are created and share here through a card.<br/>
                          Here you can describe what you´d like to accomplish.<br/>
                          For example you can follow three simple questions to create the card related to your idea:<br/>
                          * Why? (Why do you wish to do it?)<br/>
                          * What (What it is it, what are the goals, who is concerned)<br/>
                          * How? (How do you think you can do it? What are the required steps?)<br/>
                          After creation, you can move your card to the todo list.
                        </p> */
