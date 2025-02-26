'use client';

import { NavItem } from '@/components/common/navitem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/common/skeleton';
import { ADMIN_ROLE, HR_ROLE } from '@/config/app.config';
import { MobileNav } from '@/layouts/mobile-nav';
import {
  adminNavbar,
  nonUserNavbar,
  userNavbar,
} from '@/lib/constant/app.constant';
import icons from '@/lib/icons';
import { getNameInitials } from '@/lib/utils';
import { Moon, Sun, Bell, MessageSquare } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import companyLogo from '../../public/hrpro-logo.png'
import { useNotifications } from '@/hooks/useNotifications';

export const CompanyLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image src={companyLogo} alt='HrPro' width={60} height={60}/>
      <h3 className="text-xl font-bold">
        HrPro <span className="text-red-600">Recruit</span>
      </h3>
    </div>
  );
};

const Header = () => {
  const session = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notification = useNotifications(session.data?.user?.id || '');


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <>
      <nav className="fixed w-full z-50 backdrop-blur-lg border">
        <div className="flex h-[72px] w-full items-center justify-between lg:px-20 px-3 shadow-sm">
          <Link href="/" className="p-2.5">
            <CompanyLogo />
          </Link>
          <div className="flex items-center">
            <ul className="md:flex items-center gap-4 text-sm lg:gap-8 hidden mx-4">
              {session.status === 'loading'
                ? nonUserNavbar.map((_, index) => (
                    <Skeleton className="h-4 w-[90px]" key={index} />
                  ))
                : session.data?.user
                ? session.data?.user.role === ADMIN_ROLE ||
                  session.data?.user.role === HR_ROLE
                  ? adminNavbar.map((item) => (
                      <NavItem {...item} key={item.id} />
                    ))
                  : userNavbar.map((item) => (
                      <NavItem {...item} key={item.id} />
                    ))
                : nonUserNavbar.map((item) => (
                    <NavItem {...item} key={item.id} />
                  ))}
            </ul>
            {
               session.status === 'authenticated' && (
                  <div className='transition-colors hover:text-foreground/80 text-foreground/60 font-medium cursor-pointer text-sm text-start hidden lg:block'>
                  <Link href={'/feedback'} >
                        Feedback
                  </Link>
                  </div>
               )
            }
            {session.status === 'authenticated' && (
              <div className="flex items-center gap-4 px-2">
                {/* Notification Icon with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="notifications">
                      <Bell className="w-5 h-5 text-foreground/60 hover:text-foreground" />
                      {notification.notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {notification.notifications.length > 0 ? (
                      notification.notifications.map((notifi,index) => (
                        <DropdownMenuItem key={index}>
                          <div className="flex flex-col">
                            <span className="font-medium">{notifi.content}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(notifi.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem>
                      <Link href="/notifications" className="w-full">View all notifications</Link>
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Message Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="messages"
                  onClick={() => router.push('/messages')}
                >
                  <MessageSquare className="w-5 h-5 text-foreground/60 hover:text-foreground" />
                </Button>
              </div>
            )}

           <div className="flex items-center">
              {mounted && (
                <button
                  className="border p-2.5 rounded-lg text-foreground/60 hover:dark:bg-[#191919] hover:bg-gray-100 md:mx-4 outline-none"
                  onClick={toggleTheme}
                  aria-label="theme"
                >
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            
            <div className="hidden md:block ml-4">
              {session.status === 'loading' ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : session.status === 'authenticated' ? (
                <>
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                        aria-label="avatar"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              session.data.user.image
                                ? session.data.user.image
                                : '/placeholder.svg?height=40&width=40'
                            }
                            alt={session.data.user.name}
                          />
                          <AvatarFallback>
                            {getNameInitials(session.data.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          className="flex w-full items-center"
                          href={'/profile/' + session.data.user.id}
                        >
                          <icons.profile className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <icons.logout className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div>
                  <Button
                    className="rounded-lg"
                    size="sm"
                    variant="default"
                    onClick={() => {
                      router.push('/signin');
                    }}
                    aria-label="login"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden flex justify-center ml-3">
              <MobileNav />
            </div>
          </div>
        </div>
      </nav>
      <div className="h-[72px] print:hidden"></div>
    </>
  );
};

export default Header;