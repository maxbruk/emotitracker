import React, { useState } from 'react';
import styles from './SettingsModal.module.css';

const SettingsModal = ({ isOpen, onClose, thresholds, onSave }) => {
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
          <h2 className={styles.title}>Настройки дедлайнов</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.body}>
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

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
          <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
