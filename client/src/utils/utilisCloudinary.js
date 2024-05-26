import axios from "axios";

export const uploadImageApiCall = async (images, productId) => {
    const formData = new FormData();
    Array.from(images).forEach((image, index) => {
        formData.append(`images`, image);
    });

    const {data}=await axios.post("/api/products/admin/upload?productId=" + productId, formData);
    return data;
}

export const uploadImagesCloudinaryApiRequest = (images, productId) => {
    let url = "https://api.cloudinary.com/v1_1/dlemasqtm/image/upload";
    const formData = new FormData();
    for (let i = 0; i <= images.length; i++) {
        const file = images[i];
        formData.append("file", file);
        formData.append("upload_preset", "ubafwnfp");
        fetch(url, {
            method: "POST",
            body: formData,
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.url) {
                axios.post("/api/products/admin/upload?cloudinary=true&productId=" + productId, data);
            }
        })
    }
}