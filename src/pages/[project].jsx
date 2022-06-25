import { useMemo } from 'react'
import Head from 'next/head'
import { parse } from 'rss-to-json'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { PlayButton } from '@/components/player/PlayButton'

export default function Project({ project }) {
  let date = new Date(project.published)

  let audioPlayerData = useMemo(
    () => ({
      title: project.title,
      audio: {
        src: project.audio.src,
        type: project.audio.type,
      },
      link: `/${project.id}`,
    }),
    [project]
  )
  let player = useAudioPlayer(audioPlayerData)

  return (
    <>
      <Head>
        <title>{project.title} - Akshay Kumar</title>
        <meta name="description" content={project.description} />
      </Head>
      <article className="py-16 lg:py-36">
        <Container>
          <header className="flex flex-col">
            <div className="flex items-center gap-6">
              <PlayButton player={player} size="large" />
              <div className="flex flex-col">
                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                  {project.title}
                </h1>
                <time
                  dateTime={date.toISOString()}
                  className="-order-1 font-mono text-sm leading-7 text-slate-500"
                >
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(date)}
                </time>
              </div>
            </div>
            <p className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
              {project.description}
            </p>
          </header>
          <hr className="my-12 border-gray-200" />
          <div
            className="prose prose-slate mt-14 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-cyan-200 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 [&>h2:nth-of-type(3n)]:before:bg-violet-200"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </Container>
      </article>
    </>
  )
}

export async function getStaticProps({ params }) {
  let feed = await parse('https://their-side-feed.vercel.app/api/feed')
  let project = feed.items
    .map(({ id, title, description, content, enclosures, published }) => ({
      id: id.toString(),
      title: `${id}: ${title}`,
      description,
      content,
      published,
      audio: enclosures.map((enclosure) => ({
        src: enclosure.url,
        type: enclosure.type,
      }))[0],
    }))
    .find(({ id }) => id === params.project)

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  let feed = await parse('https://their-side-feed.vercel.app/api/feed')

  return {
    paths: feed.items.map(({ id }) => ({
      params: {
        project: id.toString(),
      },
    })),
    fallback: 'blocking',
  }
}