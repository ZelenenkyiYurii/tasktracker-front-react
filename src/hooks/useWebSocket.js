import { useEffect, useState } from "react";
import connectWebSocket from "../services/web-socket.service";
import UserService from "../services/user.service";


const useWebSocket = (boardId, setBoard) => {
  const [stompClient, setStompClient] = useState(null);
  
  

  useEffect(() => {
    console.log("id useWebSocket"+boardId);
    const client = connectWebSocket((message) => {
      console.log("start wb work");
      if (message.type === "TASK_LIST" && message.action === "CREATE") {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: [...prevBoard.taskLists, message.object],
        }));
      } else if (message.type === "TASK_LIST" && message.action === "UPDATE") {
        // setBoard((prevBoard) => ({
        //   ...prevBoard,
        //   taskLists: prevBoard.taskLists.map((tl) =>
        //     tl.id === message.object.id ? message.object : tl
        //   ),
        // }));
        UserService.getBoardById(boardId).then(
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
          }) 
      } else if (message.type === "TASK_LIST" && message.action === "UPDATE_POSITION") {
        
        console.log(message.object);
        const mapIdPosition=message.object.mapIdPosition;
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists
            .map(taskList => ({
              ...taskList,
              position: mapIdPosition[taskList.id] !== undefined 
                ? mapIdPosition[taskList.id] 
                : taskList.position
            }))
            .sort((a, b) => a.position - b.position)
        }));
        
        

      }else if (message.type === "TASK_LIST" && message.action === "DELETE") {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.filter((tl) => tl.id !== message.object.id),
        }));
      } else if (message.type === "TASK" && message.action === "CREATE") {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.map((tl) =>
            tl.id === message.object.taskListId
              ? { ...tl, tasks: [...(tl.tasks || []), message.object] }
              : tl
          ),
        }));
      } else if (message.type === "TASK" && message.action === "UPDATE") {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.map((tl) =>
            tl.id === message.object.taskListId
              ? {
                  ...tl,
                  tasks: (tl.tasks || []).map((task) =>
                    task.id === message.object.id ? message.object : task
                  ),
                }
              : tl
          ),
        }));
      }else if (message.type === "TASK" && message.action === "UPDATE_POSITION") {
        console.log("message");
        console.log(message.object);
        // UserService.getBoardById(boardId).then(
        //   (response) => {
        //     setBoard(response.data);
        //   },
        //   (error) => {
        //     const _content =
        //       (error.response && error.response.data) ||
        //       error.message ||
        //       error.toString();
    
        //     console.error(_content);
        //     setBoard(null);
        //   }) 


        // setBoard((prevBoard) => {
        //   const {
        //     mapSourceIdPosition,
        //     mapDestinationIdPosition,
        //     sourceTaskListId,
        //     destinationTaskListId
        //   } = message.object; // data - це об'єкт, який ви отримали з бекенду
        //   console.log("mapSourceIdpos");
        //   console.log(mapSourceIdPosition);
        //   console.log("mapDestinationIdPosition");
        //   console.log(mapDestinationIdPosition);
        //   console.log("sourceTaskListId");
        //   console.log(sourceTaskListId);
        //   console.log("message");
        //   console.log(destinationTaskListId);
        //   // Копіюємо taskLists для маніпуляцій
        //   const updatedTaskLists = prevBoard.taskLists.map((taskList) => {
        //     if (taskList.id === sourceTaskListId) {
        //       // Видаляємо завдання із sourceTaskList
        //       const updatedTasks = taskList.tasks.filter(
        //         (task) => mapSourceIdPosition.hasOwnProperty(task.id)
        //       );
        //       console.log("updatedTasksS");
        //       console.log(updatedTasks);
        //       return { ...taskList, tasks: updatedTasks };
        //     }
            
        
        //     // if (taskList.id === destinationTaskListId) {
        //     //   // Додаємо завдання до destinationTaskList з оновленою позицією
        //     //   const updatedTasks = taskList.tasks.map((task) => {
        //     //     if (mapDestinationIdPosition[task.id] !== undefined) {
        //     //       return { ...task, position: mapDestinationIdPosition[task.id] };
        //     //     }
                
        //     //     return task;
        //     //   });

        //     //   console.log("updatedTasksD");
        //     //     console.log(updatedTasks);
        
        //     //   // Додаємо нові завдання з sourceTaskList
        //     //   Object.keys(mapSourceIdPosition).forEach((taskId) => {
        //     //     const movedTask = prevBoard.taskLists
        //     //       .find((tl) => tl.id === sourceTaskListId)
        //     //       .tasks.find((task) => task.id === parseInt(taskId));
                
        //     //     if (movedTask) {
        //     //       updatedTasks.push({ ...movedTask, position: mapSourceIdPosition[taskId] });
        //     //     }
        //     //   });
        
        //     //   return { ...taskList, tasks: updatedTasks };
        //     // }
        
        //     return taskList;
        //   });
        
        //   // Повертаємо новий об'єкт дошки з оновленими taskLists
        //   return { ...prevBoard, taskLists: updatedTaskLists };
        // });



        setBoard((prevBoard) => {
          const {
            mapSourceIdPosition,
            mapDestinationIdPosition,
            sourceTaskListId,
            destinationTaskListId
          } = message.object; // data - це об'єкт, який ви отримали з бекенду
        
          // Якщо source і destination TaskList однакові, просто оновлюємо позиції всередині одного списку
          if (sourceTaskListId === destinationTaskListId) {
            return {
              ...prevBoard,
              taskLists: prevBoard.taskLists.map((taskList) => {
                if (Number(taskList.id) === Number(sourceTaskListId)) {
                  
                  const updatedTasks = taskList.tasks.map((task) => {
                    if (mapSourceIdPosition[task.id] !== undefined) {
                      return { ...task, position: mapSourceIdPosition[task.id] };
                    }
                    return task;
                  });
                  return { ...taskList, tasks: updatedTasks };
                }
                return taskList;
              }),
            };
          } else {
            // Якщо source і destination TaskList різні, переміщуємо завдання між списками
            let movedTask = null;
        
            

            const updatedTaskLists = prevBoard.taskLists.map((taskList) => {
              if (taskList.id === sourceTaskListId) {
                console.log("eqauls");
                // Знаходимо завдання, яке буде переміщено
                movedTask = taskList.tasks.find((task) =>
                  !mapSourceIdPosition.hasOwnProperty(task.id)
                );
                
                console.log("task move:");
                console.log(movedTask);
                // Видаляємо завдання з початкового списку
                const updatedTasks = taskList.tasks
                  .filter((task) => mapSourceIdPosition.hasOwnProperty(task.id))
                  .map((task) => ({
                    ...task,
                    position: mapSourceIdPosition[task.id] !== undefined 
                      ? mapSourceIdPosition[task.id] 
                      : task.position
                  }));
                  console.log("taskList");
                  console.log(updatedTasks);
                return { ...taskList, tasks: updatedTasks };
                  
              }
              
              return taskList;
            });

            // Додаємо переміщене завдання до нового списку, якщо воно існує
            const finalTaskLists = updatedTaskLists.map((taskList) => {
              if (taskList.id === destinationTaskListId && movedTask) {
                const updatedTasks = [
                  ...taskList.tasks.map((task) => ({
                    ...task,
                    position: mapDestinationIdPosition[task.id] !== undefined 
                      ? mapDestinationIdPosition[task.id] 
                      : task.position
                  })),
                  { ...movedTask, position: mapDestinationIdPosition[movedTask.id] }
                ];

                return { ...taskList, tasks: updatedTasks };
              }
              
              return taskList;
            });
        
            return { ...prevBoard, taskLists: finalTaskLists };
          }
        });
        

      } else if (message.type === "TASK" && message.action === "DELETE") {
        setBoard((prevBoard) => ({
          ...prevBoard,
          taskLists: prevBoard.taskLists.map((tl) =>
            tl.id === message.object.taskListId
              ? {
                  ...tl,
                  tasks: (tl.tasks || []).filter(
                    (task) => task.id !== message.object.id
                  ),
                }
              : tl
          ),
        }));
      }
    },boardId);

    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [boardId, setBoard]);

  return stompClient;
};

export default useWebSocket;
