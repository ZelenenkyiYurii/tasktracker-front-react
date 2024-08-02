import api from "./api";

const API_URL = '/boards';

const createBoard = (title) => {
    return api.post(API_URL, { title });
};

const BoardService ={
    createBoard
};
export default BoardService;