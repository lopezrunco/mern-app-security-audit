import './styles.scss'

export const Breadcrumbs = ({ location }) => {
    return (
        <div className='breadcrumbs'>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <h3>{location}</h3>
                        <div className='path'>
                            <a href='/'>Inicio</a>
                            <i className="fa fa-chevron-right"></i>
                            <span className='actual-location'>{location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}