import { setupService } from '@/lib/services/setup.service';
import SetupContent from '@/components/SetupContent';

export default async function Setup() {
  const items = await setupService.getSetupItems();
  const categories = Array.from(new Set(items.map(item => item.category)));

  return <SetupContent items={items} categories={categories} />;
}
