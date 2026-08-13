const StepProgress = ({ currentStep }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '40px'
    }}>
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          style={{
            flex: 1,
            height: '4px',
            background: step === currentStep ? '#ff3366' : step < currentStep ? '#ff6b8a' : '#333',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
};

export default StepProgress;