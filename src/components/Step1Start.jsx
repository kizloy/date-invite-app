import { useState } from 'react';
import { themes, foodOptions } from '../data/themes';
import useInviteStore from '../store/inviteStore';

const Step1Start = () => {
  const { settings, updateSettings, setStep, planningMode } = useInviteStore();
  const [step, setStepLocal] = useState(1);

  const handleThemeSelect = (themeId) => {
    updateSettings({ theme: themeId, format: '' });
  };

  const handleFormatSelect = (formatId) => {
    updateSettings({ format: formatId });
    setStepLocal(3);
  };

  const toggleFood = (foodId) => {
    const currentFoods = settings.foods || [];
    if (currentFoods.includes(foodId)) {
      updateSettings({ foods: currentFoods.filter(id => id !== foodId) });
    } else {
      updateSettings({ foods: [...currentFoods, foodId] });
    }
  };

  const selectedTheme = themes.find(t => t.id === settings.theme);
  const selectedFoodsCount = (settings.foods || []).length;

  if (planningMode === 'partner') {
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💌</div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#fff' }}>
            Приглашение на свидание
          </h1>
          <p style={{ color: '#888' }}>
            Стиль, формат и еду выберет партнёр
          </p>
        </div>

        <div style={{
          background: '#252525',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', marginBottom: '10px' }}>🎨</p>
          <p style={{ color: '#fff', fontWeight: '600', marginBottom: '5px' }}>
            Партнёр сам выберет:
          </p>
          <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
            • Стиль свидания<br />
            • Формат<br />
            • Еду
          </p>
        </div>

        <button
          onClick={() => setStep(2)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#ff3366',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontSize: '17px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Продолжить →
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>💌</div>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#fff' }}>
          Приглашение на свидание
        </h1>
        <p style={{ color: '#888' }}>
          Создай уникальное приглашение за 1 минуту
        </p>
      </div>

      {step === 1 && (
        <>
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Выбери стиль:</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                style={{
                  padding: '20px',
                  background: settings.theme === theme.id ? '#2a1a20' : '#252525',
                  border: `2px solid ${settings.theme === theme.id ? theme.color : '#333'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '32px' }}>{theme.emoji}</span>
                <span>{theme.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStepLocal(2)}
            style={{
              width: '100%',
              padding: '16px',
              background: '#ff3366',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Далее →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginBottom: '20px' 
          }}>
            <span style={{ fontSize: '24px' }}>{selectedTheme?.emoji}</span>
            <div>
              <p style={{ color: '#888', fontSize: '12px' }}>Выбранный стиль:</p>
              <p style={{ color: '#fff', fontWeight: '600' }}>{selectedTheme?.label}</p>
            </div>
          </div>

          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Как проведём время?</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {selectedTheme?.formats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format.id)}
                style={{
                  padding: '20px',
                  background: settings.format === format.id ? '#2a1a20' : '#252525',
                  border: `2px solid ${settings.format === format.id ? selectedTheme.color : '#333'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  minHeight: '100px',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '36px' }}>{format.emoji}</span>
                <span style={{ fontWeight: '600' }}>{format.label}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{format.description}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStepLocal(1)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              color: '#888',
              border: '1px solid #333',
              borderRadius: '14px',
              fontSize: '17px',
              cursor: 'pointer',
            }}
          >
            ← Назад
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginBottom: '20px' 
          }}>
            <span style={{ fontSize: '24px' }}>{selectedTheme?.emoji}</span>
            <div>
              <p style={{ color: '#888', fontSize: '12px' }}>Выбранный стиль:</p>
              <p style={{ color: '#fff', fontWeight: '600' }}>
                {selectedTheme?.label} • {selectedTheme?.formats.find(f => f.id === settings.format)?.label}
              </p>
            </div>
          </div>

          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Что будем кушать?</h3>
          <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
            Можно выбрать несколько вариантов
          </p>

          {selectedFoodsCount > 0 && (
            <div style={{
              background: '#252525',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              <span style={{ color: '#888', fontSize: '14px' }}>Выбрано:</span>
              {(settings.foods || []).map(foodId => {
                const food = foodOptions.find(f => f.id === foodId);
                return food ? (
                  <span key={foodId} style={{
                    background: '#333',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    {food.emoji} {food.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}>
            {foodOptions.map((food) => {
              const isSelected = (settings.foods || []).includes(food.id);
              return (
                <button
                  key={food.id}
                  onClick={() => toggleFood(food.id)}
                  style={{
                    padding: '16px',
                    background: isSelected ? '#2a1a20' : '#252525',
                    border: `2px solid ${isSelected ? food.color : '#333'}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    minHeight: '100px',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {isSelected && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: food.color,
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}>
                      ✓
                    </span>
                  )}
                  <span style={{ fontSize: '36px' }}>{food.emoji}</span>
                  <span style={{ fontWeight: '600' }}>{food.label}</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>{food.description}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setStepLocal(2)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '14px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              ← Формат
            </button>
            <button
              onClick={() => updateSettings({ foods: [] })}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '14px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Очистить
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              padding: '16px',
              background: '#ff3366',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {selectedFoodsCount > 0 
              ? `Продолжить с ${selectedFoodsCount} блюд${selectedFoodsCount === 1 ? 'ом' : 'ами'} →` 
              : 'Продолжить без еды →'}
          </button>
        </>
      )}
    </div>
  );
};

export default Step1Start;