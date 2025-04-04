
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Timer, Users, BarChart, Menu } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    title: "Matches",
    href: "/matches",
    icon: <Timer className="w-5 h-5" />,
  },
  {
    title: "Players",
    href: "/players",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Statistics",
    href: "/statistics",
    icon: <BarChart className="w-5 h-5" />,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col">
      <div className="md:hidden border-b flex items-center h-14 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav setOpen={setOpen} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">eFootball Match Tracker Pro</h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden bg-muted/40 md:flex md:flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">eFootball Match Tracker</h3>
          </div>
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  item={item}
                  isActive={useLocation().pathname === item.href}
                />
              ))}
            </nav>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive?: boolean;
  setOpen?: (open: boolean) => void;
}

function NavLink({ item, isActive, setOpen }: NavLinkProps) {
  const handleClick = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <Link
      to={item.href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
        isActive ? "bg-accent" : "transparent"
      )}
    >
      <span>{item.icon}</span>
      <span>{item.title}</span>
    </Link>
  );
}

interface MobileNavProps {
  setOpen: (open: boolean) => void;
}

function MobileNav({ setOpen }: MobileNavProps) {
  const location = useLocation();
  
  return (
    <div className="flex flex-col gap-2 pt-4">
      <div className="px-4 pb-4">
        <h3 className="font-semibold text-lg">eFootball Match Tracker</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              item={item}
              isActive={location.pathname === item.href}
              setOpen={setOpen}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
