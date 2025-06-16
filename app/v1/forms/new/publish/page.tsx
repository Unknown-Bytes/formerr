import { redirect } from 'next/navigation';
import { FormProvider } from '../formcontext';
import { getCurrentSession } from "@/lib/server/session";
import { globalGETRateLimit } from "@/lib/server/request";
import PublishForm from './PublishForm';

export default async function PublishPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/v1/dashboard");
  }

  return (
    <FormProvider userId={user.id}>
      <PublishForm userId={user.id} />
    </FormProvider>
  );
}