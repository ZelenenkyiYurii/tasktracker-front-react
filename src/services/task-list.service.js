import api from "./api";

const API_URL = '/taskLists';

const createTaskList = (title,boardId) => {
    return api.post(API_URL, { title, boardId});
};
const deleteTaskList=(id)=>{
    return api.delete(API_URL+"/"+id,{})
}

const TaskListService ={
    createTaskList,
    deleteTaskList
};
export default TaskListService;