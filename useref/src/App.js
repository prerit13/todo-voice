import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { v4 as uuid } from 'uuid';

function App() {
  const [todo, setTodo] = useState('');
  const [todolist, setTodolist] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript); // Debugging log
        setTodo(prevTodo => prevTodo + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event);
        if (event.error === 'not-allowed') {
          alert('Microphone access is blocked. Please allow microphone access in your browser settings.');
        }
      };

      recognitionRef.current.onaudiostart = () => {
        console.log('Audio capturing started'); // Debugging log
      };

      recognitionRef.current.onaudioend = () => {
        console.log('Audio capturing ended'); // Debugging log
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended'); // Debugging log
      };
    } else {
      alert('Speech Recognition API not supported in this browser');
    }
  }, []);

  const onInputChange = (e) => {
    setTodo(e.target.value);
  };

  const onAddClick = () => {
    if (todo.trim()) {
      setTodolist([...todolist, { id: uuid(), todo, completed: false }]);
      setTodo('');
    }
  };

  const onDeleteClick = (id) => {
    setTodolist(todolist.filter(item => item.id !== id));
  };

  const onToggleCompleted = (id) => {
    setTodolist(todolist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const startRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        console.log('Recognition started'); // Debugging log
      } catch (error) {
        console.error('Error starting recognition', error);
        alert('Failed to start speech recognition. Please check microphone permissions and browser support.');
      }
    } else {
      alert('SpeechRecognition instance is not available.');
    }
  };

  return (
    <div className='App'>
      <div>
        <h1>My wishlist</h1>
      </div>
      <input
        value={todo}
        onChange={onInputChange}
        placeholder='Enter your wishlist.....'
      />
      <button onClick={onAddClick}>Add</button>
      <button onClick={startRecognition}>🎤 Add with Voice</button>
      <div>
        {todolist && todolist.length > 0 && todolist.map(item => (
          <div key={item.id} className="todo-item">
            <label>
              <input
                type='checkbox'
                checked={item.completed}
                onChange={() => onToggleCompleted(item.id)}
              />
              <span className={item.completed ? 'completed' : ''}>
                {item.todo}
              </span>
            </label>
            <button onClick={() => onDeleteClick(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
