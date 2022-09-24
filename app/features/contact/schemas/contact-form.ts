import { z } from 'zod'
import { withZod } from '@remix-validated-form/with-zod'

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  company: z.string(),
  phone: z.string(),
  email: z.string().min(1, { message: 'Email is required' }).email(),
  message: z.string().min(1, { message: 'Message is required' }),
  locale: z.string()
})

export const validator = withZod(ContactFormSchema)
