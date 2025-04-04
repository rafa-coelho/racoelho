export default function Container({ children, padding = 'px-5' }) {
  return <div className={`container mx-auto ${padding}`}>{children}</div>
}
