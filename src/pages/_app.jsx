import { AudioProvider } from '@/components/AudioProvider'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import 'focus-visible'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export default function App({ Component, pageProps }) {
  return (
    <AudioProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AudioProvider>
  )
}
