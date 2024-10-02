import axios from 'axios';
import {toast} from 'react-toastify';
import {API_URL} from "./config";

export const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        toast.error('Ürünler yüklenirken bir hata oluştu');
        throw error;
    }
};

export const fetchProduct = async (id: string | number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        toast.error('Ürün yüklenirken bir hata oluştu');
        throw error;
    }
};

export const addProduct = async (product: any) => {
    try {
        const response = await axios.post(API_URL, product);
        toast.success('Ürün başarıyla eklendi');
        return response.data;
    } catch (error) {
        toast.error('Ürün eklenirken bir hata oluştu');
        throw error;
    }
};

export const updateProduct = async (id: string, product: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, product);
        toast.success('Ürün başarıyla güncellendi');
        return response.data;
    } catch (error) {
        toast.error('Ürün güncellenirken bir hata oluştu');
        throw error;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Ürün başarıyla silindi');
    } catch (error) {
        toast.error('Ürün silinirken bir hata oluştu');
        throw error;
    }
};

export const uploadProductImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Dosya yüklenirken hata oluştu', error);
        throw error;
    }
};
