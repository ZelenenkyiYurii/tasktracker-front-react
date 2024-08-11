import React,{useState} from "react";
import TaskService from "../services/task.service";
import { Draggable } from "react-beautiful-dnd";
import TaskViewModal from "./task-view-modal.component";
import { Modal } from "bootstrap";
const Task = ({ task, index,handleOpenModalViewTask,handleSetTaskView}) => {

  const [showModal, setShowModal] = useState(false);
 
  const handleOpenModal = () => {
    handleSetTaskView(task);
    handleOpenModalViewTask(true);
  };

  


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
    <div>
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="p-2 bg-green-800 border-b border-green-600"
        >
          {/* <h4 className="font-bold text-white">{task.title}</h4> */}
          <div
        className="task-item"
        onClick={handleOpenModal}
      >
        {task.title}
      </div>

      <button 
        onClick={handleDelete} 
        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
      >
        Delete
      </button>
        </div>
      )}
    </Draggable>
   
    </div>
  );
  
  
};

export default Task;
