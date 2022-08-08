// assets
import { IconKey, IconList, IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconKey,
    IconList,
    IconUsers
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Authentication',
            type: 'collapse',
            icon: icons.IconKey,

            children: [
                {
                    id: 'login3',
                    title: 'Login',
                    type: 'item',
                    url: '/pages/login/login3',
                    target: true
                },
                {
                    id: 'register3',
                    title: 'Register',
                    type: 'item',
                    url: '/pages/register/register3',
                    target: true
                }
            ]
        },

        {
            id: 'users',
            title: 'User List',
            type: 'collapse',
            icon: icons.IconList,

            children: [
                {
                    id: 'tangram',
                    title: 'Tangram',
                    type: 'item',
                    url: '/users/tangram',
                    target: false
                }
            ]
        }
    ]
};

export default pages;
