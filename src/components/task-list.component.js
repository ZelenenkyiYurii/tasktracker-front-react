import React, { useState } from "react";
import Task from "./task.component";
import CreateTaskModal from "./create-task-modal.component";
import TaskListService from "../services/task-list.service";

const TaskList = ({ taskList }) => {
  const [showModal, setShowModal] = useState(false);

  const sortedTasks = taskList.tasks
    ? [...taskList.tasks].sort((a, b) => a.position - b.position)
    : [];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

  return (
    <div className="flex-1 p-3 m-2 border-2 rounded-lg bg-green-700">
      <button 
        onClick={handleDelete} 
        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
      >
        Delete tl
      </button>
      <h3 className="text-xl font-semibold mb-2 text-white">{taskList.title}</h3>
      {sortedTasks.length > 0 ? (
        sortedTasks.map((task) => <Task key={task.id} task={task} />)
      ) : (
        <p className="text-white">No tasks available.</p>
      )}
      <div>
        <button
          onClick={handleOpenModal}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Create Task
        </button>
      </div>
      <CreateTaskModal
        showModal={showModal}
        handleClose={handleCloseModal}
        taskListId={taskList.id}
      />
    </div>
  );
};

export default TaskList;

