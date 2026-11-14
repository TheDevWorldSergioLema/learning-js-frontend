export const ScreenSize = Object.freeze({
  Mobile: 'mobile',
  Small: 'small',
  Wide: 'wide',
})

const touchOnly = '(hover: none) and (pointer: coarse)'

export const ScreenQuery = Object.freeze({
  Mobile: `${touchOnly} and (max-width: 599px), ${touchOnly} and (max-height: 599px)`,
  Wide: '(min-width: 1280px)',
})
