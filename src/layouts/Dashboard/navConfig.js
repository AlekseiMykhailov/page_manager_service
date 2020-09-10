import {
  Domain,
  GroupAdd,
  Pageview,
  PostAdd,
  SupervisorAccount,
  SettingsApplications,
  Web,
} from '@material-ui/icons';

export default [
  {
    subheader: '',
    items: [
      {
        title: 'Pages',
        href: '/pages',
        icon: Pageview,
        items: [
          {
            title: 'Create New Page',
            href: '/pages/create',
            icon: PostAdd,
          },
          {
            title: 'JobEasy',
            href: '/pages/1',
            icon: Web,
          },
          {
            title: 'Careerist',
            href: '/pages/2',
            icon: Web,
          }
        ]
      },
      {
        title: 'Instructors',
        href: '/instructors',
        icon: SupervisorAccount,
        items: [
          {
            title: 'Create New Instructor',
            href: '/instructors/create',
            icon: GroupAdd,
          },
          {
            title: 'Instructors List',
            href: '/instructors',
            icon: SupervisorAccount,
          },
        ],
      },
      {
        title: 'Domains Settings',
        href: '/domains-settings',
        icon: SettingsApplications,
        items: [
          {
            title: 'JobEasy',
            href: '/domains-settings/1',
            icon: Domain,
          },
          {
            title: 'Careerist',
            href: '/domains-settings/2',
            icon: Domain,
          },
        ],
      },
    ]
  }
];
