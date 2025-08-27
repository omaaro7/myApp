import React, { Suspense } from 'react';
import DashboardClientPage from './dashboard-client-page';
import Loader from '@/components/loader';

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardClientPage />
    </Suspense>
  );
}
