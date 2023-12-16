import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../store/tasksSlice';


const EditTaskModal = ({ isOpen, onClose, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const dispatch = useDispatch();

  const isCreateMode = task === null;

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStartTime(task.start_time ? moment(task.start_time).format('YYYY-MM-DDTHH:mm') : '');
      setEndTime(task.end_time ? moment(task.end_time).format('YYYY-MM-DDTHH:mm') : '');
    } else {
      setTitle('');
      setDescription('');
      const now = new Date();
      setStartTime(moment(now).format('YYYY-MM-DDTHH:mm'));
      setEndTime(moment(now).format('YYYY-MM-DDTHH:mm'));
    }
  }, [task]);

  const handleSave = () => {
    const formattedStartTime = moment(startTime).toISOString();
    const formattedEndTime = moment(endTime).toISOString();

    const taskData = {
      title,
      description,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    };

    if (task && task.id) {
      taskData.id = task.id;
      dispatch(updateTask(taskData)).then(() => {
        onClose();
      }).catch(error => {
        console.error('There was an error updating the task:', error);
      });
    } else {
      dispatch(createTask(taskData)).then(() => {
        onClose();
      });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isCreateMode ? 'Create Task' : 'Edit Task'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea 
                  className="form-control" 
                  placeholder="Description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
