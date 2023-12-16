import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchTasks, deleteTask } from '../store/tasksSlice'
import EditTaskModal from './EditTaskModal';

const TasksTable = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(null);


  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    let intervalId = null;

    if (timerRunning) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [timerRunning]);

  const toggleTimer = () => {
    if (!timerRunning) {
      setTimerStartTime(new Date()); // Set start time when the timer starts
    } else {
      // Timer is stopping
      setTimer(0); 
      openCreateTaskModal(); // Function to open the create task modal
    }
    setTimerRunning(!timerRunning);
  };

  const openCreateTaskModal = () => {
    const endTime = new Date();
    const newTask = {
      title: '',
      description: '',
      start_time: timerStartTime,
      end_time: endTime
    };
  
    setCurrentTask(newTask);
    setIsCreateModalOpen(true);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(val => val < 10 ? `0${val}` : val)
      .join(':');
  };

  const handleCreate = () => {
    setCurrentTask(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setCurrentTask(taskToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId))
      .catch(error => console.error('Error deleting task: ', error));
  }

  return (
    <div className="overflow-auto">
      <div className="d-flex justify-content-between align-items-center p-4 bg-light">
        <h1 className="h1">Tasks</h1>
        <div className="d-flex align-items-center">
          <span className="me-3">{formatTime(timer)}</span>
          <FontAwesomeIcon icon={timerRunning ? faStop : faPlay} className="cursor-pointer me-3" onClick={toggleTimer} />
          <FontAwesomeIcon icon={faPlus} className="cursor-pointer" onClick={handleCreate} />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr className="bg-light">
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="text-wrap" style={{ maxWidth: '200px' }}>{task.title}</td>
                <td className="text-wrap" style={{ maxWidth: '200px' }}>{task.description}</td>
                <td>{moment(task.start_time).format('MMMM Do YYYY, h:mm a')}</td>
                <td>{moment(task.end_time).format('MMMM Do YYYY, h:mm a')}</td>
                <td>
                  <FontAwesomeIcon icon={faEdit} className="cursor-pointer me-2" onClick={() => handleEdit(task.id)} />
                  <FontAwesomeIcon icon={faTrashAlt} className="cursor-pointer" onClick={() => handleDelete(task.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && <EditTaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} task={currentTask} />}
      {isCreateModalOpen && <EditTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} task={currentTask} />}
    </div>
  );
};

export default TasksTable;