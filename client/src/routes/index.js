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
    const defaultPath = useSelector((state) => state.defaults.defaultPath);
    useMemo(() => {
        dispatch(checkLogin());
    }, [isLoggedIn]);
    console.log(isLoggedIn);
    return useRoutes(TotalRoutes(isLoggedIn, defaultPath));
}
