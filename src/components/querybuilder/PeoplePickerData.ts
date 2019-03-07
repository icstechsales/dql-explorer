import { IPersonaProps, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';

export const people: (IPersonaProps & { key: string | number })[] = [
  {
    key: 1,
    imageInitials: 'AM',
    text: 'Andrew Manby',
    secondaryText: 'Director, Product Management',
    tertiaryText: 'CN=Andrew Manby/O=MyOrg'
  },
  {
    key: 2,
    imageInitials: 'DP',
    text: 'Dimitri Prosper',
    secondaryText: 'Developer',
    tertiaryText: 'CN=Dimitri Prosper/O=MyOrg'
  },
  {
    key: 3,
    imageInitials: 'LG',
    text: 'Luis Guirigay',
    secondaryText: 'Technical Leader',
    tertiaryText: 'CN=Luis Guirigay/O=MyOrg'
  },
  {
    key: 4,
    imageInitials: 'SG',
    text: 'Scott Good',
    secondaryText: 'Designer',
    tertiaryText: 'CN=Scott Good/O=MyOrg'
  }
];

export const mru: IPersonaProps[] = people.slice(0, 5);
