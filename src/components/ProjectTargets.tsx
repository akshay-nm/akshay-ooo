import React from 'react'

const ProjectTargets = ({ targets }) => {
  return targets.length > 0 ? (
    <>
      <h2>Aim</h2>
      <ul>
        {targets.map((target, i) => (
          <li key={i}>{target}</li>
        ))}
      </ul>
    </>
  ) : (
    ''
  )
}

export default ProjectTargets
