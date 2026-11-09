import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const renderWithUser = (ui) => ({ user: userEvent.setup(), ...render(ui) })
