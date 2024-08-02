import React from "react";
import TaskService from "../services/task.service";
const Task = ({ task }) => {
  const handleDelete = () => {
    TaskService.deleteTask(task.id)
      .then((response) => {
        console.log('Task deleted successfully', response);
      })
      .catch((error) => {
        console.error('Error deleting task', error);
      });
  };

  
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
