import { Rating } from "react-simple-star-rating";
import { Form } from "react-bootstrap";
import { Fragment } from "react";

const RatingFilterComponent = ({setFilterRating}) => {

    return (
        <>
            <span className="fw-bold">Rating</span>
            {
                Array.from({ length: "5" }).map((_, index) => {
                    return (
                            <Fragment key={index}>
                                <Form.Check type="checkbox" id={`check-api-${index}`}>
                                    <Form.Check.Input type="checkbox" value={5-index} isValid onChange={(e)=>setFilterRating((filterValue)=>{
                                        return ({...filterValue,[5-index]:e.target.checked});
                                        // if(filterValue.length===0){
                                        //     return [e.target.value];
                                        // }
                                        // //if checked
                                        // if(e.target.checked){
                                        //    filterValue.push(e.target.value);
                                        //    let unqiue=[...new Set(filterValue)];
                                        //    filterValue=unqiue;
                                        //    return [...filterValue];
                                        // }
                                        // if(!e.target.checked){
                                        //     let checked=filterValue.filter((rating)=>rating!==e.target.value);
                                        //     return [...checked];
                                        // }
                                        
                                    })} />
                                    <Form.Check.Label style={{ cursor: "pointer" }}>
                                        <Rating readonly size={20} initialValue={5 - index} />
                                    </Form.Check.Label>
                                </Form.Check>
                            </Fragment>
                    )
                })
            }

        </>
    )
}

export default RatingFilterComponent;