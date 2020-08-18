import PageviewIcon from '@material-ui/icons/Pageview';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

export default [
  {
    subheader: '',
    items: [
      {
        title: 'Pages',
        href: '/pages',
        icon: PageviewIcon,
        items: [
          {
            title: 'JobEasy Courses',
            href: '/pages/1'
          },
          {
            title: 'JobEasy for Business',
            href: '/pages/2'
          }
        ]
      },
      {
        title: 'Create new Page',
        href: '/pages/create',
        icon: PostAddIcon,
      },
      {
        title: 'Domains Settings',
        href: '/domains-settings',
        icon: SettingsApplicationsIcon,
        items: [
          {
            title: 'JobEasy Courses',
            href: '/domains-settings/1'
          },
          {
            title: 'JobEasy for Business',
            href: '/domains-settings/2'
          },
        ],
      },
    ]
  }
];
