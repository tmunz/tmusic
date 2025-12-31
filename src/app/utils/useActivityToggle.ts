import { useState, useEffect, useRef, useCallback } from 'react';

export function useActivityToggle(
  initialState: boolean = true,
  shouldHide: boolean = true,
  timeout: number = 3000,
  events = ['mousemove', 'keydown', 'click']
) {
  const [visible, setVisible] = useState(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const shouldHideRef = useRef(shouldHide);

  useEffect(() => {
    shouldHideRef.current = shouldHide;
  }, [shouldHide]);

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimeout = useCallback(() => {
    clearCurrentTimeout();
    timeoutRef.current = setTimeout(() => {
      if (shouldHideRef.current) {
        setVisible(false);
      }
    }, timeout);
  }, [timeout, clearCurrentTimeout]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastActivityRef.current < 100) return;

    lastActivityRef.current = now;
    setVisible(true);
    startTimeout();
  }, [startTimeout]);

  useEffect(() => {
    if (!shouldHide) {
      setVisible(true);
      clearCurrentTimeout();
    } else {
      startTimeout();
    }
  }, [shouldHide, timeout, clearCurrentTimeout, startTimeout]);

  useEffect(() => {
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearCurrentTimeout();
    };
  }, [handleActivity, clearCurrentTimeout, events]);

  return visible;
}
