
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../services/auth';

export default function PreventSignIn({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
        getUser()
        .then((data) => {
            const currentUser = data
            setUser(currentUser);
        })
        .catch((error) => {
            console.error('Error fetching user:', error);
            setUser(null);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);
    
    
    if (user) {
        return <Navigate to="/users_dashboard" replace />;
    }
    
    return children;
}


