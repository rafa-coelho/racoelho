export default function PostTitle({ children }) {
  return (
    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight md:leading-none mb-10 text-center md:text-left">
      {children}
    </h1>
  )
}
