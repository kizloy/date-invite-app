import { useState } from 'react';
import useInviteStore from '../store/inviteStore';

const Step2MyProfile = () => {
  const { myProfile, updateMyProfile, setStep } = useInviteStore();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const MAX_STORAGE_SIZE = 3.5 * 1024 * 1024;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoError('');
    setIsCompressing(true);

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('Файл слишком большой! Максимум 10MB.');
      setIsCompressing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let quality = 0.7;
        let maxWidth = 800;
        let maxHeight = 800;
        
        let compressedBase64 = compressImage(img, maxWidth, maxHeight, quality);
        
        let attempts = 0;
        while (compressedBase64.length > MAX_STORAGE_SIZE && attempts < 5) {
          quality -= 0.15;
          maxWidth = Math.round(maxWidth * 0.8);
          maxHeight = Math.round(maxHeight * 0.8);
          compressedBase64 = compressImage(img, maxWidth, maxHeight, quality);
          attempts++;
        }

        if (compressedBase64.length > MAX_STORAGE_SIZE) {
          setPhotoError('Не удалось сжать фото. Попробуйте другое изображение.');
          setIsCompressing(false);
          return;
        }

        const sizeKB = Math.round(compressedBase64.length / 1024);
        console.log(`Фото сжато: ${sizeKB}KB (${attempts} попыток)`);

        updateMyProfile({ photo: compressedBase64 });
        setPhotoPreview(compressedBase64);
        setIsCompressing(false);
      };
      img.onerror = () => {
        setPhotoError('Не удалось загрузить изображение.');
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setPhotoError('Ошибка чтения файла.');
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (img, maxWidth, maxHeight, quality) => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round(width * (maxHeight / height));
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', quality);
  };

  const isComplete = myProfile.name.trim() !== '';

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
      <h2 style={{ color: '#fff' }}>Расскажи о себе</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Кто ты, герой или героиня?
      </p>

      <div
        onClick={() => document.getElementById('photoInput').click()}
        style={{
          background: '#252525',
          border: `2px dashed ${photoError ? '#ff3366' : '#333'}`,
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          cursor: isCompressing ? 'wait' : 'pointer',
          marginBottom: '16px',
          opacity: isCompressing ? 0.5 : 1,
        }}
      >
        {isCompressing ? (
          <div>
            <span style={{ fontSize: '48px' }}>⏳</span>
            <p style={{ color: '#888' }}>Сжимаем фото...</p>
          </div>
        ) : photoPreview ? (
          <img
            src={photoPreview}
            alt="Preview"
            style={{ 
              width: '100%', 
              maxHeight: '250px', 
              objectFit: 'contain', 
              borderRadius: '12px' 
            }}
          />
        ) : (
          <div>
            <span style={{ fontSize: '48px' }}>📸</span>
            <p style={{ color: '#888' }}>Нажми, чтобы добавить фото</p>
            <p style={{ color: '#666', fontSize: '12px' }}>
              Максимум 10MB. Фото автоматически сжимается.
            </p>
          </div>
        )}
        <input
          id="photoInput"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
        />
      </div>

      {photoError && (
        <div style={{
          background: '#2a1a1a',
          border: '1px solid #ff3366',
          padding: '12px',
          borderRadius: '12px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#ff3366', fontSize: '14px' }}>
            ⚠️ {photoError}
          </p>
        </div>
      )}

      {photoPreview && !photoError && (
        <div style={{
          background: '#1a2a1a',
          border: '1px solid #00b894',
          padding: '8px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#00b894', fontSize: '12px' }}>
            ✓ Фото готово к использованию
          </p>
        </div>
      )}

      <input
        type="text"
        placeholder="Твоё имя"
        value={myProfile.name}
        onChange={(e) => updateMyProfile({ name: e.target.value })}
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => updateMyProfile({ gender: 'male' })}
          style={{
            flex: 1,
            padding: '16px',
            background: myProfile.gender === 'male' ? '#2a1a20' : '#252525',
            border: `2px solid ${myProfile.gender === 'male' ? '#ff3366' : '#333'}`,
            borderRadius: '14px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          🦸‍♂️ Парень
        </button>
        <button
          onClick={() => updateMyProfile({ gender: 'female' })}
          style={{
            flex: 1,
            padding: '16px',
            background: myProfile.gender === 'female' ? '#2a1a20' : '#252525',
            border: `2px solid ${myProfile.gender === 'female' ? '#ff3366' : '#333'}`,
            borderRadius: '14px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          🦸‍♀️ Девушка
        </button>
      </div>

      <button
        onClick={() => setStep(3)}
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
        Дальше →
      </button>
      
      <button
        onClick={() => setStep(1)}
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

export default Step2MyProfile;