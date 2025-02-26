import { IconProps } from '@/components/ui/icon';
import APP_PATHS from '@/config/path.config';
import { PackageSearch } from 'lucide-react';
import adobe from '../../../public/adobe.svg';
import atlassian from '../../../public/atlassian.svg';
import google from '../../../public/google.svg';
import medium from '../../../public/medium.svg';
import framer from '../../../public/framer.svg';
import coinbase from '../../../public/coinbase.svg';


export const nonUserNavbar = [
  { id: 1, label: 'Explore jobs', path: APP_PATHS.JOBS },
  { id: 2, label: 'Contact us', path: APP_PATHS.CONTACT_US },
];

export const userNavbar = [
  { id: 1, label: 'Explore jobs', path: APP_PATHS.JOBS },
  {id: 3,label: 'Job Applied',path: APP_PATHS.APPLIED_JOB},

];
export const adminNavbar = [
  {
    id: 1,
    label: 'Manage Jobs',
    path: APP_PATHS.MANAGE_JOBS,
    roleRequired: ['ADMIN'],
    icon: PackageSearch,
  },
  {
    id: 5,
    label: 'Manage Jobs',
    path: APP_PATHS.RECRUITERS_JOBS,
    roleRequired: ['HR'],
    icon: PackageSearch,
  },
  {
    id: 2,
    label: 'Manage Recruiters',
    path: APP_PATHS.MANAGE_RECRUITERS,
    roleRequired: ['ADMIN'],
    icon: PackageSearch,
  },
  {
    id: 3,
    label: 'Create job Post',
    path: APP_PATHS.POST_JOB,
    roleRequired: ['HR'],
    icon: PackageSearch,
  },  
  {
    id: 4,
    label: 'Pricing',
    path: APP_PATHS.SUBSCRIPTION,
    roleRequired: ['HR'],
    icon: PackageSearch,
  },
  
  
];
export const userProfileNavbar = [
  { id: 1, label: 'My Account', path: APP_PATHS.PROFILE },
  { id: 2, label: 'Edit Profile', path: APP_PATHS.EDIT_PROFILE },
  { id: 3, label: 'Saved Jobs', path: APP_PATHS.BOOKMARK },
  { id: 4, label: 'Account Settings', path: APP_PATHS.ACCOUNT_SETTINGS },
  { id: 4, label: 'Experience', path: APP_PATHS.EXPERIENCE },
  { id: 5, label: 'Projects', path: APP_PATHS.PROJECTS },
  { id: 6, label: 'Skills', path: APP_PATHS.SKILLS },
  { id: 7, label: 'Resume', path: APP_PATHS.RESUME },
];
export const socials: {
  href: string;
  icon: IconProps['icon'];
}[] = [
  {
    icon: 'youtube',
    href: 'http://localhost:3000/',
  },
  { icon: 'twitter', href: 'http://localhost:3000/' },
];

export const footerItems = [
  {
    label: 'About Us',
    href: '/',
  },
  {
    label: 'Terms of Service',
    href: '/',
  },
  {
    label: 'Privacy Policy',
    href: '/',
  },
];

export const trustedCompanies = [
  {
    icon: adobe,
    name: 'adobe',
  },
  {
    icon: atlassian,
    name: 'atlassian',
  },
  {
    icon: medium,
    name: 'medium',
  },
  {
    icon: coinbase,
    name: 'coinbase',
  },
  {
    icon: framer,
    name: 'framer',
  },
  {
    icon: google,
    name: 'google',
  },
];
