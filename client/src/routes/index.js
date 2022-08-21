import { useEffect } from 'react';
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
    useEffect(() => {
        dispatch(checkLogin());
    }, []);

    /* const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); */
    const isLoggedIn = false;
    return useRoutes(TotalRoutes(isLoggedIn));
}
