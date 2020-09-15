import {
  Domain,
  GroupAdd,
  MenuBook,
  Pageview,
  PostAdd,
  SupervisorAccount,
  SettingsApplications,
  Web,
  WebAsset,
} from '@material-ui/icons';

export default [
  {
    subheader: '',
    items: [
      {
        title: 'Landing Pages Manager',
        href: '/lp-manager',
        icon: MenuBook,
        items: [
          {
            title: 'Pages',
            href: '/pages',
            icon: Pageview,
            items: [
              {
                title: 'Create Page',
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
            ],
          },
          {
            title: 'Sections',
            href: '/sections',
            icon: WebAsset,
            items: [
              {
                title: 'Create Section',
                href: '/sections/create',
                icon: PostAdd,
              },
              {
                title: 'Sections List',
                href: '/sections',
                icon: WebAsset,
              },
            ],
          },
          {
            title: 'Instructors',
            href: '/instructors',
            icon: SupervisorAccount,
            items: [
              {
                title: 'Create Instructor',
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
        ],
      },
    ]
  }
];
