import { Routes, Switch, Route, Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import './assets/css/custom.css';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import SignIn from 'views/auth/SignIn';
import Register from 'views/auth/Register';
// routing
// import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes>
                        <Route path="/" element={<MinimalLayout />}>
                            <Route path="/" element={<SignIn />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                        <Route path="/" element={<SignIn />} />
                        <Route path="register" element={<Register />} />
                    </Routes>
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
