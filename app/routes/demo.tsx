import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { ExternalLinkIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  Spacer,
} from '~/components/ui'
import { cn } from '~/libs/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'TechTalk Demos' }]
}

const demoPages: { [demoPage: string]: { path: string; title: string; ext?: 'mdx' }[] } = {
  conform: [
    { path: '/demo/conform/update', title: '外部から値を変更する - update' },
    { path: '/demo/conform/value', title: '郵便番号から住所を補完する - value / update' },
    { path: '/demo/conform/alert', title: '検証してから実行確認ダイアログを出す' },
  ],
  about: [{ path: '/demo/about', title: 'これは何?', ext: 'mdx' }],
}

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const menu = url.pathname.split('/')[2]
  const menuItems = menu ? demoPages[menu] ?? [] : []
  const currentMenuItem = menuItems.find((item) => item.path === url.pathname)
  const codeURL =
    currentMenuItem &&
    `https://github.com/techtalkjp/techtalk.jp/blob/main/app/routes/${currentMenuItem?.path.replace(/^\//, '').replaceAll('/', '.')}.${currentMenuItem?.ext ?? 'tsx'}`

  return { menu, currentMenuItem, codeURL }
}

export default function DemoPage() {
  const { menu, currentMenuItem, codeURL } = useLoaderData<typeof loader>()

  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 bg-slate-200 md:gap-4">
      <header className="bg-card">
        <h1 className="mx-4 my-2 text-2xl font-bold">TechTalk demos</h1>
        <Menubar className="rounded-none border-b border-l-0 border-r-0 border-t shadow-none">
          {Object.keys(demoPages).map((demoMenu) => (
            <MenubarMenu key={demoMenu}>
              <MenubarTrigger
                className={cn(
                  'capitalize',
                  demoMenu === menu &&
                    'relative after:absolute after:bottom-0 after:left-2 after:right-2 after:block after:h-1 after:rounded-md after:bg-primary',
                )}
              >
                {demoMenu}
              </MenubarTrigger>
              <MenubarContent>
                {demoPages[demoMenu]?.map(({ path, title }) => (
                  <MenubarItem key={path} asChild>
                    <Link to={path}>{title}</Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>
      </header>

      <main className="mx-2 md:container md:mx-auto">
        {currentMenuItem ? (
          <Card className="mx-auto max-w-lg">
            <CardHeader className="flex-row justify-start space-y-0">
              <CardTitle>{currentMenuItem?.title}</CardTitle>
              <Spacer />
              {codeURL && (
                <a
                  className="block text-sm hover:text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                  href={codeURL}
                >
                  <span className="text-xs">Code</span>
                  <ExternalLinkIcon className="mb-1 ml-1 inline h-4 w-4" />
                </a>
              )}
            </CardHeader>
            <CardContent className={cn('prose max-w-full lg:prose-xl')}>
              <Outlet />
            </CardContent>
          </Card>
        ) : (
          <div className="mx-auto text-center">メニューからデモを選択してください。</div>
        )}
      </main>

      <footer className="px-4 py-2 text-center">Copyright&copy; TechTalk inc.</footer>
    </div>
  )
}
