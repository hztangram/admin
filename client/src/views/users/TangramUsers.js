// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import UserTable from '../../components/UserTable';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
    <MainCard title="Sample Card">
        <UserTable />
        <Typography variant="body2">dsfdsfdsf</Typography>
    </MainCard>
);

export default SamplePage;
