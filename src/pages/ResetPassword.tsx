import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import Card from "@/components/ui/Card";

export default function ResetPassword() {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Reset password</h2>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
