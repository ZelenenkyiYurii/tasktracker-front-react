import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskList from "./task-list.component";
import TaskListService from "../services/task-list.service";
import useBoardData from "../hooks/useBoardData"; // Хук для роботи з даними дошки
import useWebSocket from "../hooks/useWebSocket"; // Хук для роботи з WebSocket
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CreateTaskListModal from "./create-taskList-modal.component";
import TaskService from "../services/task.service";

//
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  
  // Переміщує елемент з одного списку в інший
  const move = (source, destination, sourceIndex, destinationIndex) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(sourceIndex, 1);
    destClone.splice(destinationIndex, 0, removed);
  
    return [sourceClone, destClone];
  };
  //


const Board = () => {
  const { id } = useParams();
  const { board, setBoard } = useBoardData(id);
  const [showModal, setShowModal] = useState(false);
  const stompClient = useWebSocket(id, setBoard);
  const inittaskLists = board?.taskLists || [];
  const [taskLists, setTaskLists] = useState(inittaskLists);

  const onDragEnd = (result) => {
    console.log("board:");
    console.log(board);
    setTaskLists(board?.taskLists || []);
    console.log("lists:");
    console.log(board.taskLists);
    console.log("first list");
    console.log(board.taskLists[0]);
    const { source, destination, type } = result;
    console.log(source, destination, type);
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

  if (!board) {
    return <div className="text-white">Board not found</div>;
  }

  const sortedTaskLists = board.taskLists
    ? [...board.taskLists].sort((a, b) => a.position - b.position)
    : [];

  // return (
  //   <DragDropContext onDragEnd={onDragEnd} >
  //     <div className="flex flex-row flex-wrap bg-green-900 h-full">

  //     <Droppable droppableId="all-tasklists" type="TASKLIST" direction="horizontal">
  //       {(provided) => (
  //         <div
  //           ref={provided.innerRef}
  //           {...provided.droppableProps}
  //           className="board"
  //         >
  //       {sortedTaskLists.length > 0 ? (
  //         sortedTaskLists.map((taskList) => (
  //           <TaskList key={taskList.id} taskList={taskList} />
  //         ))
  //       ) : (
  //         <p className="text-white">No task lists available.</p>
  //       )}

  //       </div>)}
        
  //       </Droppable>
  //       <div>
  //         <button
  //           onClick={handleOpenModal}
  //           className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
  //         >
  //           Create Task List
  //         </button>
  //       </div>
  //       <CreateTaskListModal
  //         showModal={showModal}
  //         handleClose={handleCloseModal}
  //         boardId={id}
  //       />
  //     </div>
  //   </DragDropContext>
  // );

  return(
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-tasklists" type="TASKLIST" direction="vertical">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="board"
          >
            {sortedTaskLists.length > 0 ? (sortedTaskLists.map((taskList,index) => (
              <TaskList key={taskList.id} taskList={taskList} index={index} />))) : 
              (
                <p className="text-white">No task lists available.</p>
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
            Create Task List
          </button>
        </div>
        <CreateTaskListModal
          showModal={showModal}
          handleClose={handleCloseModal}
          boardId={id}
        />
      
    </DragDropContext>
  );
};

export default Board;
