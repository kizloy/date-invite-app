import { useState, useEffect } from 'react';
import useInviteStore from '../store/inviteStore';
import { foodOptions, themes } from '../data/themes';
import { saveInvite, listenToInvite } from '../firebase';

const Step4Final = () => {
  const { myProfile, partnerInfo, settings, details, updateDetails, updateSettings, setStep, reset } = useInviteStore();
  const [isGenerated, setIsGenerated] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteId, setInviteId] = useState('');
  const [partnerChoices, setPartnerChoices] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isGenerated && inviteId) {
      const unsubscribe = listenToInvite(inviteId, (data) => {
        if (data.partnerChoices?.accepted) {
          setPartnerChoices(data.partnerChoices);
        }
      });
      return () => unsubscribe();
    }
  }, [isGenerated, inviteId]);

  const generateInvite = async () => {
    setIsSaving(true);
    const uniqueId = `invite_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const inviteData = {
      id: uniqueId,
      myProfile: {
        name: myProfile.name,
        gender: myProfile.gender,
        photo: null,
      },
      partnerInfo,
      settings,
      details,
      planningMode: useInviteStore.getState().planningMode,
      createdAt: new Date().toISOString(),
      partnerChoices: null,
    };
    
    const saved = await saveInvite(uniqueId, inviteData);
    
    if (saved) {
      const link = `${window.location.origin}/?invite=${uniqueId}`;
      setInviteId(uniqueId);
      setInviteLink(link);
      setIsGenerated(true);
    } else {
      alert('Ошибка создания. Попробуйте ещё раз.');
    }
    setIsSaving(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Ссылка скопирована! 📋');
  };

  if (isGenerated && partnerChoices?.accepted) {
    const selectedTheme = themes.find(t => t.id === partnerChoices.selectedTheme);
    const selectedFormat = selectedTheme?.formats.find(f => f.id === partnerChoices.selectedFormat);
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(48px, 10vw, 64px)', marginBottom: '20px' }}>💝</div>
        <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 5vw, 32px)' }}>Приглашение принято!</h2>
        <p style={{ color: '#888', margin: '20px 0' }}>{partnerInfo.name} согласил(ся/ась)! 🎉</p>

        <div style={{ background: '#2a2a00', border: '1px solid #ffcc00', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#ffcc00', fontWeight: '600' }}>📸 Не забудь сделать скриншот!</p>
        </div>

        <div style={{ background: '#252525', padding: '20px', borderRadius: '16px', marginBottom: '20px', textAlign: 'left' }}>
          {selectedTheme && <p style={{ color: '#fff', marginBottom: '10px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}><span style={{ color: '#888' }}>Стиль:</span> {selectedTheme.emoji} {selectedTheme.label}</p>}
          {selectedFormat && <p style={{ color: '#fff', marginBottom: '10px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}><span style={{ color: '#888' }}>Где:</span> {selectedFormat.emoji} {selectedFormat.label}</p>}
          {partnerChoices.selectedFoods?.length > 0 && (
            <p style={{ color: '#fff', marginBottom: '10px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
              <span style={{ color: '#888' }}>Что кушаем:</span>{' '}
              {partnerChoices.selectedFoods.map(foodId => {
                const food = foodOptions.find(f => f.id === foodId);
                return food ? `${food.emoji} ${food.label}` : '';
              }).join(', ')}
            </p>
          )}
          {partnerChoices.selectedDateTime && <p style={{ color: '#fff', marginBottom: '10px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}><span style={{ color: '#888' }}>Дата и время:</span> {new Date(partnerChoices.selectedDateTime).toLocaleString('ru-RU')}</p>}
          {partnerChoices.selectedLocation && <p style={{ color: '#fff', marginBottom: '10px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}><span style={{ color: '#888' }}>Место встречи:</span> 📍 {partnerChoices.selectedLocation}</p>}
        </div>

        <button onClick={() => {
          const dateTime = partnerChoices.selectedDateTime;
          const location = partnerChoices.selectedLocation;
          if (!dateTime) { alert('Дата не указана'); return; }
          const startDate = new Date(dateTime);
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
          const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          const title = `Свидание с ${partnerInfo.name}`;
          const details = `Стиль: ${selectedTheme?.label || ''}\nФормат: ${selectedFormat?.label || ''}\nМесто: ${location || ''}`;
          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location || '')}`;
          window.open(url, '_blank');
        }} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#4285f4', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer', marginBottom: '8px' }}>
          📅 Добавить в Google Calendar
        </button>

        <button onClick={() => {
          const dateTime = partnerChoices.selectedDateTime;
          const location = partnerChoices.selectedLocation;
          if (!dateTime) { alert('Дата не указана'); return; }
          const startDate = new Date(dateTime);
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
          const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Date Invite//RU\nBEGIN:VEVENT\nUID:${Date.now()}@dateinvite\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${formatDate(startDate)}\nDTEND:${formatDate(endDate)}\nSUMMARY:Свидание с ${partnerInfo.name}\nLOCATION:${location || ''}\nEND:VEVENT\nEND:VCALENDAR`;
          const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'date-invite.ics';
          link.click();
          URL.revokeObjectURL(link.href);
        }} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#555', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer', marginBottom: '8px' }}>
          📲 Добавить в Apple Calendar (.ics)
        </button>

        <button onClick={() => { setIsGenerated(false); setPartnerChoices(null); reset(); }} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#00b894', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer' }}>
          Отлично! 👌
        </button>
      </div>
    );
  }

  if (isGenerated) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(48px, 10vw, 64px)', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 5vw, 32px)' }}>Приглашение готово!</h2>
        <p style={{ color: '#888', margin: '20px 0' }}>Отправь эту ссылку и жди ответа</p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Ты получишь уведомление, когда партнёр ответит</p>

        <div style={{ background: '#252525', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
          <code style={{ color: '#ff3366', fontSize: '14px', wordBreak: 'break-all' }}>{inviteLink}</code>
        </div>

        <button onClick={copyLink} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer', marginBottom: '8px' }}>
          📋 Копировать ссылку
        </button>

        <button onClick={() => { setIsGenerated(false); setPartnerChoices(null); reset(); }} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer' }}>
          ← Создать новое
        </button>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#252525', border: '2px solid #333',
    borderRadius: '14px', color: '#fff', fontSize: '16px', marginBottom: '16px',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: 'clamp(20px, 5vw, 24px)' }}>Детали свидания</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>Последний шаг!</p>

      {useInviteStore.getState().planningMode === 'self' ? (
        <>
          <input type="text" placeholder="Где встретимся?" value={details.location} onChange={(e) => updateDetails({ location: e.target.value })} style={inputStyle} />
          <input type="datetime-local" value={details.dateTime} onChange={(e) => updateDetails({ dateTime: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Дресс-код" value={details.dressCode} onChange={(e) => updateDetails({ dressCode: e.target.value })} style={inputStyle} />
        </>
      ) : (
        <div style={{ background: '#252525', padding: '20px', borderRadius: '16px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '24px', marginBottom: '10px' }}>📅</p>
          <p style={{ color: '#fff', fontWeight: '600' }}>Дату, время и место выберет партнёр</p>
        </div>
      )}

      <button onClick={generateInvite} disabled={isSaving} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: isSaving ? '#333' : '#ff3366', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: isSaving ? 'wait' : 'pointer', marginBottom: '8px' }}>
        {isSaving ? '⏳ Создаём...' : '🚀 Создать приглашение!'}
      </button>
      
      <button onClick={() => setStep(3)} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: 'transparent', color: '#ff6b8a', border: '1px solid #333', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer' }}>
        ← Назад
      </button>
    </div>
  );
};

export default Step4Final;