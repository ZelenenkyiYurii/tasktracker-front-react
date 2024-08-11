import api from "./api";

const API_URL = '/tasks';

const createTask = (title,description,taskListId) => {
    return api.post(API_URL, { title,description,taskListId });
};
const deleteTask=(id)=>{
    return api.delete(API_URL+"/"+id,{})
}
const updateTask=(id,title,description,position)=>{
    return api.put(API_URL+"/"+id,{title,description,position});
}
const changePosition=(taskId,sourceId,destinationId,sourceIndex,destinationIndex)=>{
    return api.put(API_URL+"/position/"+taskId,{sourceId,destinationId,sourceIndex,destinationIndex})
}

const TaskService ={
    createTask,
    deleteTask,
    updateTask,
    changePosition
};
export default TaskService;