
// export const attributeValueSelected = (e,setAttributesWrappper,selectedAttrKey) => {
//     if (e.target.value !== "choose_key_value") {
//         console.log(selectedAttrKey)
//         setAttributesWrappper(selectedAttrKey, e.target.value);
//     }
// }

// export const setAttributesWrappper = (newkey, value) => {
//     setProductAttributes((attr) => {
//         if (attr.length !== 0) {
//             var keyExistsInOldTable = false;
//             let modifiedTable = attr.map((item) => {
//                 if (item.key === newkey) {
//                     item.value = value;
//                     keyExistsInOldTable = true;
//                     return item;
//                 } else {
//                     return item;
//                 }
//             })

//             if (keyExistsInOldTable) {
//                 return [...modifiedTable];
//             } else {
//                 return [...modifiedTable, { key: newkey, value: value }];
//             }
//         } else {
//             return [{ key: newkey, value: value }]
//         }
//     })
// }

// export const deleteAttribute = (item) => {

//     const updatedAttributes = productAttributes.filter((currentitem) => {
//         return currentitem.key !== item.key
//     });
//     setProductAttributes(updatedAttributes);
// }

// export const newAttrKeyHandler = (e) => {
//     if (e.keyCode && e.keyCode === 13 && newAttributeValue && newAttributeKey) {
//         addNewAttributeManually(e);
//     } else {
//         e.preventDefault();
//     }
// }

// export const newAttrValueHandler = (e) => {
//     e.preventDefault();
//     if (e.keyCode && e.keyCode === 13 && newAttributeKey && newAttributeValue) {
//         addNewAttributeManually(e);
//     }
// }

// export const addNewAttributeManually = (e) => {
//     setAttributesWrappper(newAttributeKey, newAttributeValue);
//     dispatch(saveAttributeCategory(newAttributeKey, newAttributeValue, selectedCategory));
//     e.target.value = "";
//     createNewAttrKey.current.value = "";
//     createNewAttrVal.current.value = "";
//     setNewAttributeKey(false);
//     setNewAttributeValue(false);
// }