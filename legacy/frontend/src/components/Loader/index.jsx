import './style.scss'

export const Loader = () => {
    return (
        <div className='loader'>
            <svg viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20">
                </circle>
            </svg>
            <p>Cargando...</p>
        </div>
    )
}