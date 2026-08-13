import { useState, useEffect } from 'react';
import useInviteStore from './store/inviteStore';
import { foodOptions, themes } from './data/themes';
import StepProgress from './components/StepProgress';
import Step0Welcome from './components/Step0Welcome';
import Step1Start from './components/Step1Start';
import Step2MyProfile from './components/Step2MyProfile';
import Step3PartnerInfo from './components/Step3PartnerInfo';
import Step4Final from './components/Step4Final';
import InviteIntro from './components/InviteIntro';
import { getInvite, updateInvite } from './firebase';

// Адаптивные стили
const appWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: 'clamp(10px, 3vw, 20px)',
  background: '#0a0a0a',
};

const appContainerStyle = {
  width: '100%',
  maxWidth: 'min(420px, 100%)',
  background: '#1a1a1a',
  borderRadius: 'clamp(16px, 4vw, 24px)',
  padding: 'clamp(16px, 4vw, 32px)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  color: '#fff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  boxSizing: 'border-box',
};

const headingStyle = {
  fontSize: 'clamp(24px, 6vw, 32px)',
  marginBottom: '15px',
  color: '#fff',
};

const subheadingStyle = {
  fontSize: 'clamp(14px, 3.5vw, 18px)',
  color: '#888',
  marginBottom: '20px',
};

const emojiStyle = {
  fontSize: 'clamp(48px, 12vw, 80px)',
  marginBottom: '20px',
};

