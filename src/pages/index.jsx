import Head from 'next/head'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { projects } from '@/data'

export default function Home({ projects }) {
  return (
    <>
      <Head>
        <title>Akshay Kumar - My scribe</title>
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
            <Link href={`/${project.shortName}`}>
              <a>{project.title}</a>
            </Link>
          </h2>
          <time
            dateTime={project.date}
            className="-order-1 font-mono text-sm leading-7 text-slate-500"
          >
            {project.date}
          </time>
          <p className="mt-1 text-base leading-7 text-slate-700">
            {project.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link href={`/${project.shortName}`}>
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
  return {
    props: {
      projects: projects,
    },
    revalidate: 10,
  }
}
