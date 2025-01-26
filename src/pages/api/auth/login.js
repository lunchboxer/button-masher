import { userModel } from '$/models/userModel.js'
import { setCookie } from '$/utils/cookies.js'
import { generateJwt, passwordMatches } from '$/utils/crypto.js'
import { loginSchema } from '$/utils/validation-schemas.js'
import { validate } from '$/utils/validation.js'

export const POST = async context => {
  const { errors, isValid } = validate(context.body, loginSchema)
  if (!isValid) {
    return context.sendJson({ errors }, { status: 400 })
  }

  try {
    const { username, password } = context.body

    if (!(username && password)) {
      throw new Error('Username and password are required')
    }

    const { data: user, errors } = userModel.findByUsername(username, true)
    if (errors) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await passwordMatches(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = await generateJwt({ id: user.id }, process.env.JWT_SECRET)

    setCookie(context, 'auth', token)
    return context.sendJson({ success: true })
  } catch (error) {
    return context.sendJson(
      {
        errors: { all: error.message },
      },
      { status: 401 },
    )
  }
}
