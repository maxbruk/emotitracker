import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext } from '@hello-pangea/dnd';
import useLocalStorage from './hooks/useLocalStorage';
import Column from './components/Column/Column';
import Archive from './components/Archive/Archive';
import FilterBar from './components/FilterBar/FilterBar';
import SettingsModal from './components/SettingsModal/SettingsModal';
import AnalyticsModal from './components/AnalyticsModal/AnalyticsModal';
import './App.css';

export const PREDEFINED_EMOJIS = ['😢', '😍', '💻', '☕', '🚗', '☀️', '🌧️', '🎵', '🍕', '🎉', '😡', '😴', '💪', '📚', '🚀'];

function App() {
  const [items, setItems] = useLocalStorage('emotional-tracker-items', []);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  const [deadlineThresholds, setDeadlineThresholds] = useLocalStorage('emotional-tracker-thresholds', {
    orange: 5,
    red: 2
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState([]);

  const [theme, setTheme] = useLocalStorage('emotional-tracker-theme', 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addTrigger = (text) => {
    const now = new Date().toISOString();
    setItems(prevItems => [
      ...prevItems,
      { id: uuidv4(), text, type: 'trigger', status: 'active', emoji: '😢', createdAt: now, updatedAt: now }
    ]);
  };

  const addJoy = (text) => {
    const now = new Date().toISOString();
    setItems(prevItems => [
      ...prevItems,
      { id: uuidv4(), text, type: 'joy', status: 'active', emoji: '😍', createdAt: now, updatedAt: now }
    ]);
  };

  const resolveItem = (id) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, status: 'archived', updatedAt: new Date().toISOString() } : item
    ));
  };

  const updateItem = (id, updates) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Reordering only allowed within the same column
      return;
    }

    if (source.index === destination.index) return;

    setItems(prevItems => {
      const columnType = source.droppableId; 
      const columnItems = prevItems.filter(i => i.type === columnType && i.status === 'active');
      const draggedItem = columnItems[source.index];
      
      columnItems.splice(source.index, 1);
      columnItems.splice(destination.index, 0, draggedItem);

      const newItems = [];
      let columnIndex = 0;
      
      for (let i = 0; i < prevItems.length; i++) {
        if (prevItems[i].type === columnType && prevItems[i].status === 'active') {
          newItems.push(columnItems[columnIndex]);
          columnIndex++;
        } else {
          newItems.push(prevItems[i]);
        }
      }
      
      return newItems;
    });
  };

  const isSameDate = (isoString, dateString) => {
    if (!isoString) return true;
    const itemDate = new Date(isoString).toISOString().split('T')[0];
    return itemDate === dateString;
  };

  const filteredItems = items.filter(item => {
    const matchesDate = selectedDate 
      ? (isSameDate(item.createdAt, selectedDate) || isSameDate(item.updatedAt, selectedDate))
      : true;
    
    const matchesEmoji = selectedEmojis.length > 0
      ? selectedEmojis.includes(item.emoji || (item.type === 'trigger' ? '😢' : '😍'))
      : true;

    return matchesDate && matchesEmoji;
  });

  const triggers = filteredItems.filter(item => item.type === 'trigger' && item.status === 'active');
  const joys = filteredItems.filter(item => item.type === 'joy' && item.status === 'active');
  const archived = filteredItems.filter(item => item.status === 'archived');

  return (
    <div className="app-container">
      <header className="header">
        <h1>Эмоциональный Чек-лист</h1>
        <div className="header-actions">
          <button className="analytics-btn" onClick={() => setIsAnalyticsOpen(true)} title="Аналитика">
            📊 Графики
          </button>
          <button className="settings-btn" onClick={() => setIsSettingsOpen(true)}>
            ⚙️ Настройки
          </button>
          <button className="archive-btn" onClick={() => setIsArchiveOpen(true)}>
            <span className="icon">📂</span> Архив
          </button>
        </div>
      </header>

      <FilterBar 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        selectedEmojis={selectedEmojis}
        setSelectedEmojis={setSelectedEmojis}
        items={items.filter(i => i.status === 'active')}
      />

      <main className="main-content">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="columns-wrapper">
            <div className="column-container">
              <Column 
                id="trigger"
                title="Триггеры" 
                type="trigger" 
                items={triggers}
                onAdd={addTrigger}
                onResolve={resolveItem}
                onUpdate={updateItem}
                thresholds={deadlineThresholds}
              />
            </div>
            <div className="column-container">
              <Column 
                id="joy"
                title="Радости" 
                type="joy" 
                items={joys}
                onAdd={addJoy}
                onResolve={resolveItem}
                onUpdate={updateItem}
                thresholds={deadlineThresholds}
              />
            </div>
          </div>
        </DragDropContext>
      </main>

      <Archive 
        isOpen={isArchiveOpen} 
        onClose={() => setIsArchiveOpen(false)} 
        items={archived} 
        onUpdate={updateItem}
        onDelete={deleteItem}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        thresholds={deadlineThresholds} 
        onSave={setDeadlineThresholds}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        items={items}
      />
    </div>
  );
}

export default App;

