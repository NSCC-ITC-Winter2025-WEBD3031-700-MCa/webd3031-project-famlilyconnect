import ResetPassword from "@/components/Auth/ResetPassword";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Family Connect – Bringing Loved Ones Closer",
  icons: {
    icon: "images/favicon.ico", 
  },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <>
      <Breadcrumb pageName="Reset Password" />
      <ResetPassword token={token} />
    </>
  );
}
