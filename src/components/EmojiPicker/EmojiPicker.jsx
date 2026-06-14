import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './EmojiPicker.module.css';
import { PREDEFINED_EMOJIS } from '../../App';

const EmojiPicker = ({ onSelect, onClose, anchorRef }) => {
  const pickerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'below' });
  const [positioned, setPositioned] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef?.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const pickerHeight = 140; // approximate height of picker
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow >= pickerHeight + 8) {
        setPosition({ top: rect.bottom + 8, left: rect.left, placement: 'below' });
      } else if (spaceAbove >= pickerHeight + 8) {
        setPosition({ top: rect.top - pickerHeight - 8, left: rect.left, placement: 'above' });
      } else {
        // Not enough space above or below — center vertically
        setPosition({ top: Math.max(8, (window.innerHeight - pickerHeight) / 2), left: rect.left, placement: 'below' });
      }
      setPositioned(true);
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current && !pickerRef.current.contains(event.target) &&
        !(anchorRef?.current && anchorRef.current.contains(event.target))
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const pickerStyle = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 9999,
    visibility: positioned ? 'visible' : 'hidden',
  };

  return createPortal(
    <div style={pickerStyle}>
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
    </div>,
    document.body
  );
};

export default EmojiPicker;
