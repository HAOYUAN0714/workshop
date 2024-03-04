import { getAllProduct } from '@/api/products';
import { useEffect, useState } from 'react';

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