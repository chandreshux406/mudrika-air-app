import { useCallback, useEffect, useRef, useState } from 'react';

const RESISTANCE = 0.55;
const OPEN_DISTANCE_RATIO = 0.35;
const OPEN_VELOCITY_THRESHOLD = 0.5;
const SNAP_TRANSITION = 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)';
const SNAP_FADE_TRANSITION = 'opacity 0.32s ease';

export default function useDragSheet() {
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const drag = useRef({
    dragging: false,
    startY: 0,
    baseOffset: 0,
    lastClientY: 0,
    lastT: 0,
    velocity: 0,
    sheetHeight: 0,
    pendingClientY: null,
    rafId: null,
  });

  const applyOffset = useCallback((offset, sheetHeight) => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet) return;
    sheet.style.transform = `translateY(${offset - sheetHeight}px)`;
    if (backdrop) {
      const ratio = sheetHeight > 0 ? Math.max(0, Math.min(1, offset / sheetHeight)) : 0;
      backdrop.style.opacity = String(ratio * 0.6);
    }
  }, []);

  const tick = useCallback(() => {
    const state = drag.current;
    state.rafId = null;
    if (state.pendingClientY == null || !state.dragging) return;

    const now = performance.now();
    const dt = now - state.lastT || 1;
    state.velocity = (state.pendingClientY - state.lastClientY) / dt;
    state.lastClientY = state.pendingClientY;
    state.lastT = now;

    let offset = state.baseOffset + (state.pendingClientY - state.startY);
    if (offset < 0) {
      offset *= RESISTANCE;
    } else if (offset > state.sheetHeight) {
      offset = state.sheetHeight + (offset - state.sheetHeight) * RESISTANCE;
    }

    applyOffset(offset, state.sheetHeight);
  }, [applyOffset]);

  const snapTo = useCallback((open) => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (sheet) {
      sheet.style.transition = SNAP_TRANSITION;
      sheet.style.transform = open ? 'translateY(0)' : 'translateY(-100%)';
    }
    if (backdrop) {
      backdrop.style.transition = SNAP_FADE_TRANSITION;
      backdrop.style.opacity = open ? '0.6' : '0';
    }
    setIsOpen(open);
    window.setTimeout(() => {
      if (sheet) sheet.style.transition = '';
      if (backdrop) backdrop.style.transition = '';
    }, 340);
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      if (e.target.closest('button, a, input, select, textarea')) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      const sheetHeight = sheet.offsetHeight;
      drag.current = {
        dragging: true,
        startY: e.clientY,
        baseOffset: isOpen ? sheetHeight : 0,
        lastClientY: e.clientY,
        lastT: performance.now(),
        velocity: 0,
        sheetHeight,
        pendingClientY: e.clientY,
        rafId: null,
      };
      sheet.style.transition = 'none';
      if (backdropRef.current) backdropRef.current.style.transition = 'none';
    },
    [isOpen],
  );

  const onPointerMove = useCallback(
    (e) => {
      const state = drag.current;
      if (!state.dragging) return;
      state.pendingClientY = e.clientY;
      if (state.rafId == null) {
        state.rafId = requestAnimationFrame(tick);
      }
    },
    [tick],
  );

  const finishDrag = useCallback(() => {
    const state = drag.current;
    if (!state.dragging) return;
    state.dragging = false;
    if (state.rafId != null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    const offset = state.baseOffset + (state.lastClientY - state.startY);
    const ratio = state.sheetHeight > 0 ? offset / state.sheetHeight : 0;
    const fastFlick = Math.abs(state.velocity) > OPEN_VELOCITY_THRESHOLD;

    const shouldOpen = fastFlick ? state.velocity > 0 : ratio >= OPEN_DISTANCE_RATIO;
    snapTo(shouldOpen);
  }, [snapTo]);

  const open = useCallback(() => snapTo(true), [snapTo]);
  const close = useCallback(() => snapTo(false), [snapTo]);

  useEffect(() => {
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [finishDrag]);

  useEffect(
    () => () => {
      if (drag.current.rafId != null) cancelAnimationFrame(drag.current.rafId);
    },
    [],
  );

  return {
    sheetRef,
    backdropRef,
    isOpen,
    open,
    close,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
    },
  };
}
