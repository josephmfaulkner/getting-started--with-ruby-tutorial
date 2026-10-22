import { render, screen, waitForElementToBeRemoved } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ConfirmButton } from "./ui"

describe("ConfirmButton", () => {
  it("only runs the action after it's confirmed", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(<ConfirmButton onConfirm={onConfirm}>Delete</ConfirmButton>)

    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.getByRole("dialog")).toHaveTextContent("Are you sure?")
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"))
    expect(onConfirm).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
