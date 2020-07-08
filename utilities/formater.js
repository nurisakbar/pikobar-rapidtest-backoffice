export const getChipColor = (status) => {
  let chipColor = null
  if (status === 'PUBLISHED') {
    chipColor = 'success'
  }
  return chipColor
}
