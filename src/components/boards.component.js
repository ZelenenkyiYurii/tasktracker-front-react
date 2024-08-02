import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import { Link } from "react-router-dom";
import CreateBoardModal from "./create-board-modal.component";

const BoardsList = () => {
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
  
    useEffect(() => {
      UserService.getAllBoards().then(
        (response) => {
          setBoards(response.data);
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
  
          console.error(_content);
          setBoards([]);
        }
      );
    }, []);
  
    return (
        <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Boards</h2>
        <ul>
          {boards && boards.length > 0 ? (
            boards.map(board => (
              <li key={board.id}>
                <Link to={`/boards/${board.id}`} className="text-blue-500 hover:underline">
                  {board.title}
                </Link>
              </li>
            ))
          ) : (
            <p>No boards available.</p>
          )}
          
        </ul>
        <div className="App">
            <button onClick={handleOpenModal}>Create New Board</button>
            <CreateBoardModal showModal={showModal} handleClose={handleCloseModal} />
        </div>
      
      </div>
    );
  };

export default BoardsList;