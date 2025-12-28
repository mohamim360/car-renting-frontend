import { useParams } from 'react-router-dom'

export default function CarDetails() {
  const { id } = useParams()

  return (
    <div className="container mx-auto py-10">
      <p>Car ID: {id}</p>
      <p>Car details page content</p>
    </div>
  )
}

