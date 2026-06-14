import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Синхронизация</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.iconContainer}>
            ☁️
          </div>
          <p className={styles.description}>
            Авторизуйтесь через Google, чтобы надежно сохранить ваши карточки в облаке и синхронизировать их между всеми вашими устройствами.
          </p>
          <button className={styles.googleBtn} onClick={handleLogin}>
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className={styles.googleIcon}
            />
            Войти через Google
          </button>
          <p className={styles.note}>
            Вы можете продолжить использовать трекер и без авторизации (данные будут сохранены локально в браузере).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
