import React, {useEffect, useMemo, useState} from 'react';
import {fetchProducts, deleteProduct} from '../../services/api/products';
import {useTable, useSortBy} from 'react-table';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import Loader from "../../components/Loader";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    featuredImage: string;
}

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [minPriceFilter, setMinPriceFilter] = useState<number | undefined>();
    const [maxPriceFilter, setMaxPriceFilter] = useState<number | undefined>();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const result = await fetchProducts();
            setProducts(result);
            setFilteredProducts(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            loadProducts();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = products;

        if (nameFilter) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        if (minPriceFilter !== undefined) {
            filtered = filtered.filter((product) => product.price >= minPriceFilter);
        }

        if (maxPriceFilter !== undefined) {
            filtered = filtered.filter((product) => product.price <= maxPriceFilter);
        }

        setFilteredProducts(filtered);
    }, [nameFilter, minPriceFilter, maxPriceFilter, products]);

    const columns: any = useMemo(
        () => [
            {
                Header: 'Resim',
                accessor: 'image',
                Cell: ({row}: any) => (
                    <img src={'http://localhost:3000'+row.original.featuredImage} alt={row.original.name} className="h-12 w-12 object-cover rounded-lg ml-2" />
                ),
            },
            {
                Header: 'Ürün Adı',
                accessor: 'name',
            },
            {
                Header: 'Açıklama',
                accessor: 'description',
            },
            {
                Header: 'Fiyat',
                accessor: 'price',
            },
            {
                Header: 'Stok',
                accessor: 'stock',
            },
            {
                Header: 'İşlemler',
                Cell: ({row}: any) => (
                    <div>
                        <button
                            className="bg-none border-none p-3"
                            onClick={() => navigate('/edit/' + row.original._id)}
                        >
                            <span className="material-icons">edit</span>
                        </button>
                        <button
                            className="bg-none border-none p-3"
                            onClick={() => {
                                setLoading(true);
                                handleDelete(row.original._id);
                            }}
                        >
                            <span className="material-icons">delete</span>
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const data = useMemo(() => filteredProducts, [filteredProducts]);

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
        {columns, data},
        useSortBy
    );

    return (
        <>
            {loading ? <Loader/> : null}
            <div className={'container mx-auto px-4 py-10 h-screen overflow-y-auto overflow-x-hidden'}
                 style={{backgroundColor: '#FFFAF8'}}>
                <div className="flex items-center justify-between mb-8 ">
                    <h1 className="text-2xl font-bold">Ürün Listesi</h1>
                    <button
                        onClick={() => navigate('/add')}
                        className={'bg-green-500 rounded-lg px-10 py-3 flex items-center justify-center text-amber-50 font-bold'}>
                        <span className="material-icons mr-2 ">add</span>
                        Ürün Ekle
                    </button>
                </div>

                {/* Filtre inputları */}
                <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                        type="text"
                        placeholder="İsme göre filtrele"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 shadow"
                    />
                    <input
                        type="number"
                        placeholder="Min fiyat"
                        value={minPriceFilter !== undefined ? minPriceFilter : ''}
                        onChange={(e) => setMinPriceFilter(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 shadow"
                    />
                    <input
                        type="number"
                        placeholder="Max fiyat"
                        value={maxPriceFilter !== undefined ? maxPriceFilter : ''}
                        onChange={(e) => setMaxPriceFilter(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 shadow"
                    />
                </div>

                <div className="container mx-auto p-4 border-2 border-gray-200 rounded-xl shadow-lg bg-white">
                    <table {...getTableProps()} className="min-w-full table-auto ">
                        <thead>
                        {headerGroups.map((headerGroup: any) => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                                {headerGroup.headers.map((column: any) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-2">
                                        {column.render('Header')}
                                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row: any) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className={`border-b ${row.original.stock === 0 ? 'bg-red-100' : ''}`}
                                >
                                    {row.cells.map((cell: any) => (
                                        <td {...cell.getCellProps()} className="py-2 text-center">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ProductList;
