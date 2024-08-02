import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";
import TaskList from "./task-list.component";
import CreateTaskListModal from "./create-taskList-modal.component";
import connectWebSocket from "../services/web-socket.service"; // Підключення до вебсокету

const Board = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    UserService.getBoardById(id).then(
      (response) => {
        setBoard(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        console.error(_content);
        setBoard(null);
      }
    );

    const client = connectWebSocket((message) => {
      console.log("Received message: ", message);
      if (message.type === 'TASK_LIST' && message.action === 'CREATE') {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: [...prevBoard.taskLists, message.object]
        }));
      } else if (message.type === 'TASK_LIST' && message.action === 'UPDATE') {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.map(tl =>
            tl.id === message.object.id ? message.object : tl
          )
        }));
      } else if (message.type === 'TASK_LIST' && message.action === 'DELETE') {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.filter(tl => tl.id !== message.object.id)
        }));
      } else if (message.type === 'TASK' && message.action === 'CREATE') {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.map(tl =>
            tl.id === message.object.taskListId
              ? { ...tl, tasks: [...(tl.tasks || []), message.object] } // Якщо tasks не визначений, використовувати порожній масив
              : tl
          )
        }));
      } else if (message.type === 'TASK' && message.action === 'UPDATE') {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.map(tl =>
            tl.id === message.object.taskListId
              ? {
                  ...tl,
                  tasks: (tl.tasks || []).map(task =>
                    task.id === message.object.id ? message.object : task
                  )
                }
              : tl
          )
        }));
      } else if (message.type === 'TASK' && message.action === 'DELETE') {
        console.log("start delete task");
        console.log("Task ID to delete:", message.object.id);
    
        setBoard((prevBoard) => {
          const updatedBoard = {
            ...prevBoard,
            taskLists: prevBoard.taskLists.map(tl => {
              console.log(`Checking TaskList ID: ${tl.id}`);
              if (tl.id === message.object.taskListId) {
                console.log(`Matched TaskList ID: ${tl.id}, TaskList contains ${tl.tasks ? tl.tasks.length : 0} tasks`);
                const updatedTasks = (tl.tasks || []).filter(task => task.id !== message.object.id);
                console.log(`Updated TaskList ID: ${tl.id}, TaskList now contains ${updatedTasks.length} tasks`);
                return {
                  ...tl,
                  tasks: updatedTasks
                };
              }
              return tl;
            })
          };
          console.log("Updated Board:", updatedBoard); // Перевірка оновленого стану
          return updatedBoard;
        });
    
        console.log("end delete task");
    }
    
    });

    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [id]);

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

  return (
    <div className="flex flex-row flex-wrap bg-green-900 h-full">
      {sortedTaskLists.length > 0 ? (
        sortedTaskLists.map((taskList) => (
          <TaskList key={taskList.id} taskList={taskList} />
        ))
      ) : (
        <p className="text-white">No task lists available.</p>
      )}
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
    </div>
  );
};

export default Board;