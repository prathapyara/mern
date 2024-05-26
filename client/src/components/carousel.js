

export const Carousel = ({bestsellerProducts}) => {

    return (
        <>
            <div id="carouselExampleCaptions" className="carousel slide">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://source.unsplash.com/random/900×700/?book" className="d-block w-100 carousell" alt="hi" />
                        <div className="carousel-caption d-none d-md-block text-black">
                            <h5 style={{color:"red"}}>First slide label</h5>
                            <p  style={{color:"red"}}> Some representative placeholder content for the first slide.</p>
                        </div>
                    </div>
                    <div className="carousel-item ">
                        <img src="https://source.unsplash.com/random/900×700/?camera" className="d-block w-100 carousell" alt="hi" />
                        <div className="carousel-caption d-none d-md-block text-black">
                            <h5  style={{color:"red"}}>Second slide label</h5>
                            <p  style={{color:"red"}}>Some representative placeholder content for the second slide.</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    )
}