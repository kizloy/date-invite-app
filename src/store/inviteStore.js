import { create } from 'zustand';

const useInviteStore = create((set) => ({
  currentStep: 0,
  
  planningMode: 'self',
  
  myProfile: {
    name: '',
    gender: '',
    photo: null,
  },
  
  partnerInfo: {
    name: '',
    gender: '',
  },
  
  settings: {
    theme: 'romantic',
    format: '',
    foods: [],
    secretCode: '',
  },
  
  details: {
    location: '',
    dateTime: '',
    dressCode: '',
  },

  setStep: (step) => set({ currentStep: step }),
  setPlanningMode: (mode) => set({ planningMode: mode }),
  
  updateMyProfile: (data) =>
    set((state) => ({
      myProfile: { ...state.myProfile, ...data },
    })),
    
  updatePartnerInfo: (data) =>
    set((state) => ({
      partnerInfo: { ...state.partnerInfo, ...data },
    })),
    
  updateSettings: (data) =>
    set((state) => ({
      settings: { ...state.settings, ...data },
    })),
    
  updateDetails: (data) =>
    set((state) => ({
      details: { ...state.details, ...data },
    })),
    
  reset: () =>
    set({
      currentStep: 0,
      planningMode: 'self',
      myProfile: {
        name: '',
        gender: '',
        photo: null,
      },
      partnerInfo: {
        name: '',
        gender: '',
      },
      settings: {
        theme: 'romantic',
        format: '',
        foods: [],
        secretCode: '',
      },
      details: {
        location: '',
        dateTime: '',
        dressCode: '',
      },
    }),
}));

export default useInviteStore;