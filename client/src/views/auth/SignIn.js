// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { Box, Grid } from '@mui/material';

import SignInTable from '../../components/SignInTable';

// ==============================|| SAMPLE PAGE ||============================== //

const SignIn = () => (
    <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
            height: '100vh'
        }}
    >
        <MainCard
            title="SIGN IN"
            sx={{
                maxWidth: '100%',
                width: '600px',
                margin: { xs: 2.5, md: 3 },
                '& > *': {
                    flexGrow: 1,
                    flexBasis: '100%'
                }
            }}
        >
            <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
                <SignInTable />
            </Box>
        </MainCard>
    </Grid>
);

export default SignIn;
