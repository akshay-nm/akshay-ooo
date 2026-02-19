import React from 'react'

const ProjectTechnologies = ({ technologies }) => {
  return technologies.length > 0 ? (
    <>
      <h2>Tech</h2>
      <ul>
        {technologies.map((tech, i) => (
          <li key={i}>{tech}</li>
        ))}
      </ul>
    </>
  ) : (
    ''
  )
}

export default ProjectTechnologies
