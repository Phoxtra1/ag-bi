
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const navigate = useNavigate();

  // Redirect to the main login page which now includes registration
  React.useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Redirecting to registration...</h2>
        <Button onClick={() => navigate("/login")}>
          Go to Login and Register
        </Button>
      </div>
    </div>
  );
}
