import React, { useRef, useEffect } from 'react';
import styles from './EmojiPicker.module.css';
import { PREDEFINED_EMOJIS } from '../../App';

const EmojiPicker = ({ onSelect, onClose }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className={styles.pickerOverlay}>
      <div className={styles.picker} ref={pickerRef}>
        {PREDEFINED_EMOJIS.map(emoji => (
          <button 
            key={emoji} 
            className={styles.emojiBtn}
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
