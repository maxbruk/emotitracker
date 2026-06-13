import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from '../Card/Card';
import styles from './Column.module.css';

const Column = ({ id, title, type, items, onAdd, onResolve, onUpdate, thresholds }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={`${styles.column} ${styles[type]}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.counter}>{items.length}</span>
      </div>
      
      <form data-testid="add-form" className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Добавить..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className={styles.addBtn}>
          +
        </button>
      </form>

      <Droppable droppableId={id}>
        {(provided) => (
          <div 
            className={styles.list}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Card
                key={item.id}
                index={index}
                id={item.id}
                type={item.type}
                text={item.text}
                status={item.status}
                emoji={item.emoji}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
                deadline={item.deadline}
                onResolve={() => onResolve(item.id)}
                onUpdate={onUpdate}
                thresholds={thresholds}
              />
            ))}
            {provided.placeholder}
            {items.length === 0 && (
              <div className={styles.emptyState}>
                Пока ничего нет. Добавьте первую запись!
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
