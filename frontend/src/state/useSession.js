import { create } from 'zustand';

const useSession = create((set) => ({
  token: null,
  user: null,
  cart: { items: [], total: 0 },
  wishlist: [],
  notifications: [],
  marketing: null,
  lookbook: null,
  preferences: { locale: 'pt', currency: 'MZN' },
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setCart: (cart) => set({ cart }),
  setWishlist: (wishlist) => set({ wishlist }),
  setNotifications: (notifications) => set({ notifications }),
  setMarketing: (marketing) => set({ marketing }),
  setLookbook: (lookbook) => set({ lookbook }),
  setPreferences: (preferences) => set((state) => ({ preferences: { ...state.preferences, ...preferences } }))
}));

export default useSession;
