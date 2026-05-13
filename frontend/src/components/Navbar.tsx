import type { ReactNode } from "react";
import { getUser } from "../utils/auth";

interface NavbarProps {
  title: string;
  subtitle?: ReactNode;
  statusLabel?: string;
  showStatus?: boolean;
}

const Navbar = ({
  title,
  subtitle,
  statusLabel = "LIVE STATUS",
  showStatus = true,
}: NavbarProps) => {
  const user = getUser();
  const displayName = user?.username ?? "Người dùng";

  return (
    <div className="topbar user-navbar">
      <div>
        <p className="topbar-title">{title}</p>
        <p className="topbar-welcome">
          {subtitle ?? (
            <>
              Chào mừng trở lại, <strong>{displayName}</strong>.
            </>
          )}
        </p>
      </div>

      {showStatus && (
        <div className="topbar-right">
          <div className="status-live">
            <span className="pulse-dot" />
            {statusLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
