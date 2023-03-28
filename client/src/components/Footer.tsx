import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const currentYear = new Date().getFullYear()
  return (
    <div className='bg-white px-36 py-4'>
        <footer className="footer text-center flex-col flex gap-4 ">
            <p>Scooter Scout is niet aansprakelijk voor (gevolg)schade die voortkomt uit het gebruik van deze site, dan wel uit fouten of ontbrekende functionaliteiten op deze site.
                Copyright © {currentYear} Scooter Scout. Alle rechten voorbehouden.</p>
        </footer>
    </div>
  )
}

export default Footer