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
import { LogIn, UserPlus } from "react-feather";
import { useLocation } from "react-router";

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

  console.log(currentPath);

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "jobs", to: "/jobs" },
  ];

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
        className="hidden md:flex gap-4 justify-start ml-2"
        justify="center"
      >
        <NavbarItem isActive={currentPath === "/"}>
          <Link
            aria-current={currentPath === "/" ? "page" : undefined}
            href="/"
            color={currentPath === "/" ? "primary" : "foreground"}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={currentPath === "/about"}>
          <Link
            aria-current={currentPath === "/about" ? "page" : undefined}
            href="/about"
            color={currentPath === "/about" ? "primary" : "foreground"}
          >
            About Us
          </Link>
        </NavbarItem>
        <NavbarItem isActive={currentPath === "/jobs"}>
          <Link
            aria-current={currentPath === "/jobs" ? "page" : undefined}
            href="/jobs"
            color={currentPath === "/jobs" ? "primary" : "foreground"}
          >
            Jobs
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <Button
          as={Link}
          color="primary"
          href="/login"
          variant="flat"
          startContent={<LogIn />}
        >
          Login
        </Button>
        <Button
          as={Link}
          color="primary"
          href="/signup"
          startContent={<UserPlus />}
        >
          Sign Up
        </Button>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarItem className="">
          <Button
            as={Link}
            color="primary"
            href="/signup"
            startContent={<UserPlus />}
          >
            Sign Up
          </Button>
        </NavbarItem>

        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
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

        <Button
          as={Link}
          color="primary"
          href="/login"
          variant="flat"
          startContent={<LogIn />}
        >
          Login
        </Button>
      </NavbarMenu>
    </Navbar>
  );
}
