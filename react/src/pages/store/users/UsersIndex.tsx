import { Link } from "react-router"
import type { UserOption } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"

export default function UsersIndex() {
  const users = useApi<UserOption[]>("/api/store/users")

  return (
    <Loadable result={users}>
      {(users) => (
        <>
          <h1>{pluralize(users.length, "user")}</h1>

          {users.map((user) => (
            <div key={user.id}>
              <Link to={`/store/users/${user.id}`}>{user.full_name}</Link>
            </div>
          ))}
        </>
      )}
    </Loadable>
  )
}
