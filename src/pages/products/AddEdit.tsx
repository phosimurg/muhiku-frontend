import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {addProduct, updateProduct, fetchProduct, uploadProductImage} from '../../services/api/products';
import {useNavigate, useParams} from 'react-router-dom';
import Loader from "../../components/Loader";

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null); // Dosya hatası için state

    const validationSchema = Yup.object({
        name: Yup.string().required('Ürün adı gerekli'),
        description: Yup.string().required('Açıklama gerekli'),
        price: Yup.number().min(0, 'Fiyat negatif olamaz').required('Fiyat gerekli'),
        stock: Yup.number().min(0, 'Stok negatif olamaz').required('Stok gerekli'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            featuredImage: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            // Dosya validasyonu
            if (selectedFile) {
                if (selectedFile.size > 2 * 1024 * 1024) {
                    setFileError('Dosya boyutu 2MB\'dan büyük olamaz');
                    return;
                }
                if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
                    setFileError('Yalnızca JPG ve PNG formatları desteklenmektedir');
                    return;
                }
            }

            try {
                setFileError(null);
                if (id) {
                    let path = '';
                    if (selectedFile) {
                        const req = await uploadProductImage(selectedFile);
                        path = req?.filePath;
                    }
                    await updateProduct(id, {...values, featuredImage: path});
                } else {
                    let path = '';
                    if (selectedFile) {
                        const req = await uploadProductImage(selectedFile);
                        path = req?.filePath;
                    }
                    await addProduct({...values, featuredImage: path});
                }
                navigate('/');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const loadProduct = async () => {
            if (id) {
                const product = await fetchProduct(id);
                formik.setValues(product);
            }
        };
        loadProduct();
        setLoading(false);
    }, [id]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setFileError(null);
        }
    };

    return (
        <>
            {loading ? <Loader/> : null}
            <div className="container mx-auto px-4 h-screen overflow-y-auto overflow-x-hidden"
                 style={{backgroundColor: '#FFFAF8'}}>
                <h1 className="text-2xl font-bold mb-8 mt-16">{id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className={'font-medium text-sm'} htmlFor={'name'}>Ürün Adı</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border rounded-lg p-2 w-full shadow"
                        />
                        {formik.touched.name && formik.errors.name ?
                            <div className="text-red-600 font-medium text-xs mt-2">{formik.errors.name}</div> : null}
                    </div>
                    <div>
                        <label className={'font-medium text-sm'} htmlFor={'description'}>Açıklama</label>
                        <input
                            type="text"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border rounded-lg p-2 w-full shadow"
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className="text-red-600 font-medium text-xs mt-2">{formik.errors.description}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className={'font-medium text-sm'} htmlFor={'price'}>Fiyat</label>
                        <input
                            type="number"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border rounded-lg p-2 w-full shadow"
                        />
                        {formik.touched.price && formik.errors.price ?
                            <div className="text-red-600 font-medium text-xs mt-2">{formik.errors.price}</div> : null}
                    </div>
                    <div>
                        <label className={'font-medium text-sm'} htmlFor={'stock'}>Stok</label>
                        <input
                            type="number"
                            name="stock"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border rounded-lg p-2 w-full shadow"
                        />
                        {formik.touched.stock && formik.errors.stock ?
                            <div className="text-red-600 font-medium text-xs mt-2">{formik.errors.stock}</div> : null}
                    </div>

                    {/* Fotoğraf yükleme kısmı */}
                    <div>
                        <label className={'font-medium text-sm'} htmlFor={'image'}>Ürün Fotoğrafı</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="border rounded-lg p-2 w-full shadow"
                        />
                        {fileError ? (
                            <div className="text-red-600 font-medium text-xs mt-2">{fileError}</div>
                        ) : null}
                    </div>

                    <div style={{marginTop: '50px'}}>
                        <button type="button"
                                className="mr-5 bg-gray-400 text-white text-normal text-lg px-16 py-2 rounded-lg "
                                onClick={() => navigate('/')}>
                            Geri Dön
                        </button>
                        <button type="submit"
                                className="bg-green-500 text-white text-normal text-lg px-16 py-2 rounded-lg ">
                            {id ? 'Güncelle' : 'Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductForm;
