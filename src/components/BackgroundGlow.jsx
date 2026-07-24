export default function BackgroundGlow() {
  return (
    <div className="bg-glow" aria-hidden="true">
      <span className="bg-glow__blob bg-glow__blob--cyan-1" />
      <span className="bg-glow__blob bg-glow__blob--cyan-2" />
      <span className="bg-glow__blob bg-glow__blob--purple" />
      <span className="bg-glow__blob bg-glow__blob--green" />
      <span className="bg-glow__blob bg-glow__blob--orange" />
    </div>
  );
}
