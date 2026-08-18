import { useState } from 'react';

const InviteIntro = ({ myName, partnerName, myPhoto, onAccept }) => {
  const [noButtonSize, setNoButtonSize] = useState(1);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [isNoButtonVisible, setIsNoButtonVisible] = useState(true);

  const handleNoHover = () => {
    if (noButtonSize > 0.5) {
      setNoButtonSize(prev => prev - 0.15);
    }
    const maxX = Math.min(200, window.innerWidth * 0.3);
    const maxY = 150;
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    if (noCount >= 3) {
      setIsNoButtonVisible(false);
    } else {
      setNoButtonSize(prev => Math.max(prev - 0.2, 0.3));
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 'clamp(10px, 3vw, 20px)',
      background: '#0a0a0a',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 'min(520px, 100%)',
        background: '#1a1a1a',
        borderRadius: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(20px, 5vw, 40px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {myPhoto ? (
          <div style={{
            width: '100%',
            maxHeight: 'min(300px, 50vh)',
            marginBottom: 'clamp(15px, 3vw, 20px)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '3px solid #ff3366',
            boxShadow: '0 0 30px rgba(255, 51, 102, 0.3)',
            background: '#252525',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={myPhoto}
              alt={myName}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 'min(300px, 50vh)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        ) : (
          <div style={{ 
            fontSize: 'clamp(48px, 12vw, 80px)', 
            marginBottom: 'clamp(15px, 3vw, 20px)',
            background: '#252525',
            padding: 'clamp(20px, 5vw, 40px)',
            borderRadius: '16px',
          }}>💌</div>
        )}
        
        <h1 style={{ 
          fontSize: 'clamp(22px, 5.5vw, 28px)', 
          marginBottom: '10px', 
          color: '#fff',
          wordBreak: 'break-word',
        }}>
          {myName} приглашает {partnerName}
        </h1>
        
        <p style={{ fontSize: 'clamp(16px, 4vw, 18px)', color: '#888', marginBottom: 'clamp(20px, 5vw, 30px)' }}>
          на свидание!
        </p>

        <div style={{ 
          display: 'flex', 
          gap: 'clamp(10px, 2.5vw, 20px)',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative',
        }}>
          <button
            onClick={onAccept}
            style={{
              padding: 'clamp(14px, 3.5vw, 18px) clamp(30px, 8vw, 50px)',
              background: '#ff3366',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              fontSize: 'clamp(18px, 4.5vw, 22px)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 5px 20px rgba(255, 51, 102, 0.4)',
              width: '100%',
              maxWidth: '300px',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ДА! ❤️
          </button>

          {isNoButtonVisible && (
            <button
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}
              style={{
                padding: `${clamp(14, 3.5 * noButtonSize, 18) * noButtonSize}px ${clamp(30, 8 * noButtonSize, 45) * noButtonSize}px`,
                background: '#333',
                color: '#888',
                border: 'none',
                borderRadius: '16px',
                fontSize: `${clamp(16, 4.5 * noButtonSize, 20) * noButtonSize}px`,
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                position: 'relative',
                opacity: noCount >= 3 ? 0.3 : 1,
                maxWidth: '200px',
              }}
            >
              Нет
            </button>
          )}

          {noCount > 0 && noCount < 4 && (
            <p style={{ color: '#666', fontSize: 'clamp(12px, 3vw, 14px)', marginTop: '10px' }}>
              {noCount === 1 && 'Ты уверена? 🤔'}
              {noCount === 2 && 'Подумай ещё раз! 🥺'}
              {noCount === 3 && 'Ну пожалуйста! 🙏'}
            </p>
          )}

          {noCount >= 4 && (
            <p style={{ color: '#ff3366', fontSize: 'clamp(14px, 3.5vw, 16px)', marginTop: '10px', fontWeight: '600' }}>
              Выбора нет! Только ДА! 😄
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const clamp = (min, val, max) => Math.min(Math.max(val, min), max);

export default InviteIntro;