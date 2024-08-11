import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskList from "./task-list.component";
import TaskListService from "../services/task-list.service";
import useBoardData from "../hooks/useBoardData"; // Хук для роботи з даними дошки
import useWebSocket from "../hooks/useWebSocket"; // Хук для роботи з WebSocket
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CreateTaskListModal from "./create-taskList-modal.component";
import CreateTaskModal from "./create-task-modal.component";
import TaskViewModal from "./task-view-modal.component";
import TaskService from "../services/task.service";



const Board = () => {

  const { id } = useParams();
  const { board, setBoard } = useBoardData(id);
  const stompClient = useWebSocket(id, setBoard);
  const inittaskLists = board?.taskLists || [];
  const [taskLists, setTaskLists] = useState(inittaskLists);

  //modals
  const [showModal, setShowModal] = useState(false);
  const [showModalTaskCreate,setModalTaskCreate]=useState(false);
  const [showTaskViewModal,setTaskViewModal]=useState(false);
  //for modals
  const [taskListIdCreate,setTaskListIdCreate]=useState(null);
  const [taskView,setTaskView]=useState(null);


  const onDragEnd = (result) => {
    
    setTaskLists(board?.taskLists || []);
    
    const { source, destination, type } = result;
    
    // Якщо немає місця призначення, перетягування скасовано
    if (!destination) {
      return;
    }

    // Перетягування списку завдань
    if (type === "TASKLIST") {
      const sourceTaskList = board.taskLists.find(taskList => taskList.position === source.index);

      console.log(sourceTaskList);
      if (sourceTaskList && sourceTaskList.id) {
        console.log("changePos")
        console.log(sourceTaskList.id,"title",id, destination.index);
        if(source.index!=destination.index)
        {TaskListService.changePosition(sourceTaskList.id,"title",id, destination.index)
          .then((response) => {
            console.log('TaskList position changed successfully', response);
            // Логіка оновлення стану може бути додана тут
          })
          .catch((error) => {
            console.error('Error changing taskList position', error);
          });}
      } else {
        console.error('Invalid taskList data', sourceTaskList);
      }
    }else if(type==="TASK") {
      if((source.droppableId===destination.droppableId && source.index!=destination.index)||(source.droppableId!=destination.droppableId)){
            //console.log(source.droppableId);
            const sourceTaskList = board.taskLists.find(taskList => taskList.id === Number(source.droppableId));
            
            //console.log("source TaskLists");
            
            const sourceTask=sourceTaskList.tasks.find(task=>Number(task.position)===Number(source.index));
          
            TaskService.changePosition(sourceTask.id,(source.droppableId),(destination.droppableId),source.index,destination.index)
            .then((response)=>{
              console.log("Task position changed successfully", response);
            })
            .catch((error)=>{
              console.error("Error changing task position",error);
            });
      }
      
    }
  };
  

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModalTaskCreate = () => {
    setModalTaskCreate(true);
  };

  const handleCloseModalTaskCreate = () => {
    setModalTaskCreate(false);
  };
  const handleOpenModalTaskView = () => {
    setTaskViewModal(true);
  };

  const handleCloseModalTaskView = () => {
    setTaskViewModal(false);
  };
  const handleSetTaskListId=(id)=>{
    setTaskListIdCreate(id);
  }
  

  const handleSaveTask=(id,title,description,position)=>{
      TaskService.updateTask(id,title,description,position)
      .then((response)=>{
        console.log("task update:"+response);
      }).catch((error=>{
        console.error("error update task:"+error );
      }))
  }

  if (!board) {
    return <div className="text-white">Board not found</div>;
  }

  const sortedTaskLists = board.taskLists
    ? [...board.taskLists].sort((a, b) => a.position - b.position)
    : [];


  return(
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-tasklists" type="TASKLIST" direction="horizontal" className="">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="board flex overflow-x-auto"
          >
            {sortedTaskLists.length > 0 ? (sortedTaskLists.map((taskList,index) => (
              <TaskList key={taskList.id} taskList={taskList} index={index} 
              setTaskListId={handleSetTaskListId} 
              handleCloseModalTaskCreate={handleCloseModalTaskCreate} 
              handleOpenModalTaskCreate={handleOpenModalTaskCreate}
              handleOpenModalTaskView={handleOpenModalTaskView}
              handleSetTaskView={setTaskView}
              
              />))) : 
              (
                <div></div>
              )
            }
            
            {provided.placeholder}
            {<div>
                <button
                  onClick={handleOpenModal}
                  className="bg-green-600 text-white  m-2 p-3 rounded hover:bg-green-700"
                >
                  Add list
                </button>
              </div>}
          </div>

        )}
      </Droppable>
      
      <CreateTaskListModal
        showModal={showModal}
        handleClose={handleCloseModal}
        boardId={id}
      />
      <CreateTaskModal
        showModal={showModalTaskCreate}
        handleClose={handleCloseModalTaskCreate}
        taskListId={taskListIdCreate}
      />
      <TaskViewModal
        showModal={showTaskViewModal}
        handleClose={handleCloseModalTaskView}
        handleSave={handleSaveTask}
        task={taskView}   
      />

      
    </DragDropContext>
  );
};

export default Board;
