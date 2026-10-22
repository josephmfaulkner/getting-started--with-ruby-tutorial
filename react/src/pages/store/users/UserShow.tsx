import { Link, useParams } from "react-router"
import type { User } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { useApi } from "../../../lib/useApi"

export default function UserShow() {
  const { id } = useParams()
  const user = useApi<User>(`/api/store/users/${id}`)

  return (
    <>
      <Link to="/store/users">Back to all users</Link>

      <Loadable result={user}>
        {(user) => (
          <>
            <h1>{user.full_name}</h1>
            <p>{user.email_address}</p>

            <div>
              <Link to={`/store/users/${user.id}/edit`}>Edit user</Link>
            </div>
          </>
        )}
      </Loadable>
    </>
  )
}
