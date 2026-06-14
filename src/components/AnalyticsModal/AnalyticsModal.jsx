import React, { useMemo, useEffect } from 'react';
import styles from './AnalyticsModal.module.css';

const AnalyticsModal = ({ isOpen, onClose, items }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const analytics = useMemo(() => {
    const triggers = items.filter(i => i.type === 'trigger');
    const joys = items.filter(i => i.type === 'joy');

    const activeTriggers = triggers.filter(i => i.status === 'active');
    const activeJoys = joys.filter(i => i.status === 'active');
    const archivedTriggers = triggers.filter(i => i.status === 'archived');
    const archivedJoys = joys.filter(i => i.status === 'archived');

    // Last 7 days data
    const now = new Date();
    const days = [];
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        label: dayNames[date.getDay()],
        date: dateStr,
        dateShort: `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
      });
    }

    const triggersByDay = days.map(day => ({
      ...day,
      count: triggers.filter(item => 
        item.createdAt && item.createdAt.startsWith(day.date)
      ).length,
    }));

    const joysByDay = days.map(day => ({
      ...day,
      count: joys.filter(item => 
        item.createdAt && item.createdAt.startsWith(day.date)
      ).length,
    }));

    const maxTriggerCount = Math.max(1, ...triggersByDay.map(d => d.count));
    const maxJoyCount = Math.max(1, ...joysByDay.map(d => d.count));

    // Top emojis
    const getTopEmojis = (itemList, defaultEmoji) => {
      const counts = {};
      itemList.forEach(item => {
        const e = item.emoji || defaultEmoji;
        counts[e] = (counts[e] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emoji, count]) => ({ emoji, count }));
    };

    const topTriggerEmojis = getTopEmojis(triggers, '😢');
    const topJoyEmojis = getTopEmojis(joys, '😍');

    // Resolve rate
    const triggerResolveRate = triggers.length > 0 
      ? Math.round((archivedTriggers.length / triggers.length) * 100) 
      : 0;
    const joyArchiveRate = joys.length > 0 
      ? Math.round((archivedJoys.length / joys.length) * 100) 
      : 0;

    return {
      triggersByDay, joysByDay,
      maxTriggerCount, maxJoyCount,
      activeTriggers: activeTriggers.length,
      activeJoys: activeJoys.length,
      archivedTriggers: archivedTriggers.length,
      archivedJoys: archivedJoys.length,
      totalTriggers: triggers.length,
      totalJoys: joys.length,
      topTriggerEmojis, topJoyEmojis,
      triggerResolveRate, joyArchiveRate,
    };
  }, [items]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📊 Аналитика</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.body}>
          <div className={styles.chartsGrid}>
            {/* Triggers Chart */}
            <div className={`${styles.chartSection} ${styles.triggerSection}`}>
              <h3 className={styles.chartTitle}>🔴 Триггеры</h3>
              
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{analytics.activeTriggers}</span>
                  <span className={styles.statLabel}>Активных</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{analytics.archivedTriggers}</span>
                  <span className={styles.statLabel}>Решено</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{analytics.triggerResolveRate}%</span>
                  <span className={styles.statLabel}>Успех</span>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barChart}>
                  {analytics.triggersByDay.map((day, i) => (
                    <div key={i} className={styles.barColumn}>
                      <div className={styles.barValue}>{day.count > 0 ? day.count : ''}</div>
                      <div className={styles.barTrack}>
                        <div 
                          className={`${styles.bar} ${styles.triggerBar}`}
                          style={{ 
                            height: `${(day.count / analytics.maxTriggerCount) * 100}%`,
                            animationDelay: `${i * 0.08}s`
                          }}
                        />
                      </div>
                      <div className={styles.barLabel}>{day.label}</div>
                      <div className={styles.barDate}>{day.dateShort}</div>
                    </div>
                  ))}
                </div>
              </div>

              {analytics.topTriggerEmojis.length > 0 && (
                <div className={styles.topEmojis}>
                  <span className={styles.topLabel}>Топ причины:</span>
                  <div className={styles.emojiList}>
                    {analytics.topTriggerEmojis.map((item, i) => (
                      <span key={i} className={styles.emojiItem}>
                        <span className={styles.emojiIcon}>{item.emoji}</span>
                        <span className={styles.emojiCount}>×{item.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Joys Chart */}
            <div className={`${styles.chartSection} ${styles.joySection}`}>
              <h3 className={styles.chartTitle}>🟢 Радости</h3>
              
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{analytics.activeJoys}</span>
                  <span className={styles.statLabel}>Активных</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{analytics.archivedJoys}</span>
                  <span className={styles.statLabel}>В архиве</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{analytics.joyArchiveRate}%</span>
                  <span className={styles.statLabel}>Архивировано</span>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barChart}>
                  {analytics.joysByDay.map((day, i) => (
                    <div key={i} className={styles.barColumn}>
                      <div className={styles.barValue}>{day.count > 0 ? day.count : ''}</div>
                      <div className={styles.barTrack}>
                        <div 
                          className={`${styles.bar} ${styles.joyBar}`}
                          style={{ 
                            height: `${(day.count / analytics.maxJoyCount) * 100}%`,
                            animationDelay: `${i * 0.08}s`
                          }}
                        />
                      </div>
                      <div className={styles.barLabel}>{day.label}</div>
                      <div className={styles.barDate}>{day.dateShort}</div>
                    </div>
                  ))}
                </div>
              </div>

              {analytics.topJoyEmojis.length > 0 && (
                <div className={styles.topEmojis}>
                  <span className={styles.topLabel}>Топ радостей:</span>
                  <div className={styles.emojiList}>
                    {analytics.topJoyEmojis.map((item, i) => (
                      <span key={i} className={styles.emojiItem}>
                        <span className={styles.emojiIcon}>{item.emoji}</span>
                        <span className={styles.emojiCount}>×{item.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
