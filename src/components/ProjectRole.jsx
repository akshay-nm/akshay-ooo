import React from 'react'

const ProjectRole = ({ roles }) => {
  return roles.length > 0 ? (
    <>
      <h2>Roles</h2>
      <ul>
        {roles.map((role, i) => (
          <li key={i}>
            <span>{role.name}</span>
            <span>{role.description}</span>
          </li>
        ))}
      </ul>
    </>
  ) : (
    ''
  )
}

export default ProjectRole
