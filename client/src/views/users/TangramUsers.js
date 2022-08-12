// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import UserTable from '../../components/UserTable';
import User from '../../components/User';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
    <MainCard title="Tangram">
        <User />
    </MainCard>
);

export default SamplePage;
