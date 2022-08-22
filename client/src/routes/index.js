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
    useMemo(() => {
        dispatch(checkLogin());
    }, []);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return useRoutes(TotalRoutes(isLoggedIn));
}
