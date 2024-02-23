import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData } from '@remix-run/react'
import { ActionFunction, json } from '@vercel/remix'
import { jsonWithToast } from 'remix-toast'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, HStack, Input, Label, Stack } from '~/components/ui'

// フォーム要素のスキーマ定義
const schema = z.object({
  zip1: z.string().max(3),
  zip2: z.string().max(4),
  prefecture: z.string(),
  city: z.string(),
  street: z.string().optional(),
})

/**
 * 郵便番号から住所を取得する
 *
 * 郵便番号 REST API
 * https://postcode.teraren.com/
 *
 * @param postalCode
 * @returns
 */
const lookupAddress = async (postalCode: string) => {
  const res = await fetch(`https://postcode.teraren.com/postcodes/${postalCode}.json`).catch(() => null)
  if (!res || !res.ok) return null
  return (await res.json()) as {
    prefecture: string
    city: string
    suburb: string
    street_address: string | null
  }
}

export const action: ActionFunction = async ({ request }) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return json(submission.reply())
  }

  return jsonWithToast(submission.reply(), {
    message: '登録しました！',
    description: `${submission.value.prefecture}${submission.value.city}${submission.value.street ?? ''}`,
    type: 'success',
  })
}

export default function ConformValueDemoPage() {
  const lastResult = useActionData<typeof action>()
  // conform の useForm でフォームとフィールドメタデータを使う
  const [form, { zip1, zip2, prefecture, city, street }] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  // value はレンダリングのときに都度参照していないと更新されず undefined になるので、ここで参照しておく
  // ref: https://github.com/edmundhung/conform/pull/467
  const postalCode = `${zip1.value}${zip2.value}`

  // 郵便番号から住所を取得
  const handleClickLookupPostalCode = async () => {
    try {
      const address = await lookupAddress(postalCode)
      if (!address) {
        return
      }
      form.update({
        name: prefecture.name,
        value: address.prefecture,
      })
      form.update({
        name: city.name,
        value: `${address.city}${address.suburb}`,
      })
      form.update({
        name: street.name,
        value: address.street_address ?? '',
      })
      toast.info('郵便番号をもとに住所を更新しました')
    } catch (e) {
      toast.error(`郵便番号から住所を取得できませんでした: ${String(e)}`)
      return
    }
  }

  return (
    <Form method="POST" {...getFormProps(form)}>
      <Stack>
        <div>
          <Label htmlFor={zip1.id}>郵便番号</Label>
          <HStack>
            <div>
              <Input className="w-16" {...getInputProps(zip1, { type: 'tel' })} />
              <div className="text-sm text-destructive">{zip1.errors}</div>
            </div>
            <div>-</div>
            <div>
              <Input className="w-24" {...getInputProps(zip2, { type: 'tel' })} />
              <div className="text-sm text-destructive">{zip2.errors}</div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {
                handleClickLookupPostalCode()
              }}
            >
              住所検索
            </Button>
          </HStack>
        </div>

        <div>
          <Label htmlFor={prefecture.id}>都道府県</Label>
          <Input {...getInputProps(prefecture, { type: 'text' })} key={prefecture.key} />
          <div className="text-sm text-destructive">{prefecture.errors}</div>
        </div>
        <div>
          <Label htmlFor={city.id}>市区町村</Label>
          <Input {...getInputProps(city, { type: 'text' })} key={city.key} />
          <div className="text-sm text-destructive">{city.errors}</div>
        </div>
        <div>
          <Label htmlFor={street.id}>番地</Label>
          <Input {...getInputProps(street, { type: 'text' })} key={street.key} />
          <div className="text-sm text-destructive">{street.errors}</div>
        </div>
      </Stack>

      <Button className="mt-8 w-full">登録</Button>
    </Form>
  )
}
