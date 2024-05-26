

export const imageValidation=(images)=>{
    let imagesTable=[];
    if(Array.isArray(images)){
        imagesTable=images;
    }else{
        imagesTable.push(images);
    }
  
    if(imagesTable.length>3){
        return {error:"Sent not more than 3 files at a time"};
    }
    
    for(let images of imagesTable){
        if(images.size>1048576){
            return {error:"Image size should be less than 1MB"};
        }
        const filetypes=/jpg|jpeg|png|images/;
        const mimetype=filetypes.test(images.mimetype)
       
        if(!mimetype){
            return {error:"Incorrect Mimetype should be either jpg or jpeg or png"};
        }
    }
    return {error:false}
}