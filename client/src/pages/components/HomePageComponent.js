import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Row from 'react-bootstrap/Row';
import Contianer from "react-bootstrap/Container"
import CategoryCardComponent from "../../components/CategoryCardComponent.js";
import { Carousel } from "../../components/carousel.js";
import { useEffect, useState } from "react";
import { MetaHelmetComponent } from "../../components/MetaComponent.js";

export const HomePageComponent= ({categories,bestseller}) => {

    const [bestsellerProducts,setBestsellerProducts]=useState([]);

    useEffect(()=>{
        bestseller().then((data)=>{
            setBestsellerProducts(data)
        }).catch((err)=>console.log(err));
    },[])
   
    return (
        <>
        <MetaHelmetComponent title="Best online shoping app" description="this is the best" />
            <Carousel bestsellerProducts={bestsellerProducts}/>
            <Contianer>
                <Row xs={1} md={2} className="g-4 py-3">
                    {
                        categories.map((item,idx) => {
                            return (
                                <div className="grid grid-col-2 py-1"><CategoryCardComponent item={item} idx={idx}/></div>
                            )
                        })
                    }
                </Row>
            </Contianer>

        </>
    )
}