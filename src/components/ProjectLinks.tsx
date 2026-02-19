import React from 'react'

const ProjectLinks = ({ links }) => {
  return links.length > 0 ? (
    <>
      <h2>Links</h2>
      <ul>
        {links.map((link, i) => (
          <li key={i}>
            <a href={link.href} target="_blank" rel="noreferrer noopener">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  ) : (
    ''
  )
}

export default ProjectLinks
