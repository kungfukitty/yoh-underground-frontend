import SignupForm from "@/components/forms/SignupForm";
import Card from "@/components/ui/Card";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        <SignupForm />
        <div className="text-sm mt-3">Have an account? <Link to="/login">Log in</Link></div>
      </Card>
    </div>
  );
}
