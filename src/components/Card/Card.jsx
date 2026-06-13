import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import styles from './Card.module.css';
import EmojiPicker from '../EmojiPicker/EmojiPicker';

const Card = ({ id, index, type, text, status = 'active', emoji, createdAt, updatedAt, deadline, onResolve, onUpdate, onDelete, thresholds }) => {
  const [isResolving, setIsResolving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);
  
  // Separate date and time inputs
  const [deadlineDateInput, setDeadlineDateInput] = useState('');
  const [deadlineTimeInput, setDeadlineTimeInput] = useState('');
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleResolve = () => {
    setIsResolving(true);
    
    // Dopamine Confetti
    if (type === 'trigger') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d4f', '#ffc53d', '#73d13d', '#40a9ff']
      });
    }

    setTimeout(() => {
      onResolve && onResolve(id);
    }, 1500); // Wait for animation
  };

  const handleArchiveJoy = () => {
    onResolve && onResolve(id);
  };

  const handleTextChange = (e) => {
    setEditValue(e.target.value);
  };

  const saveText = () => {
    setIsEditing(false);
    if (editValue.trim() !== text && editValue.trim() !== '') {
      onUpdate && onUpdate(id, { text: editValue.trim() });
    } else {
      setEditValue(text); // Reset if empty
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveText();
    }
  };

  const handleEmojiSelect = (newEmoji) => {
    setShowEmojiPicker(false);
    if (newEmoji !== emoji) {
      onUpdate && onUpdate(id, { emoji: newEmoji });
    }
  };

  const openDeadlineEditor = () => {
    if (deadline) {
      const d = new Date(deadline);
      const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, -1);
      
      const [datePart, timePartWithMs] = localISOTime.split('T');
      setDeadlineDateInput(datePart);
      setDeadlineTimeInput(timePartWithMs.substring(0, 5));
    } else {
      setDeadlineDateInput('');
      setDeadlineTimeInput('');
    }
    setIsAddingDeadline(true);
  };

  const saveDeadline = () => {
    if (deadlineDateInput) {
      const timePart = deadlineTimeInput || '23:59';
      // Create local date object
      const localDateString = `${deadlineDateInput}T${timePart}:00`;
      onUpdate && onUpdate(id, { deadline: new Date(localDateString).toISOString() });
    }
    setIsAddingDeadline(false);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('ru-RU', { 
        day: '2-digit', month: '2-digit', year: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const getDeadlineProgress = () => {
    if (!deadline || !createdAt) return null;
    const start = new Date(createdAt).getTime();
    const end = new Date(deadline).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return { percent: 100, colorClass: styles.progressRed, text: 'Дедлайн истек!' };
    
    const timeLeft = end - now;
    // To match user expectation (short deadlines look almost full even if just created):
    // We assume a minimum reference window of 7 days (or actual duration if longer)
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const referenceDuration = Math.max(end - start, SEVEN_DAYS);
    
    const percent = Math.max(0, Math.min(100, 100 - (timeLeft / referenceDuration) * 100));
    
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    const totalHoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const daysLeftExact = Math.floor(totalHoursLeft / 24);
    const hoursRemainder = totalHoursLeft % 24;
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    let text = '';
    if (daysLeftExact === 0) {
      if (totalHoursLeft === 0) {
        text = `Осталось: ${minutesLeft} мин.`;
      } else {
        text = `Осталось: ${totalHoursLeft} ч. ${minutesLeft} мин.`;
      }
    } else if (daysLeftExact < 3) {
      text = `Осталось: ${daysLeftExact} дн. и ${hoursRemainder} ч.`;
    } else {
      text = `Осталось: ${daysLeftExact} дн.`;
    }
    
    const orangeThreshold = thresholds?.orange ?? 5;
    const redThreshold = thresholds?.red ?? 2;
    
    let colorClass = styles.progressGreen;
    if (daysLeft <= redThreshold) colorClass = styles.progressRed;
    else if (daysLeft <= orangeThreshold) colorClass = styles.progressOrange;
    
    return { percent, colorClass, text };
  };

  if (isResolving) {
    return (
      <div className={`${styles.card} ${styles.resolving}`}>
        <div className={styles.happyEmoji}>😃</div>
        <div className={styles.resolveText}>
          {type === 'trigger' ? 'Ей, минус один триггер!' : 'Отправлено в архив!'}
        </div>
      </div>
    );
  }

  const isArchived = status === 'archived';
  const displayEmoji = emoji || (type === 'trigger' ? '😢' : '😍');
  const progressData = getDeadlineProgress();

  const cardInner = (draggableProvided = null) => {
    const dragProps = draggableProvided ? draggableProvided.draggableProps : {};
    const dragHandleProps = draggableProvided ? draggableProvided.dragHandleProps : {};
    const innerRef = draggableProvided ? draggableProvided.innerRef : null;

    const style = draggableProvided ? draggableProvided.draggableProps.style : {};

    return (
      <div 
        ref={innerRef}
        {...dragProps}
        style={style}
        className={`${styles.card} ${styles[type]} ${isArchived ? styles.archived : ''} ${showEmojiPicker ? styles.cardWithPicker : ''}`}
      >
        {/* Drag handle area (only for active items) */}
        {!isArchived && draggableProvided && (
          <div className={styles.dragHandle} {...dragHandleProps}>
            &#8942;&#8942;
          </div>
        )}

        {isArchived && onDelete && (
          <button 
            className={styles.deleteBtn} 
            onClick={() => onDelete(id)}
            title="Удалить навсегда"
          >
            &times;
          </button>
        )}

        <div className={styles.content}>
          <div className={styles.emojiContainer}>
            <span 
              className={`${styles.emoji} ${!isArchived ? styles.clickableEmoji : ''}`}
              onClick={() => !isArchived && setShowEmojiPicker(!showEmojiPicker)}
            >
              {displayEmoji}
            </span>
            {showEmojiPicker && (
              <EmojiPicker 
                onSelect={handleEmojiSelect} 
                onClose={() => setShowEmojiPicker(false)} 
              />
            )}
          </div>
          
          <div className={styles.textContainer}>
            {isEditing && !isArchived ? (
              <input
                ref={inputRef}
                type="text"
                className={styles.editInput}
                value={editValue}
                onChange={handleTextChange}
                onBlur={saveText}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <p 
                className={`${styles.text} ${!isArchived ? styles.editableText : ''}`} 
                onClick={() => !isArchived && setIsEditing(true)}
                title={!isArchived ? "Нажмите, чтобы редактировать" : ""}
              >
                {text}
              </p>
            )}
          </div>
        </div>

        {progressData && !isArchived && !isAddingDeadline && (
          <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
              <span 
                className={styles.progressLabel} 
                onClick={openDeadlineEditor}
                title="Изменить дедлайн"
              >
                Дедлайн: {formatDate(deadline)} ✏️
              </span>
              <span className={styles.progressTime}>{progressData.text}</span>
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={`${styles.progressBarFill} ${progressData.colorClass}`} 
                style={{ width: `${progressData.percent}%` }}
              />
            </div>
          </div>
        )}

        {isAddingDeadline && !isArchived && (
          <div className={styles.deadlineInputContainer}>
            <input 
              type="date" 
              value={deadlineDateInput}
              onChange={(e) => setDeadlineDateInput(e.target.value)}
              className={styles.dateInput}
            />
            <input 
              type="time" 
              value={deadlineTimeInput}
              onChange={(e) => setDeadlineTimeInput(e.target.value)}
              className={styles.dateInput}
            />
            <button className={styles.saveDeadlineBtn} onClick={saveDeadline}>✓</button>
            <button className={styles.cancelDeadlineBtn} onClick={() => setIsAddingDeadline(false)}>✕</button>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.dates}>
            {createdAt && <span>Создано: {formatDate(createdAt)}</span>}
          </div>
          
          <div className={styles.actions}>
            {!isArchived && type === 'trigger' && !deadline && !isAddingDeadline && (
              <button className={styles.addDeadlineBtn} onClick={openDeadlineEditor}>
                ⏱ Дедлайн
              </button>
            )}

            {!isArchived && type === 'trigger' && (
              <button className={styles.resolveBtn} onClick={handleResolve}>
                Избавиться
              </button>
            )}
            {!isArchived && type === 'joy' && (
              <button className={`${styles.resolveBtn} ${styles.archiveJoyBtn}`} onClick={handleArchiveJoy}>
                В архив
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Use Draggable if index is provided (e.g. inside Droppable Column)
  if (index !== undefined) {
    return (
      <Draggable draggableId={id} index={index} isDragDisabled={isArchived}>
        {(provided, snapshot) => cardInner(provided)}
      </Draggable>
    );
  }

  // Render static card for Archive
  return cardInner(null);
};

export default Card;
