import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { parse } from 'rss-to-json'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'

export default function Home({ projects }) {
  return (
    <>
      <Head>
        <title>Akshay Kumar - Keeping it real</title>
        <meta name="description" content="Akshay Kumar ke kaarnaame" />
      </Head>
      <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
        <Container>
          <h1 className="text-2xl font-bold leading-7 text-slate-900">
            Projects
          </h1>
        </Container>
        <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}

function ProjectEntry({ project }) {
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
    <article
      aria-labelledby={`project-${project.id}-title`}
      className="py-10 sm:py-12"
    >
      <Container>
        <div className="flex flex-col items-start">
          <h2
            id={`project-${project.id}-title`}
            className="mt-2 text-lg font-bold text-slate-900"
          >
            <Link href={`/${project.id}`}>
              <a>{project.title}</a>
            </Link>
          </h2>
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
          <p className="mt-1 text-base leading-7 text-slate-700">
            {project.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => player.toggle()}
              className="flex items-center text-sm font-bold leading-6 text-teal-500 hover:text-teal-700 active:text-teal-900"
            >
              <span className="sr-only">
                {player.playing ? 'Pause' : 'Play'}
                project {project.title}
              </span>
              <svg
                className="h-2.5 w-2.5 fill-current"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                {player.playing ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.496 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H2.68a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H1.496Zm5.82 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H8.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7.316Z"
                  />
                ) : (
                  <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z" />
                )}
              </svg>

              <span className="ml-3" aria-hidden="true">
                Listen
              </span>
            </button>
            <span
              aria-hidden="true"
              className="text-sm font-bold text-slate-400"
            >
              /
            </span>
            <Link href={`/${project.id}`}>
              <a className="flex items-center text-sm font-bold leading-6 text-teal-500 hover:text-teal-700 active:text-teal-900">
                Show notes
              </a>
            </Link>
          </div>
        </div>
      </Container>
    </article>
  )
}

export async function getStaticProps() {
  const feed = await parse('https://their-side-feed.vercel.app/api/feed')

  return {
    props: {
      projects: feed.items.map(
        ({ id, title, description, enclosures, published }) => ({
          id,
          title: `${id}: ${title}`,
          published,
          description,
          audio: enclosures.map((enclosure) => ({
            src: enclosure.url,
            type: enclosure.type,
          }))[0],
        })
      ),
    },
    revalidate: 10,
  }
}
