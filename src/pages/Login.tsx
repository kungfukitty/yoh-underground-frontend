import LoginForm from "@/components/forms/LoginForm";
import Card from "@/components/ui/Card";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <LoginForm />
        <div className="text-sm mt-3">No account? <Link to="/signup">Sign up</Link></div>
        <div className="text-sm mt-1"><Link to="/reset-password">Forgot password?</Link></div>
      </Card>
    </div>
  );
}
