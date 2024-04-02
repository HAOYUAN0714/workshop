import { getAllProduct } from '@/api/admin/products';
import { useEffect } from 'react';

const Home = () => {

    useEffect(() => {
        getAllProduct()
    }, []);

    return (
        <div className="home-page">
            
        </div>
    )

}

export default Home