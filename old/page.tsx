import { redirect } from 'next/navigation';
import { FormProvider } from '../app/v1/forms/new/formcontext';
import Publish from './Publish';
import { getCurrentSession } from "@/lib/server/session";
import { globalGETRateLimit } from "@/lib/server/request";

interface PublishPageProps {
  searchParams: { formId?: string };
}

export default async function PublishPage({ searchParams }: PublishPageProps) {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/v1/dashboard");
  }

  const formId = searchParams.formId;
/*
  return (
    <FormProvider userId={user.id} formId={formId}>
      <Publish userId={user.id} />
    </FormProvider>
  );
  */
}