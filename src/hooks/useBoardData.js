import { useEffect, useState } from "react";
import UserService from "../services/user.service";

const useBoardData = (boardId) => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
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
      }
    );
  }, [boardId]);

  return { board, setBoard };
};

export default useBoardData;
