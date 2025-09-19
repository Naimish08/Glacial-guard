import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useAuth } from "../lib/AuthContext";
import { UserCircle } from "lucide-react";

export function LoginDialog() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleAdminLogin = () => {
    login(true);
    setIsOpen(false);
    navigate("/admin");
  };

  const handleCitizenLogin = () => {
    login(false);
    setIsOpen(false);
    navigate("/citizen");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-10 h-10 bg-primary/10 hover:bg-primary/20"
        >
          <UserCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Login</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button 
            onClick={handleAdminLogin}
            className="bg-primary hover:bg-primary/90"
          >
            Admin Login
          </Button>
          <Button 
            onClick={handleCitizenLogin}
            variant="outline"
          >
            Citizen Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}