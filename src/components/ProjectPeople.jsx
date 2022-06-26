import React from 'react'

const ProjectPeople = ({ people }) => {
  return people.length > 0 ? (
    <>
      <h2>Peers</h2>
      <ul></ul>
    </>
  ) : (
    ''
  )
}

export default ProjectPeople
