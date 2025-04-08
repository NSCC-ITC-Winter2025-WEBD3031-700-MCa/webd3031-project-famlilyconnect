import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  
  title: "About Us | Family Connect – Bringing Loved Ones Closer",  
  description: "Learn more about Family Connect, a social family management platform designed to help families share moments, plan events, and stay connected effortlessly.",
  icons: {
    icon: "images/favicon.ico", 
  },
};

const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="About Us Page" />
      <About />
      <Team />
    </main>
  );
};

export default AboutPage;
