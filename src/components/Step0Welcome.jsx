import useInviteStore from '../store/inviteStore';

const Step0Welcome = () => {
  const { setPlanningMode, setStep } = useInviteStore();

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>💝</div>
        <h1 style={{ fontSize: '32px', marginBottom: '15px', color: '#fff' }}>
          Приглашение на свидание
        </h1>
        <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.5' }}>
          Создай уникальное приглашение
          <br />
          для особенного человека
        </p>
      </div>

      <div style={{
        background: '#252525',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
      }}>
        <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.6' }}>
          <span style={{ fontSize: '20px' }}>💡</span>{' '}
          <strong>Пример приглашения:</strong>
          <br />
          <span style={{ color: '#888' }}>
            "Привет! Я приглашаю тебя на свидание в уютное кафе. 
            Будем есть пиццу и говорить обо всём на свете..."
          </span>
        </p>
      </div>

      <button
        onClick={() => {
          setPlanningMode('self');
          setStep(1);
        }}
        style={{
          width: '100%',
          padding: '18px',
          background: '#ff3366',
          color: '#fff',
          border: 'none',
          borderRadius: '14px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '12px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        🎯 Спланирую сам
      </button>

      <button
        onClick={() => {
          setPlanningMode('partner');
          setStep(1);
        }}
        style={{
          width: '100%',
          padding: '18px',
          background: 'transparent',
          color: '#00b894',
          border: '2px solid #00b894',
          borderRadius: '14px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(0, 184, 148, 0.1)'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        💑 Хочу знать выбор партнёра
      </button>

      <p style={{ 
        color: '#666', 
        fontSize: '12px', 
        textAlign: 'center',
        marginTop: '20px',
      }}>
        В режиме "Выбор партнёра" — партнёр сам выберет удобное время и блюда
      </p>
    </div>
  );
};

export default Step0Welcome;