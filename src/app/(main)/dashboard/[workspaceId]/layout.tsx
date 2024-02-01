import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout = ({ children, params }: LayoutProps) => {
  return (
    <div className="flex overflow-hidden h-screen w-screen">
      <Sidebar params={params} />
      <div className="dark:border-Neutrals-12/70 border-l-2 w-full relative overflow-scroll">
        {children}
      </div>
    </div>
  );
};

export default Layout;
