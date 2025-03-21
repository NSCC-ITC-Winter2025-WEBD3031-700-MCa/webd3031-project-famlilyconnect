import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Card } from "@/components/ui/card";
import { UserEngagementCard } from "@/components/admin/user-engagement";
import { TrafficPatternsCard } from "@/components/admin/traffic-patterns";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/admin/signin");
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET || "your-secret-key");
  } catch (err) {
    redirect("/admin/signin");
  }

  return (
    <div className="ps-10 pt-5">
      <div className="px-28 py-10 border rounded-lg shadow-1">
        <div>
          <h1 className="text-[28px] font-bold">Welcome, Admin! 👋</h1>
        </div>

        {/* top cards  */}
        <div className="grid grid-cols-3 gap-10 mt-5">
          <Card className="bg-white px-5 py-1">
            <div>
              <h2 className="text-[20px] font-bold">Total Users</h2>
              <p className="text-[14px] text-muted-foreground">10,000</p>
            </div>
          </Card>
          <Card className="bg-white px-5 py-1">
            <div>
              <h2 className="text-[20px] font-bold">Total Orders</h2>
              <p className="text-[14px] text-muted-foreground">1,000</p>
            </div>
          </Card>
          <Card className="bg-white px-5 py-1">
            <div>
              <h2 className="text-[20px] font-bold">Total Revenue</h2>
              <p className="text-[14px] text-muted-foreground">$100,000</p>
            </div>
          </Card>
        </div>

        {/* user engagement card */}
        <div className="pt-2">
          <UserEngagementCard />
        </div>

        {/* traffic patterns card */}
        <div className="pt-2">
          <TrafficPatternsCard />
        </div>
      </div>
    </div>
  );
}
