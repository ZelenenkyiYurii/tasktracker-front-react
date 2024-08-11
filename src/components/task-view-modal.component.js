import React, { useEffect, useState } from "react";

const TaskViewModal = ({ task, showModal, handleClose, handleSave }) => {
  const [editedTask, setEditedTask] = useState( {...task} );
  useEffect(()=>{
    setEditedTask({...task});
  },[task,showModal]);

  const handleChange = (e) => {
    
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const saveChanges = () => {
    handleSave(task.id,editedTask.title,editedTask.description,editedTask.position);
    handleClose();
  };
  

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-green-600 p-4 rounded-lg w-1/3 relative">
          <button
            className="absolute top-2 right-2 text-white text-lg"
            onClick={handleClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">Task Details</h2>

          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={editedTask.title || ''}
              onChange={handleChange}
              className="w-full text-black p-2 border rounded"
              placeholder="Enter task title"
            />
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              value={editedTask.description || ''}
              onChange={handleChange}
              className="w-full text-black p-2 border rounded"
              rows="4"
              placeholder="Enter task description"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveChanges}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default TaskViewModal;
