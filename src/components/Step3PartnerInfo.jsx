import useInviteStore from '../store/inviteStore';

const Step3PartnerInfo = () => {
  const { partnerInfo, updatePartnerInfo, setStep } = useInviteStore();
  const isComplete = partnerInfo.name.trim() !== '';

  const inputStyle = {
    width: '100%',
    padding: '16px',
    background: '#252525',
    border: '2px solid #333',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '16px',
    marginBottom: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <h2 style={{ color: '#fff' }}>Кого приглашаешь?</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Сделаем приглашение личным
      </p>

      <input
        type="text"
        placeholder="Имя этого человека"
        value={partnerInfo.name}
        onChange={(e) => updatePartnerInfo({ name: e.target.value })}
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => updatePartnerInfo({ gender: 'male' })}
          style={{
            flex: 1,
            padding: '16px',
            background: partnerInfo.gender === 'male' ? '#2a1a20' : '#252525',
            border: `2px solid ${partnerInfo.gender === 'male' ? '#ff3366' : '#333'}`,
            borderRadius: '14px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          🦸‍♂️ Парня
        </button>
        <button
          onClick={() => updatePartnerInfo({ gender: 'female' })}
          style={{
            flex: 1,
            padding: '16px',
            background: partnerInfo.gender === 'female' ? '#2a1a20' : '#252525',
            border: `2px solid ${partnerInfo.gender === 'female' ? '#ff3366' : '#333'}`,
            borderRadius: '14px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          🦸‍♀️ Девушку
        </button>
      </div>

      <button
        onClick={() => setStep(4)}
        disabled={!isComplete}
        style={{
          width: '100%',
          padding: '16px',
          background: isComplete ? '#ff3366' : '#333',
          color: isComplete ? '#fff' : '#666',
          border: 'none',
          borderRadius: '14px',
          fontSize: '17px',
          cursor: isComplete ? 'pointer' : 'not-allowed',
          marginBottom: '8px',
        }}
      >
        Почти готово!
      </button>
      
      <button
        onClick={() => setStep(2)}
        style={{
          width: '100%',
          padding: '16px',
          background: 'transparent',
          color: '#ff6b8a',
          border: '1px solid #333',
          borderRadius: '14px',
          fontSize: '17px',
          cursor: 'pointer',
        }}
      >
        ← Назад
      </button>
    </div>
  );
};

export default Step3PartnerInfo;
