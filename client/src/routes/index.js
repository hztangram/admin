import { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkLogin } from '../store/auth';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import TotalRoutes from './TotalRoutes';

// ==============================|| ROUTING RENDER ||============================== //

// export default function ThemeRoutes() {
//     return useRoutes([MainRoutes, AuthenticationRoutes]);
// }

export default function ThemeRoutes() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    useMemo(() => {
        dispatch(checkLogin());
        console.log('isLoggedIn' + isLoggedIn);
    }, [isLoggedIn]);
    return useRoutes(TotalRoutes(isLoggedIn));
}
