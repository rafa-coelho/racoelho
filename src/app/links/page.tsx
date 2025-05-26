import { getLinkTreeData } from '@/lib/api';
import LinksContent from '@/components/LinksContent';

export default async function Links() {
  const { socialLinks, linkItems } = await getLinkTreeData();

  return <LinksContent socialLinks={socialLinks} linkItems={linkItems} />;
}