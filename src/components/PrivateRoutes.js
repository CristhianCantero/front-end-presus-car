import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    let auth = { 'token': localStorage.auth_token };

    return (
        auth.token ? <Outlet/> : <Navigate to="/login" />
    )
}

export default PrivateRoutes