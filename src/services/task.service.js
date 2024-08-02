import api from "./api";

const API_URL = '/tasks';

const createTask = (title,description,taskListId) => {
    return api.post(API_URL, { title,description,taskListId });
};
const deleteTask=(id)=>{
    return api.delete(API_URL+"/"+id,{})
}

const TaskService ={
    createTask,
    deleteTask
};
export default TaskService;