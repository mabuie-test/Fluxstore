import { create } from 'zustand';

const loadSession = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem('fluxstore_session')) || {};
  } catch (e) {
    return {};
  }
};

const persistSession = (token, user) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    'fluxstore_session',
    JSON.stringify({ token: token || null, user: user || null })
  );
};

const initial = loadSession();

const useSession = create((set) => ({
  token: initial.token || null,
  user: initial.user || null,
  cart: { items: [], total: 0 },
  wishlist: [],
  notifications: [],
  marketing: null,
  lookbook: null,
  preferences: { locale: 'pt', currency: 'MZN' },
  setSession: (token, user) => set(() => {
    persistSession(token, user);
    return { token, user };
  }),
  clearSession: () =>
    set(() => {
      persistSession(null, null);
      return {
        token: null,
        user: null,
        cart: { items: [], total: 0 },
        wishlist: [],
        notifications: []
      };
    }),
  setToken: (token) =>
    set((state) => {
      persistSession(token, state.user);
      return { token };
    }),
  setUser: (user) =>
    set((state) => {
      persistSession(state.token, user);
      return { user };
    }),
  setCart: (cart) => set({ cart }),
  setWishlist: (wishlist) => set({ wishlist }),
  setNotifications: (notifications) => set({ notifications }),
  setMarketing: (marketing) => set({ marketing }),
  setLookbook: (lookbook) => set({ lookbook }),
  setPreferences: (preferences) => set((state) => ({ preferences: { ...state.preferences, ...preferences } }))
}));

export default useSession;
