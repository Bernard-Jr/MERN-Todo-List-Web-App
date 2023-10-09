import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedTask, setEditedTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/get')
        .then(result => setTodos(result.data))
        .catch(err => console.log(err))
    }, [])

    const handleEdit = (id) => {
        setEditingId(id);
        const todoToEdit = todos.find(todo => todo._id === id);
        setEditedTask(todoToEdit.task);
    }

    const handleSaveEdit = (id) => {
        axios.put('http://localhost:3001/update/' + id, { task: editedTask })
        .then(result => {
            setEditingId(null);
            setEditedTask('');
            const updatedTodos = todos.map(todo => {
                if (todo._id === id) {
                    return {
                        ...todo,
                        task: editedTask
                    };
                }
                return todo;
            });
            setTodos(updatedTodos);
        })
        .catch(err => console.log(err))
    }

    const handleToggleDone = (id) => {
        axios.put('http://localhost:3001/update/' + id)
        .then(result => {
            const updatedTodos = todos.map(todo => {
                if (todo._id === id) {
                    return {
                        ...todo,
                        done: !todo.done
                    };
                }
                return todo;
            });
            setTodos(updatedTodos);
        })
        .catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/delete/' + id)
        .then(result => {
            const updatedTodos = todos.filter(todo => todo._id !== id);
            setTodos(updatedTodos);
        })
        .catch(err => console.log(err))
    }

    const activeTasks = todos.filter(todo => !todo.done);
    const completedTasks = todos.filter(todo => todo.done);

    return (
        <div className="home">
            <div className='title'>
                <h1>Todo List</h1>
            </div>
            <Create />
            <br />
            {activeTasks.length === 0 && completedTasks.length === 0 && (
                <div>
                    <h2>No tasks for the day</h2>
                </div>
            )}
            {activeTasks.length > 0 && (
                <div>
                    <h2>Active Tasks</h2>
                    {activeTasks.map(todo => (
                        <div className="task" key={todo._id}>
                            <div className="task-content">
                                <div className="checkbox">
                                    <span onClick={() => handleToggleDone(todo._id)}>
                                        {todo.done ? 
                                            <BsFillCheckCircleFill className='icon checkmark'></BsFillCheckCircleFill>
                                        : <BsCircleFill className="icon circle" title='Mark as done'/>
                                        }
                                    </span>
                                    {editingId === todo._id ? (
                                        <input
                                            type="text"
                                            value={editedTask}
                                            onChange={(e) => setEditedTask(e.target.value)}
                                        />
                                    ) : (
                                        <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                                    )}
                                </div>
                            </div>
                            <div className="action-icons">
                                {editingId !== todo._id ? (
                                    <FaEdit className="icon edit-icon" onClick={() => handleEdit(todo._id)} title='Edit task'/>
                                ) : (
                                    <button onClick={() => handleSaveEdit(todo._id)}>Save</button>
                                )}
                                <AiFillDelete className="icon delete-icon" onClick={() => handleDelete(todo._id)} title='Delete task'/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
    
            {completedTasks.length > 0 && (
                <div>
                    <h2>Completed Tasks</h2>
                    {completedTasks.map(todo => (
                        <div className="task completed" key={todo._id}>
                            <div className="task-content">
                                <div className="checkbox">
                                    <span onClick={() => handleToggleDone(todo._id)}>
                                        <BsFillCheckCircleFill className='icon checkmark'></BsFillCheckCircleFill>
                                    </span>
                                    <p className="line_through">{todo.task}</p>
                                </div>
                            </div>
                            <div className="action-icons">
                                <AiFillDelete className="icon delete-icon" onClick={() => handleDelete(todo._id)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
    
            {activeTasks.length === 0 && completedTasks.length > 0 && (
                <div>
                    <h2>You're done for the day, good job!</h2>
                </div>
            )}
        </div>
    );
}

export default Home;
