import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { LogIn, UserPlus, LogOut } from "react-feather";
import { useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import { queryClient } from "../../adapters/api";
import { useNavigate } from "react-router";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function LandingPageNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isLoggedIn, user_type, setAuth } = useAuth(); // Use the useAuth hook
  const naviage = useNavigate();

  const handleLogout = () => {
    setAuth({}); // Clear the authentication state
    queryClient.invalidateQueries();
    naviage("/"); // Redirect to the home page
  };

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Jobs", to: "/jobs" },
  ];

  const userLinks = {
    employer: [
      { label: "Dashboard", to: "/employer/dashboard" },
      { label: "Profile", to: "/employer/profile" },
      { label: "Create Job", to: "/employer/create-job" },
      { label: "Reviews", to: "/employer/reviews" },
    ],
    artisan: [
      { label: "Dashboard", to: "/artisan/dashboard" },
      { label: "Profile", to: "/artisan/profile" },
      { label: "Notification", to: "/artisan/notification" },
      { label: "Reviews", to: "/artisan/reviews" },
    ],
  };

  return (
    <Navbar isBordered maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <AcmeLogo />
            <p className="font-bold text-inherit">Artisan</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4 justify-start ml-2"
        justify="center"
      >
        {!isLoggedIn &&
          menuItems.map((item, index) => (
            <NavbarItem key={index} isActive={currentPath === item.to}>
              <Link
                aria-current={currentPath === item.to ? "page" : undefined}
                href={item.to}
                color={currentPath === item.to ? "primary" : "foreground"}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        {isLoggedIn &&
          userLinks[user_type]?.map((item, index) => (
            <NavbarItem key={index} isActive={currentPath === item.to}>
              <Link
                aria-current={currentPath === item.to ? "page" : undefined}
                href={item.to}
                color={currentPath === item.to ? "primary" : "foreground"}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {isLoggedIn ? (
          <Button
            color="danger"
            variant="flat"
            startContent={<LogOut />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              as={Link}
              color="primary"
              href="/login/artisian"
              variant="flat"
              startContent={<LogIn />}
            >
              Login
            </Button>
            <Button
              as={Link}
              color="primary"
              href="/signup/artisian"
              startContent={<UserPlus />}
            >
              Sign Up
            </Button>
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {isLoggedIn ? (
          <Button
            color="danger"
            variant="flat"
            startContent={<LogOut />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              as={Link}
              color="primary"
              href="/signup/artisian"
              startContent={<UserPlus />}
            >
              Sign Up
            </Button>
          </>
        )}
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        {!isLoggedIn &&
          menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full"
                href={item.to}
                size="lg"
                color={currentPath === item.to ? "primary" : "foreground"}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {isLoggedIn &&
          userLinks[user_type]?.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full"
                href={item.to}
                size="lg"
                color={currentPath === item.to ? "primary" : "foreground"}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {!isLoggedIn && (
          <Button
            as={Link}
            color="primary"
            href="/login/artisian"
            variant="flat"
            startContent={<LogIn />}
          >
            Login
          </Button>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
