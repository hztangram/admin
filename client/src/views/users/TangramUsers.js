// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import UserTable from '../../components/UserTable';
import User from '../../components/User';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
    <MainCard title="Sample Card">
        <User />
    </MainCard>
);

export default SamplePage;
