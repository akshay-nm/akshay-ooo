import Head from 'next/head'
import { Container } from '@/components/Container'
import { projects } from '@/data'
import ProjectPeople from '@/components/ProjectPeople'
import ProjectLinks from '@/components/ProjectLinks'
import ProjectTechnologies from '@/components/ProjectTechnologies'
import ProjectRole from '@/components/ProjectRole'
import ProjectTargets from '@/components/ProjectTargets'

export default function Project({ project }) {
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
              <div className="flex flex-col">
                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                  {project.title}
                </h1>
                <time className="-order-1 font-mono text-sm leading-7 text-slate-500">
                  {project.date}
                </time>
              </div>
            </div>
            <p className="mt-3 text-lg font-medium leading-8 text-slate-700">
              {project.description}
            </p>
          </header>
          <hr className="my-12 border-gray-200" />
          <div className="prose prose-slate mt-14 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-cyan-200 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 [&>h2:nth-of-type(3n)]:before:bg-violet-200">
            <h2>Project type</h2>
            <p>{project.type}</p>
            <ProjectTargets targets={project.targets} />
            <ProjectTechnologies technologies={project.technologies} />
            <ProjectPeople people={project.people} />
            <ProjectLinks links={project.links} />
            <ProjectRole roles={project.role} />
          </div>
        </Container>
      </article>
    </>
  )
}

export async function getStaticProps({ params }) {
  let project = projects.find(({ shortName }) => shortName === params.shortName)

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
  return {
    paths: projects.map(({ shortName }) => ({
      params: {
        shortName,
      },
    })),
    fallback: 'blocking',
  }
}
