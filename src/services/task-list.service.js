import api from "./api";

const API_URL = '/taskLists';

const createTaskList = (title,boardId) => {
    return api.post(API_URL, { title, boardId});
};
const deleteTaskList=(id)=>{
    return api.delete(API_URL+"/"+id,{})
}
const updateTaskList=(id,title,position)=>{
    return api.put(API_URL+"/"+id,{title,position})
}
const changePosition=(id,title,boardId,position)=>{
    return api.put(API_URL+"/position/"+id,{title,boardId,position})
}

const TaskListService ={
    createTaskList,
    deleteTaskList,
    updateTaskList,
    changePosition
};
export default TaskListService;