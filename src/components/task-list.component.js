import React, { useState } from "react";
import Task from "./task.component";
import CreateTaskModal from "./create-task-modal.component";
import TaskListService from "../services/task-list.service";
import { Droppable, Draggable } from "react-beautiful-dnd";

const TaskList = ({ taskList, index,setTaskListId,
  handleCloseModalTaskCreate,handleOpenModalTaskCreate,
  handleOpenModalTaskView,handleSetTaskView }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(taskList.title);
  const [showDropdown, setShowDropdown] = useState(false);

  const sortedTasks = taskList.tasks
    ? [...taskList.tasks].sort((a, b) => a.position - b.position)
    : [];

    // const handleOpenModalTaskView =()=>{
    //   handleOpenModalTaskView()
    // }

  const handleOpenModal = () => {
    setTaskListId(taskList.id);
    handleOpenModalTaskCreate();
  };

  const handleSetTaskView1 = (task) => {
    handleSetTaskView(task);
  };

  const handleOpenModalTaskView1 = () => {
    handleOpenModalTaskView();
  };

  const handleCloseModal = () => {
    handleCloseModalTaskCreate();
  };

  const handleDelete = () => {
    TaskListService.deleteTaskList(taskList.id)
      .then((response) => {
        console.log('TaskList deleted successfully', response);
      })
      .catch((error) => {
        console.error('Error deleting taskList', error);
      });
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    // Update taskList title logic
    console.log(taskList.id, { title: newTitle },taskList.position);
    TaskListService.updateTaskList(taskList.id, newTitle ,taskList.position)
      .then((response) => {
        setIsEditingTitle(false);
        console.log('TaskList title updated successfully', response);
      })
      .catch((error) => {
        console.error('Error updating taskList title', error);
      });
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Draggable draggableId={String(taskList.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="p-3 m-2 border-2 rounded-lg bg-green-700 relative min-w-[250px]" // Ensure a minimum width
        >
          <div className="absolute top-0 right-0 p-2">
            <button onClick={toggleDropdown} className="text-white">
              ...
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                <button
                  onClick={handleDelete}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Delete Task List
                </button>
              </div>
            )}
          </div>
          {isEditingTitle ? (
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="p-2 border text-black rounded"
              />
              <button
                onClick={handleSaveTitle}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ml-2"
              >
                Save
              </button>
            </div>
          ) : (
            <h3
              className="text-xl font-semibold mb-2 text-white cursor-pointer"
              onClick={handleTitleClick}
            >
              {taskList.title}
            </h3>
          )}
  
          <Droppable droppableId={String(taskList.id)} type="TASK">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} 
                    handleOpenModalViewTask={handleOpenModalTaskView1} 
                    handleSetTaskView={handleSetTaskView}
                    />
                  ))
                ) : (
                  <div className=""> Empty list  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div>
            <button
              onClick={handleOpenModal}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Add task
            </button>
          </div>
          {/* <CreateTaskModal
            showModal={showModal}
            handleClose={handleCloseModal}
            taskListId={taskList.id}
          /> */}
        </div>
      )}
    </Draggable>
  );
  
};

export default TaskList;
