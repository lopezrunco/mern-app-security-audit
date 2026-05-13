import { useEffect, useState } from 'react'

import './styles.scss'

export const ScrollTop = ({ scrollTo }) => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        handleScroll() // Trigger this so that the initial state is updated as soon as the component is mounted
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    if (scrollY > 100) {
        return (
            <a href={scrollTo}>
                <div className='scroll-top'>
                    <i className="fas fa-chevron-up"></i>
                </div>
            </a>
        )
    }
}