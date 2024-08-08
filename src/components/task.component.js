import React from "react";
import TaskService from "../services/task.service";
import { Draggable } from "react-beautiful-dnd";
const Task = ({ task, index}) => {
  const handleDelete = () => {
    TaskService.deleteTask(task.id)
      .then((response) => {
        console.log('Task deleted successfully', response);
      })
      .catch((error) => {
        console.error('Error deleting task', error);
      });
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="p-2 bg-green-800 border-b border-green-600"
        >
          <h4 className="font-bold text-white">{task.title+" "+task.position}</h4>
          <button 
        onClick={handleDelete} 
        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
      >
        Delete
      </button>
        </div>
      )}
    </Draggable>
  );
  
  return (<div className="p-2 bg-green-800 border-b border-green-600">
    <h4 className="font-bold text-white">{task.title}</h4>
    {/* <p>{task.description}</p> */}
    <button 
        onClick={handleDelete} 
        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
      >
        Delete
      </button>
  </div>);
};

export default Task;
