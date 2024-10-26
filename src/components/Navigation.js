import React from 'react'
import { Link } from 'gatsby'

const Navigation = () => (
  <nav>
    <ul>
      <li><Link to="/">Inicio</Link></li>
      <li><Link to="/about">Acerca de</Link></li>
      {/* Eliminar el enlace al blog */}
      {/* <li><Link to="/blog">Blog</Link></li> */}
      <li><Link to="/contact">Contacto</Link></li>
    </ul>
  </nav>
)

export default Navigation
