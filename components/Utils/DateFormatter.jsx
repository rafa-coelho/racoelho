import { parseISO, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DateFormatter({ dateString }) {
  const date = parseISO(dateString)
  return <time className='inline-block align-middle' dateTime={dateString}>{format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</time>
}
