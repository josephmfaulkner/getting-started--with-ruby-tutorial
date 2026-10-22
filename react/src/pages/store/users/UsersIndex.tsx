import type { UserOption } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { AppLink, PageHeader } from "../../../components/ui"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"
import DataTable from "../DataTable"

export default function UsersIndex() {
  const users = useApi<UserOption[]>("/api/store/users")

  return (
    <Loadable result={users}>
      {(users) => (
        <>
          <PageHeader title={pluralize(users.length, "user")} />
          <DataTable rows={users} columns={[
            { header: "Name", cell: (user) => <AppLink to={`/store/users/${user.id}`}>{user.full_name}</AppLink> },
            { header: "Email", cell: (user) => user.email_address }
          ]} />
        </>
      )}
    </Loadable>
  )
}
