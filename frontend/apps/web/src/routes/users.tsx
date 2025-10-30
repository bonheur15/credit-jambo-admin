
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  component: UsersComponent,
})

function UsersComponent() {
  return (
    <div className="p-2">
      <h3>Welcome to the users page!</h3>
    </div>
  )
}
