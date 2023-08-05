import { Link } from '@remix-run/react'
import type { V2_MetaFunction } from '@vercel/remix'
import Content from '~/assets/privacy.md'
import { Button, Heading } from '~/components/ui'
import styles from '~/styles/privacy.css'

export const meta: V2_MetaFunction = () => [
  { title: 'プライバシーポリシー - TechTalk' },
]

export const links = () => [{ rel: 'stylesheet', href: styles }]

export default function Privacy() {
  return (
    <>
      <Heading className="text-center my-16 text-4xl font-black">
        TechTalkプライバシーポリシー
      </Heading>

      <div className="markdown container">
        <Content />

        <div className="text-center my-16">
          <Button asChild>
            <Link to="/">トップに戻る</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
