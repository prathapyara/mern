import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CategoryFilterComponent({ setFilterCategory, filterCategory }) {

  const { categories } = useSelector((state) => state.categories);
  const categoryRef = useRef([]);
  const [checkedCount, setCheckedCount] = useState(1);

  const navigate=useNavigate();

  useEffect(() => {
    Object.entries(filterCategory).map(([category, checked]) => {

      if (checkedCount === 0) {
        setCheckedCount(1)
        categoryRef.current.map((categoryInput) => {
          categoryInput.disabled = false;
        })
      }

      if (checked && checkedCount === 1) {
        categoryRef.current.map((categoryInput) => {
          if (category === categoryInput.name) {
            categoryInput.disabled = false;
            setCheckedCount(0);
          } else {
            categoryInput.disabled = true;
          }
        })
      }
    })

  }, [filterCategory])

  return (
    <>
      <span><b>Category</b></span>
      <Form>
        {categories.map((category, idx) => (
          <div key={idx}>
            <Form.Check id={`check-api2-${idx}`}>
              <Form.Check.Input
                type="checkbox"
                name={category.name}
                ref={(el) => (categoryRef.current[idx] = el)}
                onChange={(e) => setFilterCategory((filterCategory) => {
                  navigate(`/product-list/category/${category.name}`)
                  return { ...filterCategory, [category.name]: e.target.checked }
                })} />
              <Form.Check.Label style={{ cursor: "pointer" }}>{category.name}</Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </Form>
    </>

  );
}

export default CategoryFilterComponent;