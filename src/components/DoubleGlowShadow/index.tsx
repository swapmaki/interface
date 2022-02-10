const DoubleGlowShadow = ({ maxWidth = true, opacity = '0.6', children }) => {
  return (
    <div className={`force-gpu relative w-full ${maxWidth ? 'max-w-2xl' : ''}`}>
      <div
        style={{
          // filter: `blur(150px) opacity(${opacity})`,
          filter: `blur(345px) opacity(0.6)`,
        }}
        className="absolute top-1/4 -left-1  bottom-4 w-3/5 rounded-full z-0 hidden sm:block bg-light-purple"
      />
      <div
        style={{
          // filter: `blur(150px) opacity(${opacity})`,
          filter: `blur(345px) opacity(0.6)`,
        }}
        className="absolute bottom-1/4 -right-1  top-4 w-3/5 rounded-full z-0 hidden sm:block bg-purple"
      />
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}

export default DoubleGlowShadow
