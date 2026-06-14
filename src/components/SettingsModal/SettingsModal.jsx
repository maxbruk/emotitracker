import React, { useState } from 'react';
import styles from './SettingsModal.module.css';

const SettingsModal = ({ isOpen, onClose, thresholds, onSave, theme, onToggleTheme }) => {
  const [orangeDays, setOrangeDays] = useState(thresholds.orange);
  const [redDays, setRedDays] = useState(thresholds.red);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      orange: parseInt(orangeDays, 10),
      red: parseInt(redDays, 10),
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Настройки</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Тема оформления</h3>
            <div className={styles.themeToggle}>
              <span className={`${styles.themeLabel} ${theme === 'light' ? styles.themeLabelActive : ''}`}>☀️ Светлая</span>
              <button 
                className={`${styles.toggleSwitch} ${theme === 'dark' ? styles.toggleActive : ''}`}
                onClick={onToggleTheme}
                aria-label="Переключить тему"
              >
                <span className={styles.toggleKnob} />
              </button>
              <span className={`${styles.themeLabel} ${theme === 'dark' ? styles.themeLabelActive : ''}`}>🌙 Тёмная</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Дедлайны</h3>
            <p className={styles.description}>
              Укажите, за сколько дней до дедлайна цвет прогресс-бара должен меняться.
            </p>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.colorDot} style={{backgroundColor: '#faad14'}}></span>
                Оранжевый цвет (осталось дней меньше чем):
              </label>
              <input 
                type="number" 
                min="0"
                value={orangeDays} 
                onChange={(e) => setOrangeDays(e.target.value)} 
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.colorDot} style={{backgroundColor: '#f5222d'}}></span>
                Красный цвет (осталось дней меньше чем):
              </label>
              <input 
                type="number" 
                min="0"
                value={redDays} 
                onChange={(e) => setRedDays(e.target.value)} 
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
          <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

