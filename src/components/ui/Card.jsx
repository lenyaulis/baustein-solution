// src/components/ui/Card.jsx

function Card({ children, style, ...rest }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 16,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
