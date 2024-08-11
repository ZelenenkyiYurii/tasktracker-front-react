import React, { useState } from 'react';
import TaskService from '../services/task.service';

const CreateTaskModal = ({ showModal, handleClose, taskListId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateTask = () => {
        TaskService.createTask(title, description, taskListId)
            .then(response => {
                console.log('Task created:', response.data);
                handleClose();
                setTitle("");
                setDescription("");
            })
            .catch(error => {
                console.error('There was an error creating the task!', error);
            });
        
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="rounded-lg p-8 shadow-lg bg-green-500 relative">
                <button
                    className="text-gray-500 hover:text-gray-700 absolute top-2 right-5 scale-150"
                    onClick={handleClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Create New Task</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full p-2 border rounded mb-4 text-black"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    className="w-full p-2 border rounded mb-4 text-black"
                />
                <button
                    onClick={handleCreateTask}
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Create Task
                </button>
            </div>
        </div>
    );
};

export default CreateTaskModal;
