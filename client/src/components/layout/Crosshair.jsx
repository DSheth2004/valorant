import { useEffect, useRef, useState } from "react";

const TEXT_TARGETS =
  'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"]), textarea, [contenteditable="true"]';
const INTERACTIVE_TARGETS = 'a[href], button:not(:disabled), [role="button"], [role="tab"], label, select, summary';

const supportsCrosshair = () =>
  window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Valorant-style crosshair that replaces the mouse pointer. It's positioned directly from
 * pointer events (no smoothing, so it never trails), spreads and locks on over clickable
 * elements, recoils on click and pops a hit marker. All visual states live in CSS via
 * data attributes, so moving the mouse never re-renders React.
 */
export function Crosshair() {
  const [enabled] = useState(supportsCrosshair);
  const crosshairRef = useRef(null);
  const hitLayerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const crosshair = crosshairRef.current;
    const hitLayer = hitLayerRef.current;
    const root = document.documentElement;
    root.classList.add("has-crosshair");

    let frame = 0;
    let x = -100;
    let y = -100;
    const render = () => {
      crosshair.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = 0;
    };

    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);

      const target = event.target instanceof Element ? event.target : null;
      const overText = target?.closest(TEXT_TARGETS);
      crosshair.dataset.state = overText ? "text" : target?.closest(INTERACTIVE_TARGETS) ? "target" : "idle";
      crosshair.dataset.visible = "true";
    };

    const onDown = (event) => {
      if (event.button !== 0 || crosshair.dataset.state === "text") return;
      crosshair.dataset.pressed = "true";
      const marker = document.createElement("span");
      marker.className = "vh-hitmarker";
      marker.style.left = `${event.clientX}px`;
      marker.style.top = `${event.clientY}px`;
      marker.innerHTML = "<i></i><i></i><i></i><i></i>";
      marker.addEventListener("animationend", () => marker.remove(), { once: true });
      hitLayer.append(marker);
    };

    const onUp = () => {
      crosshair.dataset.pressed = "false";
    };
    const onLeave = () => {
      crosshair.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-crosshair");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={crosshairRef} className="vh-crosshair" data-state="idle" data-visible="false" aria-hidden>
        <span className="vh-crosshair__ring" />
        <span className="vh-crosshair__line vh-crosshair__line--top" />
        <span className="vh-crosshair__line vh-crosshair__line--right" />
        <span className="vh-crosshair__line vh-crosshair__line--bottom" />
        <span className="vh-crosshair__line vh-crosshair__line--left" />
        <span className="vh-crosshair__dot" />
      </div>
      <div ref={hitLayerRef} aria-hidden />
    </>
  );
}
