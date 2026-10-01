import { useEffect, useRef, useState } from "react";

/**
 * Öğe ilk kez görüş alanına girdiğinde true olur ve öyle kalır.
 * Giriş animasyonlarını scroll'a bağlamak için; sürekli izleme yapmaz.
 */
export function useRevealOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed, threshold]);

  return { ref, revealed };
}
