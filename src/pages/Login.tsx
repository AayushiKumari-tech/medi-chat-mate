import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo authentication logic
    if (email === "admin@hospital.com" && password === "admin123") {
      toast.success("Welcome Admin!");
      setTimeout(() => navigate("/admin"), 500);
    } else if (email === "patient@hospital.com" && password === "patient123") {
      toast.success("Welcome Patient!");
      setTimeout(() => navigate("/"), 500);
    } else {
      toast.error("Invalid credentials. Please use demo credentials.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">HospitalCare Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Demo Credentials
            </p>
            
            <div className="space-y-3">
              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-1">
                  <p className="text-sm font-semibold text-foreground">Patient Login</p>
                  <p className="text-xs text-muted-foreground">Email: patient@hospital.com</p>
                  <p className="text-xs text-muted-foreground">Password: patient123</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-1">
                  <p className="text-sm font-semibold text-foreground">Admin Login</p>
                  <p className="text-xs text-muted-foreground">Email: admin@hospital.com</p>
                  <p className="text-xs text-muted-foreground">Password: admin123</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
