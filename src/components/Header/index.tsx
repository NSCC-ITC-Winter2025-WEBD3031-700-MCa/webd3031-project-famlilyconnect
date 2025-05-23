"use client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import menuData from "./menuData";
import toast from "react-hot-toast";

const Header = () => {
  const { data: session } = useSession();
  const pathUrl = usePathname();
  const router = useRouter();
  const { username, userEmail } = useUserContext();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const { theme, setTheme } = useTheme();

  const role = (session?.user as { role?: string })?.role || "user";
  const filteredMenu = menuData.filter((item) => !(item.requiresAdmin && role !== 'admin'));

  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);
  
  const handleStickyNavbar = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const handleMenuClick = (menuItem: any) => {
    setNavbarOpen(false);
    
    if (menuItem.requiresSignIn && !session?.user) {
      toast.error('Please sign in to access this feature');
      router.push(`/signin?callbackUrl=${encodeURIComponent(menuItem.path || '/')}`);
      return;
    }

    if (menuItem.path) {
      router.push(menuItem.path);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  return (
    <header
      className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
        sticky
          ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link
              href="/"
              className={`navbar-logo flex items-end gap-2 ${
                sticky ? "py-2" : "py-5"
              }`}
            >
              <div className="w-12 md:w-14 flex-shrink-0">
                <Image
                  src={sticky ? "/images/logo/family.png" : "/images/logo/family_white.png"}
                  alt="logo"
                  width={sticky ? 48 : 56}  
                  height={sticky ? 48 : 56}
                  className="header-logo dark:hidden"
                />
                <Image
                  src={"/images/logo/family_white.png"}
                  alt="logo"
                  width={sticky ? 48 : 56}
                  height={sticky ? 48 : 56}
                  className="header-logo hidden dark:block"
                />
              </div>

              <span
                className={`hidden sm:flex gap-1 font-semibold tracking-wide transition-all whitespace-nowrap ${
                  sticky 
                    ? "text-lg md:text-xl text-gray-900 dark:text-white" 
                    : pathUrl === "/" 
                      ? "text-xl md:text-2xl text-gray-100 dark:text-gray-300"
                      : "text-xl md:text-2xl text-gray-900 dark:text-gray-300"
                }`}
              >
                <span>FamConnect</span>
              </span>
            </Link>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? " top-[7px] rotate-45" : " "
                  } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
                    pathUrl === "/" && sticky
                      ? "bg-dark dark:bg-white"
                      : "bg-white"
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? "opacity-0 " : " "
                  } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
                    pathUrl === "/" && sticky
                      ? "bg-dark dark:bg-white"
                      : "bg-white"
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? " top-[-8px] -rotate-45" : " "
                  } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
                    pathUrl === "/" && sticky
                      ? "bg-dark dark:bg-white"
                      : "bg-white"
                  }`}
                />
              </button>
              <nav
                id="navbarCollapse"
                className={`navbar absolute z-30 w-[94%] mx-auto left-0 right-0 rounded-xl border-[.5px] border-body-color/10 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
                  navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="block divide-y divide-gray-100 dark:divide-gray-800 lg:ml-8 lg:flex lg:gap-x-8 lg:divide-y-0 xl:ml-14 xl:gap-x-12">
                  {filteredMenu.map((menuItem, index) =>
                    menuItem.path ? (
                      <li key={index} className="group relative">
                        <button
                          onClick={() => handleMenuClick(menuItem)}
                          className={`ud-menu-scroll flex w-full py-3 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                            pathUrl !== "/"
                              ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                              : sticky
                                ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                                : "text-body-color dark:text-white lg:text-white"
                          } ${
                            pathUrl === menuItem.path && "text-primary"
                          }`}
                        >
                          {menuItem.title}
                          {menuItem.requiresSignIn && !session?.user && (
                            <span className="ml-1 text-xs text-gray-400">(Sign in)</span>
                          )}
                        </button>
                      </li>
                    ) : (
                      <li className="submenu-item group relative" key={index}>
                        <button
                          onClick={() => handleSubmenu(index)}
                          className={`ud-menu-scroll flex w-full items-center justify-between py-3 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                            pathUrl !== "/" || sticky
                              ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                              : "text-white"
                          }`}
                        >
                          {menuItem.title}
                          <span className="pl-1">
                            <svg
                              className={`duration-300 lg:group-hover:rotate-180 ${
                                openIndex === index ? "rotate-180" : ""
                              }`}
                              width="16"
                              height="17"
                              viewBox="0 0 16 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </button>

                        <div
                          className={`submenu relative left-0 top-full w-full rounded-lg bg-white p-4 transition-all duration-300 ease-in-out group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:w-[250px] lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                            openIndex === index 
                              ? "block opacity-100 !static lg:!-left-[0]" 
                              : "hidden opacity-0"
                          }`}
                        >
                          {menuItem?.submenu?.map((submenuItem: any, i) => (
                            <button
                              key={i}
                              onClick={() => handleMenuClick(submenuItem)}
                              className={`block w-full text-left rounded px-4 py-[10px] text-sm transition-colors hover:bg-gray-50 dark:hover:bg-dark-3 ${
                                pathUrl === submenuItem.path
                                  ? "text-primary bg-gray-50 dark:bg-dark-3"
                                  : "text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                              }`}
                            >
                              {submenuItem.title}
                              {submenuItem.requiresSignIn && !session?.user && (
                                <span className="ml-1 text-xs text-gray-400">(Sign in)</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </li>
                    )
                  )}
                  
                  {session?.user && (
                    <>
                      <li className="lg:hidden pt-2">
                        <Link
                          href={`/profile/${(session?.user as { id?: string })?.id}`}
                          onClick={navbarToggleHandler}
                          className="ud-menu-scroll flex items-center py-3 text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary"
                        >
                          <span className="bg-primary/10 dark:bg-white/10 rounded-full p-2 mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary dark:text-white">
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </span>
                          <span className="truncate max-w-[200px]">
                            {username || userEmail}
                          </span>
                        </Link>
                      </li>
                      <li className="lg:hidden">
                        <button
                          onClick={() => {
                            navbarToggleHandler();
                            signOut();
                          }}
                          className="ud-menu-scroll flex w-full items-center py-3 text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary"
                        >
                          <span className="bg-red-50 dark:bg-red-900/20 rounded-full p-2 mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 dark:text-red-400">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                          </span>
                          Sign Out
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
            <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
              <button
                aria-label="theme toggler"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-8 w-8 items-center justify-center text-body-color duration-300 dark:text-white"
              >
                <span>
                  <svg
                    viewBox="0 0 16 16"
                    className="hidden h-[22px] w-[22px] fill-current dark:block"
                  >
                    <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
                  </svg>

                  <svg
                    viewBox="0 0 23 23"
                    className={`h-[30px] w-[30px] fill-current text-dark dark:hidden ${
                      !sticky && pathUrl === "/" && "text-white"
                    }`}
                  >
                    <g clipPath="url(#clip0_40_125)">
                      <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
                    </g>
                  </svg>
                </span>
              </button>

              {session?.user ? (
                <>
                  <p
                      className={`loginBtn px-7 py-3 text-base font-medium ${
                        !sticky && pathUrl === "/" 
                          ? "text-white dark:text-white" 
                          : "text-dark dark:text-white"
                      }`}
                    >
                    <Link href={`/profile/${(session?.user as { id?: string })?.id}`}>
                      {username || userEmail}
                    </Link>
                  </p>
                  <button
                    onClick={() => signOut()}
                    className={`signUpBtn rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${
                      pathUrl !== "/" || sticky
                        ? "bg-primary hover:bg-opacity-20 hover:text-dark"
                        : "bg-white/20 hover:bg-opacity-100 hover:text-dark"
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={`px-7 py-3 text-base font-medium hover:opacity-70 ${
                      sticky || pathUrl !== "/" ? "text-dark dark:text-white" : "text-white"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className={`rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${
                      sticky || pathUrl !== "/"
                        ? "bg-primary hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;