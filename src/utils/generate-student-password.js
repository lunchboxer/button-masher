import { userModel } from '../models/userModel.js'

export const generateValidPassword = () => {
  const allowedChars = ['r', 'g', 'b', 'w', 'y', 'p'] // Allowed characters
  const lastCharAllowed = ['r', 'g', 'b', 'y'] // Characters allowed for the last position
  const minLength = 4 // Minimum password length
  const maxLength = 6 // Maximum password length

  // Helper function to get a random character from a given array
  function getRandomChar(charArray) {
    return charArray[Math.floor(Math.random() * charArray.length)]
  }

  // Choose a random length between 4 and 6
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  let password = ''

  for (let i = 0; i < length; i++) {
    let nextChar
    if (i < 2) {
      nextChar = getRandomChar(allowedChars)
    } else if (i === length - 1) {
      nextChar = getRandomChar(lastCharAllowed)
    } else {
      const lastTwoChars = password.slice(-2)
      if (lastTwoChars === 'ww') {
        nextChar = getRandomChar(allowedChars.filter(c => c !== 'w'))
      } else if (lastTwoChars === 'pp') {
        nextChar = getRandomChar(allowedChars.filter(c => c !== 'p'))
      } else {
        nextChar = getRandomChar(allowedChars)
      }
    }
    password += nextChar
  }
  // now check if the password/username is already taken
  const { data: existingUser } = userModel.findByUsername(password)
  if (existingUser) {
    return generateValidPassword()
  }
  return password
}
