import React from 'react';
import Card from '../Card/Card';
import styles from './Archive.module.css';

const Archive = ({ isOpen, onClose, items, onUpdate, onDelete }) => {
  const triggers = items.filter(i => i.type === 'trigger');
  const joys = items.filter(i => i.type === 'joy');

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={onClose}
      />
      <div 
        data-testid="archive-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.closed}`}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Архив</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.list}>
          {items.length === 0 && (
            <div className={styles.emptyState}>
              В архиве пока пусто.
            </div>
          )}

          {triggers.length > 0 && (
            <div className={styles.archiveSection}>
              <h3 className={styles.sectionTitle}>Решенные Триггеры</h3>
              {triggers.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  text={item.text}
                  status={item.status}
                  emoji={item.emoji}
                  createdAt={item.createdAt}
                  updatedAt={item.updatedAt}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}

          {joys.length > 0 && (
            <div className={styles.archiveSection}>
              <h3 className={styles.sectionTitle}>Прошлые Радости</h3>
              {joys.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  text={item.text}
                  status={item.status}
                  emoji={item.emoji}
                  createdAt={item.createdAt}
                  updatedAt={item.updatedAt}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Archive;
