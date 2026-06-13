import React from 'react';
import styles from './FilterBar.module.css';
import { PREDEFINED_EMOJIS } from '../../App';

const FilterBar = ({ selectedDate, setSelectedDate, selectedEmojis, setSelectedEmojis, items = [] }) => {
  const toggleEmoji = (emoji) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedEmojis([]);
  };

  const getEmojiCount = (emoji) => {
    return items.filter(i => (i.emoji || (i.type === 'trigger' ? '😢' : '😍')) === emoji).length;
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.dateFilter}>
        <label htmlFor="date-filter">📅 Дата:</label>
        <input 
          id="date-filter"
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.emojiFilter}>
        <span className={styles.label}>Фильтр:</span>
        <div className={styles.emojiList}>
          {PREDEFINED_EMOJIS.map(emoji => {
            const count = getEmojiCount(emoji);
            const isSelected = selectedEmojis.includes(emoji);
            return (
              <div key={emoji} className={styles.emojiWrapper}>
                <button
                  className={`${styles.emojiBtn} ${isSelected ? styles.active : ''}`}
                  onClick={() => toggleEmoji(emoji)}
                >
                  {emoji}
                </button>
                {isSelected && count > 0 && (
                  <span className={styles.badge}>{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(selectedDate || selectedEmojis.length > 0) && (
        <button className={styles.clearBtn} onClick={clearFilters}>
          Сбросить фильтры
        </button>
      )}
    </div>
  );
};

export default FilterBar;
