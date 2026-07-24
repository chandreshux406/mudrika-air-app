export default function PullHandle({ children, handlers }) {
  return (
    <div className="pull-handle" {...handlers}>
      {children}
      <span className="pull-handle__grabber" aria-hidden="true" />
    </div>
  );
}
