import React from 'react'

const ProjectRole = ({ role }) => {
  return role ? (
    <>
      <h2>Roles</h2>
      <ul>
        <li key={i}>
          <span>{role.name}</span>
          <span>{role.description}</span>
        </li>
      </ul>
    </>
  ) : (
    ''
  )
}

export default ProjectRole
