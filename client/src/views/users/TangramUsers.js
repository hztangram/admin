// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import UserTable from '../../components/UserTable';
import User from '../../components/UserTable';

// ==============================|| SAMPLE PAGE ||============================== //

const TangramUsers = () => (
    <MainCard title="Tangram">
        <User />
    </MainCard>
);

export default TangramUsers;
