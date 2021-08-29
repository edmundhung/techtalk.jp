import React from 'react'
import {
  chakra,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Checkbox,
  Button
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import CoverPage from '../components/CoverPage'

interface ContactFormData {
  name: string
  company?: string
  phone?: string
  email: string
  message: string
}

const ContactPage: React.FC = () => {
  const { register, handleSubmit, formState } = useForm({ mode: 'all' })
  return (
    <CoverPage id="contact" bgImage="/contact.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        Contact
      </Heading>

      <chakra.form mt="4">
        <VStack spacing="2">
          <FormControl
            id="name"
            isRequired
            isInvalid={formState.errors.name ? true : false}
          >
            <FormLabel htmlFor="name">お名前</FormLabel>
            <Input
              placeholder="お名前"
              {...register('name', { required: '必須です' })}
            />
            <FormErrorMessage>
              {formState.errors.name && formState.errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            id="company"
            isInvalid={formState.errors.company ? true : false}
          >
            <FormLabel htmlFor="company">会社名</FormLabel>
            <Input placeholder="会社名" {...register('company')} />
            <FormErrorMessage>
              {formState.errors.company && formState.errors.company.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            id="phone"
            isInvalid={formState.errors.phone ? true : false}
          >
            <FormLabel htmlFor="phone">電話番号</FormLabel>
            <Input placeholder="電話番号" {...register('phone')} />
            <FormErrorMessage>
              {formState.errors.phone && formState.errors.phone.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            id="email"
            isRequired
            isInvalid={formState.errors.email ? true : false}
          >
            <FormLabel htmlFor="email">メール</FormLabel>
            <Input
              placeholder="メール"
              {...register('email', {
                required: 'メールアドレスは必須です。',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'メールアドレス形式で入力してください。'
                }
              })}
            />
            <FormErrorMessage>
              {formState.errors.email && formState.errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            id="message"
            isRequired
            isInvalid={formState.errors.phone ? true : false}
          >
            <FormLabel htmlFor="message">メッセージ</FormLabel>
            <Textarea
              placeholder="メッセージ"
              {...register('message', { required: '必須です' })}
            />
            <FormErrorMessage>
              {formState.errors.message && formState.errors.message.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl>
            <Checkbox>プライバシーポリシーに同意</Checkbox>
          </FormControl>

          <Button
            type="submit"
            colorScheme="accent"
            disabled={!formState.isValid}
            isLoading={formState.isSubmitting}
          >
            Let's talk
          </Button>
        </VStack>
      </chakra.form>
    </CoverPage>
  )
}

export default ContactPage
