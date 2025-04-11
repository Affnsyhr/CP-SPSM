import React, { useEffect, useState } from 'react';
import { getUserData } from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData();
            setUser(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            {user ? <h1>Test Test, {user.name}</h1> : <p>Loading...</p>}
        </div>
    );
};

export default Dashboard;