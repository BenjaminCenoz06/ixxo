"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useCallback,
} from "react";
import { validateCoupon, type Coupon } from "./checkout";

export interface CartItem {
  lineId: string; // productId + color + size
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  color: string;
  size: string;
  qty: number;
  stock: number;
}

export type AddInput = Omit<CartItem, "lineId" | "qty">;

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: AddInput; qty: number }
  | { type: "REMOVE"; lineId: string }
  | { type: "SET_QTY"; lineId: string; qty: number }
  | { type: "CLEAR" };

const lineKey = (i: { productId: string; color: string; size: string }) =>
  `${i.productId}__${i.color}__${i.size}`;

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const lineId = lineKey(action.item);
      const existing = state.items.find((i) => i.lineId === lineId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.lineId === lineId
              ? { ...i, qty: Math.min(i.stock, i.qty + action.qty) }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...action.item, lineId, qty: Math.min(action.item.stock, action.qty) },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.lineId !== action.lineId) };
    case "SET_QTY":
      return {
        items: state.items.map((i) =>
          i.lineId === action.lineId
            ? { ...i, qty: Math.max(1, Math.min(i.stock, action.qty)) }
            : i,
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "ixxo-cart";
const COUPON_KEY = "ixxo-coupon";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddInput, qty?: number) => void;
  removeItem: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // Cargar desde localStorage al montar.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
      const savedCoupon = localStorage.getItem(COUPON_KEY);
      if (savedCoupon) setCoupon(validateCoupon(savedCoupon));
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  // Persistir.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (coupon) localStorage.setItem(COUPON_KEY, coupon.code);
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon, hydrated]);

  // Bloquear scroll con el drawer abierto.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: AddInput, qty = 1) => {
    dispatch({ type: "ADD", item, qty });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((lineId: string) => dispatch({ type: "REMOVE", lineId }), []);
  const setQty = useCallback(
    (lineId: string, qty: number) => dispatch({ type: "SET_QTY", lineId, qty }),
    [],
  );
  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const found = validateCoupon(code);
    setCoupon(found);
    return !!found;
  }, []);
  const removeCoupon = useCallback(() => setCoupon(null), []);

  const { count, subtotal } = useMemo(() => {
    return state.items.reduce(
      (acc, i) => ({
        count: acc.count + i.qty,
        subtotal: acc.subtotal + i.price * i.qty,
      }),
      { count: 0, subtotal: 0 },
    );
  }, [state.items]);

  const value: CartContextValue = {
    items: state.items,
    count,
    subtotal,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQty,
    clear,
    coupon,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
