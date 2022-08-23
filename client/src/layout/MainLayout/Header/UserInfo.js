import { useSelector } from 'react-redux';

export default function BasicTable() {
    const userName = useSelector((state) => state.auth.userName);
    return <p>{userName}</p>;
}