function App() {
  const { currentStep, reset } = useInviteStore();
  const [inviteView, setInviteView] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [partnerStep, setPartnerStep] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get('invite');
    
    if (inviteId) {
      setIsLoading(true);
      getInvite(inviteId).then((data) => {
        if (data) {
          setInviteView(data);
        } else {
          alert('Приглашение не найдено!');
        }
        setIsLoading(false);
      });
    }
  }, []);

  const updatePartnerChoices = async (choices) => {
    if (inviteView?.id) {
      await updateInvite(inviteView.id, { partnerChoices: choices });
      setInviteView({ ...inviteView, partnerChoices: choices });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step0Welcome />;
      case 1: return <Step1Start />;
      case 2: return <Step2MyProfile />;
      case 3: return <Step3PartnerInfo />;
      case 4: return <Step4Final />;
      default: return <Step0Welcome />;
    }
  };

  if (isLoading) {
    return (
      <div style={{ ...appWrapperStyle }}>
        <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', color: '#fff' }}>⏳ Загрузка...</div>
      </div>
    );
  }

  if (isAccepted && inviteView) {
    const selectedTheme = themes.find(t => t.id === inviteView.partnerChoices?.selectedTheme);
    const selectedFormat = selectedTheme?.formats.find(f => f.id === inviteView.partnerChoices?.selectedFormat);
    const displayTheme = selectedTheme || themes.find(t => t.id === inviteView.settings.theme);
    const displayFormat = selectedFormat || displayTheme?.formats.find(f => f.id === inviteView.settings.format);
    const displayFoods = inviteView.partnerChoices?.selectedFoods || inviteView.settings.foods;
    const displayDateTime = inviteView.partnerChoices?.selectedDateTime || inviteView.details.dateTime;
    const displayLocation = inviteView.partnerChoices?.selectedLocation || inviteView.details.location;
    
    return (
      <div style={appWrapperStyle}>
        <div style={{ ...appContainerStyle, textAlign: 'center' }}>
          <div style={emojiStyle}>🎉</div>
          <h1 style={headingStyle}>Приглашение принято!</h1>
          <p style={subheadingStyle}>
            {inviteView.myProfile.name} приглашает {inviteView.partnerInfo.name} ❤️
          </p>
          
          <div style={{
            background: '#2a2a00',
            border: '1px solid #ffcc00',
            padding: 'clamp(10px, 2.5vw, 15px)',
            borderRadius: '12px',
            marginBottom: '20px',
          }}>
            <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#ffcc00', fontWeight: '600' }}>
              📸 Не забудь сделать скриншот!
            </p>
          </div>
          
          <div style={{
            background: '#252525',
            padding: 'clamp(15px, 4vw, 20px)',
            borderRadius: '16px',
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            {displayTheme && <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#fff', marginBottom: '10px' }}><span style={{ color: '#888' }}>Стиль:</span> {displayTheme.emoji} {displayTheme.label}</p>}
            {displayFormat && <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#fff', marginBottom: '10px' }}><span style={{ color: '#888' }}>Где:</span> {displayFormat.emoji} {displayFormat.label}</p>}
            {displayFoods?.length > 0 && <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#fff', marginBottom: '10px' }}><span style={{ color: '#888' }}>Что кушаем:</span> {displayFoods.map(id => { const f = foodOptions.find(x => x.id === id); return f ? `${f.emoji} ${f.label}` : ''; }).join(', ')}</p>}
            {displayDateTime && <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#fff', marginBottom: '10px' }}><span style={{ color: '#888' }}>Дата и время:</span> {new Date(displayDateTime).toLocaleString('ru-RU')}</p>}
            {displayLocation && <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#fff', marginBottom: '10px' }}><span style={{ color: '#888' }}>Место встречи:</span> 📍 {displayLocation}</p>}
          </div>
          
          <button onClick={() => { setIsAccepted(false); setInviteView(null); setPartnerStep(1); setShowIntro(true); reset(); window.history.replaceState({}, '', '/'); }} 
            style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#00b894', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer' }}>
            Отлично! 👌
          </button>
        </div>
      </div>
    );
  }

  if (inviteView && !isAccepted) {
    if (showIntro) {
      return (
        <InviteIntro
          myName={inviteView.myProfile.name}
          partnerName={inviteView.partnerInfo.name}
          myPhoto={inviteView.myProfile.photo}
          onAccept={() => {
            setShowIntro(false);
            if (inviteView.planningMode === 'self') {
              updatePartnerChoices({ accepted: true, acceptedAt: new Date().toISOString() });
              setIsAccepted(true);
            }
          }}
        />
      );
    }
    
    if (inviteView.planningMode === 'partner' && !inviteView.partnerChoices?.accepted) {
      const selectedTheme = themes.find(t => t.id === inviteView.partnerChoices?.selectedTheme);
      const selectedFormat = selectedTheme?.formats.find(f => f.id === inviteView.partnerChoices?.selectedFormat);
      
      return (
        <div style={appWrapperStyle}>
          <div style={{ ...appContainerStyle, textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(40px, 10vw, 64px)', marginBottom: '20px' }}>💌</div>
            <h1 style={{ ...headingStyle, fontSize: 'clamp(22px, 5.5vw, 28px)' }}>{inviteView.myProfile.name} приглашает тебя!</h1>
            <p style={{ color: '#888', marginBottom: '30px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>Выбери, что тебе нравится</p>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {[1, 2, 3, 4].map((s) => (
                <div key={s} style={{ flex: 1, height: '3px', background: s === partnerStep ? '#ff3366' : s < partnerStep ? '#ff6b8a' : '#333', borderRadius: '2px' }} />
              ))}
            </div>

            {partnerStep === 1 && (
              <>
                <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: 'clamp(16px, 4vw, 18px)' }}>Выбери стиль свидания</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(8px, 2vw, 12px)', marginBottom: '20px' }}>
                  {themes.map((theme) => (
                    <button key={theme.id} onClick={() => { updatePartnerChoices({ ...inviteView.partnerChoices, selectedTheme: theme.id }); setPartnerStep(2); }}
                      style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#252525', border: `2px solid ${theme.color}`, borderRadius: '16px', cursor: 'pointer', color: '#fff', fontSize: 'clamp(13px, 3vw, 16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: 'clamp(24px, 6vw, 32px)' }}>{theme.emoji}</span>
                      <span>{theme.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {partnerStep === 2 && selectedTheme && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                  <span style={{ fontSize: 'clamp(20px, 5vw, 24px)' }}>{selectedTheme.emoji}</span>
                  <div>
                    <p style={{ color: '#888', fontSize: '12px' }}>Выбранный стиль:</p>
                    <p style={{ color: '#fff', fontWeight: '600', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{selectedTheme.label}</p>
                  </div>
                </div>
                <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: 'clamp(16px, 4vw, 18px)' }}>Как проведём время?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(8px, 2vw, 12px)', marginBottom: '20px' }}>
                  {selectedTheme.formats.map((format) => (
                    <button key={format.id} onClick={() => { updatePartnerChoices({ ...inviteView.partnerChoices, selectedFormat: format.id }); setPartnerStep(3); }}
                      style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#252525', border: `2px solid ${selectedTheme.color}`, borderRadius: '16px', cursor: 'pointer', color: '#fff', fontSize: 'clamp(13px, 3vw, 14px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '100px', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(28px, 7vw, 36px)' }}>{format.emoji}</span>
                      <span style={{ fontWeight: '600' }}>{format.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setPartnerStep(1)} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '14px', cursor: 'pointer' }}>← Назад</button>
              </>
            )}

            {partnerStep === 3 && (
              <>
                <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: 'clamp(16px, 4vw, 18px)' }}>Что будем кушать?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(8px, 2vw, 10px)', marginBottom: '20px', maxHeight: 'min(250px, 50vh)', overflowY: 'auto' }}>
                  {foodOptions.map((food) => {
                    const currentFoods = inviteView.partnerChoices?.selectedFoods || [];
                    const isSelected = currentFoods.includes(food.id);
                    return (
                      <button key={food.id} onClick={() => {
                        const newFoods = isSelected ? currentFoods.filter(id => id !== food.id) : [...currentFoods, food.id];
                        updatePartnerChoices({ ...inviteView.partnerChoices, selectedFoods: newFoods });
                      }}
                      style={{ padding: 'clamp(10px, 3vw, 15px)', background: isSelected ? '#2a1a20' : '#252525', border: `2px solid ${isSelected ? food.color : '#333'}`, borderRadius: '12px', cursor: 'pointer', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', position: 'relative' }}>
                        {isSelected && <span style={{ position: 'absolute', top: '8px', right: '8px', background: food.color, borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
                        <span style={{ fontSize: 'clamp(24px, 6vw, 30px)' }}>{food.emoji}</span>
                        <span style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}>{food.label}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPartnerStep(4)} style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer', marginBottom: '8px' }}>Продолжить →</button>
                <button onClick={() => setPartnerStep(2)} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '14px', cursor: 'pointer' }}>← Назад</button>
              </>
            )}

            {partnerStep === 4 && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#fff', marginBottom: '15px', textAlign: 'left', fontSize: 'clamp(16px, 4vw, 18px)' }}>📅 Выбери удобное время</h3>
                  <input type="datetime-local" onChange={(e) => updatePartnerChoices({ ...inviteView.partnerChoices, selectedDateTime: e.target.value })}
                    style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#252525', border: '2px solid #333', borderRadius: '14px', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#fff', marginBottom: '15px', textAlign: 'left', fontSize: 'clamp(16px, 4vw, 18px)' }}>📍 Где встретимся?</h3>
                  <input type="text" placeholder="Напиши место встречи" onChange={(e) => updatePartnerChoices({ ...inviteView.partnerChoices, selectedLocation: e.target.value })}
                    style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#252525', border: '2px solid #333', borderRadius: '14px', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => { updatePartnerChoices({ ...inviteView.partnerChoices, accepted: true, acceptedAt: new Date().toISOString() }); setIsAccepted(true); }}
                  style={{ width: '100%', padding: 'clamp(12px, 3vw, 16px)', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '14px', fontSize: 'clamp(14px, 3.5vw, 17px)', cursor: 'pointer' }}>
                  ❤️ Принять приглашение
                </button>
                <button onClick={() => setPartnerStep(3)} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '14px', cursor: 'pointer', marginTop: '8px' }}>← Назад</button>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div style={appWrapperStyle}>
      <div style={appContainerStyle}>
        <StepProgress currentStep={currentStep} />
        {renderStep()}
      </div>
    </div>
  );
}

export default App;