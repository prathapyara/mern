import Form from 'react-bootstrap/Form';

function PriceFilterComponent({setFilterPrice,filterPrice}) {
  return (
    <>
      <Form.Label><b>Price no greater than: {filterPrice}$ </b></Form.Label>
      <Form.Range min={300} max={100000} step={20} defaultValue="20000" onChange={e=>setFilterPrice(e.target.value)}/>
    </>
  );
}

export default PriceFilterComponent;