import { Form } from "react-bootstrap";

const AttributesFilterComponent = ({ categoryAttrs, setFilterAttrs }) => {

    if (categoryAttrs.length <= 0) {
        return (
            <><div>loading....123</div></>
        )
    }
    return (
        <>
            {categoryAttrs.map((item, idx) => {
                return (
                    <>
                        <Form.Label><b>{item.key}</b></Form.Label>
                        {
                            item.value.map((i, index) => {
                                return (
                                    <>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" key={index} id={`check-api3-${i}`} onChange={(e) => {
                                                setFilterAttrs((filterItems) => {
                                                    if (filterItems.length === 0) {
                                                        return [{ key: item.key, value: [i] }];
                                                    }

                                                    let index = filterItems.findIndex((clickedItem) => {
                                                        return (item.key === clickedItem.key)
                                                    });
                                                    if (index === -1) {
                                                        //if key is not present and it is not checked 
                                                        return [...filterItems, { key: item.key, value: [i]}]
                                                    }
                                                    //if key is present and it is checked
                                                    if(e.target.checked){
                                                        filterItems[index].value.push(i);
                                                        let unique=[...new Set(filterItems[index].value)];
                                                        filterItems[index].value=unique;
                                                        return [...filterItems];
                                                    }

                                                    //if key is unchecked 
                                                    const valueWithOutUnchecked=filterItems[index].value.filter((checkedItem)=>checkedItem!==i);
                                                    filterItems[index].value=valueWithOutUnchecked;
                                                    if(valueWithOutUnchecked.length>0){
                                                        return [...filterItems];
                                                    }else{
                                                        let filterOneWithKey=filterItems.filter((checkeKey)=>checkeKey.key!==item.key);
                                                        return [...filterOneWithKey];
                                                    }

                                                    // if (e.target.checked) {
                                                    //     console.log("inside checked");
                                                    //     const avalibleKey = filterItems.filter((attr) => attr.key === item.key);
                                                    //     console.log(avalibleKey);
                                                    //     if (avalibleKey.length <= 0) {
                                                    //         return [...filterItems, { key: item.key, value: [i] }];
                                                    //     } else {
                                                    //         console.log("iam here");
                                                    //         console.log(filterItems[idx]);
                                                    //         filterItems[idx].value.push(i);
                                                    //         const uniquevalues = [...new Set(filterItems[idx].value)];
                                                    //         filterItems[idx].value = uniquevalues;
                                                    //         console.log(uniquevalues);
                                                    //         return [...filterItems];
                                                    //     }
                                                    // }

                                                    // if (!e.target.checked) {
                                                    //     const removeingKeyValue = filterItems.filter((attr) => attr.key === item.key);
                                                    //     console.log(removeingKeyValue[idx]);

                                                    //     if (removeingKeyValue[idx].value.length > 0) {
                                                    //         const valuess = removeingKeyValue[idx].value.filter((items) => items !== i);
                                                    //         removeingKeyValue[idx].value = valuess;
                                                    //         const fitered = filterItems.push(removeingKeyValue);
                                                    //         const uniquefiler = new Set(fitered)
                                                    //         return [uniquefiler];

                                                    //     } else {
                                                    //         const removingkeys = categoryAttrs.filter((attr) => attr.key !== item.key);
                                                    //         return [removingkeys];
                                                    //     }
                                                    // }
                                                })
                                            }} />
                                            <Form.Check.Label style={{ cursor: "pointer" }} >
                                                {i}
                                            </Form.Check.Label>
                                        </Form.Check>
                                    </>
                                )
                            })
                        }
                    </>
                )
            })

            }
        </>
    )
}

export default AttributesFilterComponent;