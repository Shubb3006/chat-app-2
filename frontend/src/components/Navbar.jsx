import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Activity, Image, LogOut, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  function handleLogout() {
    logout();
  }
  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chaty</h1>
            </Link>
            <Link to="/status" className="btn btn-sm gap-2">
              <Image className="size-5  text-primary" />
              <span className="hidden sm:inline">Status</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {authUser ? (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5  text-primary" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="btn btn-sm gap-2" onClick={handleLogout}>
                  <LogOut className="size-5  text-primary" />{" "}
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
