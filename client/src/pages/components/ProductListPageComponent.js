import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import CategoryCardComponent from '../../components/CategoryCardComponent.js';
import SortOptionComponent from '../../components/SortOptionComponent';
import PriceFilterComponent from '../../components/PriceFilterComponet';
import { Button } from 'react-bootstrap';
import RatingFilterComponent from '../../components/RatingFilterComponent';
import CategoryFilterComponent from '../../components/CategoryFilterComponent';
import AttributesFilterComponent from '../../components/AttributesFilterComponent';
import ProductForListComponent from '../../components/ProductsForListComponent';
import PaginationComponent from '../../components/PaginationComponent';
import { useEffect, useState } from 'react';
import { useAsyncError, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const ProductListPageComponent = ({ getProducts, categories }) => {

    const { categoryName } = useParams() || "";
    const {pageNumParam}=useParams() || 1;
    const {searchQuery}=useParams() || "";

    const {pathname}=useLocation();

    const [categoryAttrs, setCategoryAttrs] = useState([]);
    const [products, setProducts] = useState([]);
    const [filterAttrs, setFilterAttrs] = useState([]);
    const [resetFilter, setResetFilter] = useState(false); //filter and resetfilter button overbelow of the page
    const [filters, setFilters] = useState({}); //all filter conditions
    const [filterPrice, setFilterPrice] = useState(20000);
    const [filterRating, setFilterRating] = useState({});
    const [filterCategory, setFilterCategory] = useState({});
    const [sortOption,setFliterSort]=useState("");
    const [totalPages,setTotalPages]=useState(null);
    const [pageNum,setPageNum]=useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getProducts(categoryName,pageNumParam,searchQuery,filters,sortOption).then((res) => {
            setProducts(res.filteredProduct);
            setTotalPages(res.totalPages);
            setPageNum(res.pageNum);
        }).catch((err) => {
            console.log(err)
        })

        categories.forEach(element => {
            if (element.name === categoryName) {
                setCategoryAttrs(element.attrs);
            }
        });
    }, [categoryName,categories, filters,sortOption,pageNumParam,searchQuery]);

    const handleFilter = () => {
       
        navigate(pathname.replace(/\/[0-9]+$/,""))
        setResetFilter(true);
        setFilters({
            attrs: filterAttrs,
            price: filterPrice,
            rating: filterRating,
            category: filterCategory,
        });
        
    }

    const resetFilterHandler = () => {
        setResetFilter(false);
        setFilters({});
    }

    useEffect(() => {

        if (Object.entries(filterCategory).length > 0) {
            setCategoryAttrs([]);

            Object.entries(filterCategory).forEach(([checkedCategory, value]) => {
                if (value) {
                    categories.map((category) => {
                        if (category.name === checkedCategory) {
                            
                            setCategoryAttrs((item) => {
                                return [...item,...category.attrs]
                            })
                        }
                    })
                }
            });
        }

    }, [filterCategory, categories])
    
    return (
        <Container fluid className='py-2'>
            <Row>
                <Col sm={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className='mb-3 mt-3'><SortOptionComponent setFliterSort={setFliterSort}/></ListGroup.Item>
                        <ListGroup.Item>FILTER: <br /><PriceFilterComponent setFilterPrice={setFilterPrice} filterPrice={filterPrice} /></ListGroup.Item>
                        <ListGroup.Item><RatingFilterComponent setFilterRating={setFilterRating} /></ListGroup.Item>
                        {/* {categoryName?null:<><ListGroup.Item><CategoryFilterComponent setFilterCategory={setFilterCategory} filterCategory={filterCategory}/></ListGroup.Item></>} */}
                        <ListGroup.Item><CategoryFilterComponent setFilterCategory={setFilterCategory} filterCategory={filterCategory}/></ListGroup.Item>
                        <ListGroup.Item>{categoryAttrs.length > 0 ? <><AttributesFilterComponent categoryAttrs={categoryAttrs} setFilterAttrs={setFilterAttrs} /></> : <><div><b>Not Attributes</b></div></>}</ListGroup.Item>
                        <ListGroup.Item>
                            <Button variant="primary" onClick={handleFilter}>Filter</Button>
                            {resetFilter && <><Button variant="danger" onClick={resetFilterHandler}>Reset Filters</Button></>}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col sm={9}>
                    {
                       products.length>0 ? products.map((product, _idx) => {
                            return (
                                <ProductForListComponent
                                    images={product.images}
                                    name={product.name}
                                    description={product.description}
                                    price={product.price}
                                    rating={product.rating}
                                    reviewsNumber={product.reviewsNumber}
                                    productId={product._id}
                                />
                            )
                        }):<div style={{color:"red",fontSize:"25px"}}><b>No products found as per your filter conditions....!</b></div>
                    }
                    <PaginationComponent totalPages={totalPages} pageNum={pageNum} searchQuery={searchQuery} categoryName={categoryName}/>
                </Col>
            </Row>
        </Container>
    )
}