import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import PocketBase from 'pocketbase';
import matter from 'gray-matter';
import 'dotenv/config';

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);

// Login com admin
async function login() {
  try {
    await pb.admins.authWithPassword(
      process.env.NEXT_PUBLIC_PB_ADMIN_EMAIL!,
      process.env.NEXT_PUBLIC_PB_ADMIN_PASSWORD!
    );
    console.log('✅ Logado no PocketBase');
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
    process.exit(1);
  }
}

// Upload de arquivo
async function uploadFile(collection: string, recordId: string, field: string, filePath: string, fileName: string) {
  try {
    // Ler o arquivo como Buffer
    const fileBuffer = readFileSync(filePath);
    
    // Detectar MIME type baseado na extensão
    const ext = fileName.split('.').pop()?.toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
    else if (ext === 'webp') mimeType = 'image/webp';
    else if (ext === 'svg') mimeType = 'image/svg+xml';
    else if (ext === 'gif') mimeType = 'image/gif';
    else if (ext === 'pdf') mimeType = 'application/pdf';
    
    // Criar File object usando Uint8Array (compatível com File)
    const uint8Array = new Uint8Array(fileBuffer);
    const file = new File([uint8Array], fileName, { type: mimeType });
    
    // Atualizar com o arquivo
    await pb.collection(collection).update(recordId, {
      [field]: file
    });
    
    console.log(`  ✅ Upload de ${fileName} (${mimeType}) concluído`);
  } catch (error: any) {
    console.error(`  ❌ Erro ao fazer upload de ${fileName}:`, error.message);
    console.error(`     Stack:`, error.stack);
  }
}

interface PostData {
  slug: string;
  content: string;
  title?: string;
  date?: string;
  excerpt?: string;
  keywords?: string;
  tags?: string[];
  coverImage?: string;
  [key: string]: any;
}

interface ChallengeData {
  slug: string;
  content: string;
  title?: string;
  date?: string;
  description?: string;
  keywords?: string;
  tags?: string[];
  level?: string;
  categories?: string;
  coverImage?: string;
  [key: string]: any;
}

// Buscar todos os posts do filesystem
function getAllPostsFromFS(): PostData[] {
  const postsDir = join(process.cwd(), 'content/posts');
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'));
  
  return files.map(file => {
    const filePath = join(postsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: bodyContent } = matter(content);
    
    return {
      slug: file.replace('.md', ''),
      content: bodyContent,
      ...data
    } as PostData;
  });
}

// Buscar todos os challenges do filesystem
function getAllChallengesFromFS(): ChallengeData[] {
  const challengesDir = join(process.cwd(), 'content/challenges');
  const files = readdirSync(challengesDir).filter(f => f.endsWith('.md'));
  
  return files.map(file => {
    const filePath = join(challengesDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: bodyContent } = matter(content);
    
    return {
      slug: file.replace('.md', ''),
      content: bodyContent,
      ...data
    } as ChallengeData;
  });
}

// Converter URL para path local
function urlToPath(url: string): string | null {
  if (!url || url.startsWith('http') || url.startsWith('//')) return null;
  if (url.startsWith('/')) {
    return join(process.cwd(), 'public', url);
  }
  return null;
}

// Processar posts
async function processPosts() {
  console.log('\n📝 Processando Posts...');
  const posts = getAllPostsFromFS();
  
  for (const post of posts) {
    try {
      // Tentar encontrar post no PB pelo slug
      let pbPost;
      try {
        pbPost = await pb.collection('posts').getFirstListItem(`slug="${post.slug}"`);
        console.log(`  ✓ Post encontrado: ${post.slug}`);
      } catch {
        console.log(`  ⚠️  Post não encontrado no PB: ${post.slug}, criando...`);
        // Criar post no PB com os dados do frontmatter
        const postData: any = {
          title: post.title,
          slug: post.slug,
          date: post.date,
          excerpt: post.excerpt || '',
          content: post.content || '',
          status: 'published',
          keywords: post.keywords || '',
          tags: post.tags || []
        };
        pbPost = await pb.collection('posts').create(postData);
        console.log(`  ✓ Post criado: ${post.slug}`);
      }
      
      // Verificar se tem coverImage e se o arquivo existe localmente
      if (post.coverImage && pbPost) {
        const localPath = urlToPath(post.coverImage);
        if (localPath && existsSync(localPath)) {
          const fileName = post.coverImage.split('/').pop() || 'cover.png';
          await uploadFile('posts', pbPost.id, 'coverImage', localPath, fileName);
        } else {
          console.log(`  ⚠️  Imagem não encontrada: ${post.coverImage}`);
        }
      }
    } catch (error: any) {
      console.error(`  ❌ Erro ao processar post ${post.slug}:`, error.message);
    }
  }
}

// Processar challenges
async function processChallenges() {
  console.log('\n🎯 Processando Challenges...');
  const challenges = getAllChallengesFromFS();
  
  for (const challenge of challenges) {
    try {
      // Tentar encontrar challenge no PB pelo slug
      let pbChallenge;
      try {
        pbChallenge = await pb.collection('challenges').getFirstListItem(`slug="${challenge.slug}"`);
        console.log(`  ✓ Challenge encontrado: ${challenge.slug}`);
      } catch {
        console.log(`  ⚠️  Challenge não encontrado no PB: ${challenge.slug}, criando...`);
        // Criar challenge no PB com os dados do frontmatter
        const challengeData: any = {
          title: challenge.title,
          slug: challenge.slug,
          date: challenge.date,
          excerpt: challenge.description || '',
          content: challenge.content || '',
          status: 'published',
          keywords: challenge.keywords || '',
          tags: challenge.tags || [],
          level: challenge.level || 'MEDIUM',
          category: challenge.categories || ''
        };
        pbChallenge = await pb.collection('challenges').create(challengeData);
        console.log(`  ✓ Challenge criado: ${challenge.slug}`);
      }
      
      // Verificar se tem coverImage e se o arquivo existe localmente
      if (challenge.coverImage && pbChallenge) {
        const localPath = urlToPath(challenge.coverImage);
        if (localPath && existsSync(localPath)) {
          const fileName = challenge.coverImage.split('/').pop() || 'cover.png';
          await uploadFile('challenges', pbChallenge.id, 'coverImage', localPath, fileName);
        } else {
          console.log(`  ⚠️  Imagem não encontrada: ${challenge.coverImage}`);
        }
      }
    } catch (error: any) {
      console.error(`  ❌ Erro ao processar challenge ${challenge.slug}:`, error.message);
    }
  }
}

// Processar todos os assets em /public/assets
async function processPublicAssets() {
  console.log('\n📦 Processando Assets Públicos...');
  const assetsDir = join(process.cwd(), 'public/assets');
  
  if (!existsSync(assetsDir)) {
    console.log('  ⚠️  Pasta assets não encontrada');
    return;
  }

  function walkDir(dir: string, baseDir: string = ''): string[] {
    const files: string[] = [];
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...walkDir(fullPath, baseDir));
      } else if (stat.isFile() && /\.(png|jpg|jpeg|webp|svg|gif|pdf)$/i.test(entry)) {
        const relativePath = join(baseDir, fullPath.replace(dir, entry));
        files.push(fullPath);
      }
    }

    return files;
  }

  const files = walkDir(assetsDir);
  console.log(`  📄 Encontrados ${files.length} arquivos`);

  // Aqui você pode fazer upload de todos os arquivos para uma collection de assets
  // ou simplesmente listar para validação
  for (const file of files) {
    const relativePath = file.replace(join(process.cwd(), 'public'), '').replace(/\\/g, '/');
    console.log(`  📄 ${relativePath}`);
  }
}

// Processar link items
async function processLinkItems() {
  console.log('\n🔗 Processando Link Items...');
  
  try {
    const linkItemsPath = join(process.cwd(), 'content/link-items.json');
    const items = JSON.parse(readFileSync(linkItemsPath, 'utf-8'));
    
    console.log(`  📋 Total de link items encontrados: ${items.length}`);
    
    for (const item of items) {
      const { image, ...itemData } = item;
      
      // Verificar se já existe por URL
      try {
        const existing = await pb.collection('link_items').getFirstListItem(`url="${item.url}"`);
        console.log(`  ↻ Link já existe: ${item.title} (pulando)`);
        continue;
      } catch {
        // Não existe, pode criar
      }
      
      try {
        const dataToSend: any = { ...itemData };
        
        const result = await pb.collection('link_items').create(dataToSend);
        console.log(`  ✓ Link criado: ${item.title}`);
        
        // Tentar fazer upload da imagem se for local
        if (image && image.startsWith('/')) {
          const imagePath = join(process.cwd(), 'public', image);
          if (existsSync(imagePath)) {
            const fileName = image.split('/').pop() || 'image.png';
            console.log(`  📸 Fazendo upload da imagem para: ${item.title}`);
            try {
              await uploadFile('link_items', result.id, 'image', imagePath, fileName);
              console.log(`  ✓ Imagem enviada para: ${item.title}`);
            } catch (imgError: any) {
              console.log(`  ⚠️  Erro ao fazer upload da imagem: ${imgError.message}`);
            }
          } else {
            console.log(`  ⚠️  Imagem não encontrada: ${imagePath}`);
          }
        }
      } catch (error: any) {
        console.log(`  ⚠️  Erro ao criar link: ${item.title}`);
        console.log(`     Erro: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error('  ❌ Erro ao processar link items:', error.message);
    console.error(error.stack);
  }
}

// Processar social links
async function processSocialLinks() {
  console.log('\n👥 Processando Social Links...');
  
  try {
    const socialLinksPath = join(process.cwd(), 'content/social-links.json');
    const items = JSON.parse(readFileSync(socialLinksPath, 'utf-8'));
    
    let order = 0;
    for (const item of items) {
      try {
        await pb.collection('social_links').create({
          ...item,
          order: order++
        });
        console.log(`  ✓ Social link criado: ${item.name}`);
      } catch (error: any) {
        console.log(`  ⚠️  Social link já existe ou erro: ${item.name}`);
      }
    }
  } catch (error: any) {
    console.error('  ❌ Erro ao processar social links:', error.message);
  }
}

// Processar setup items
async function processSetupItems() {
  console.log('\n⚙️  Processando Setup Items...');
  
  try {
    const setupPath = join(process.cwd(), 'content/setup.json');
    const items = JSON.parse(readFileSync(setupPath, 'utf-8'));
    console.log(`  📋 Total de items encontrados: ${items.length}`);
    
    for (const item of items) {
      const { id, image, ...itemData } = item; // Remover id se existir
      
      // Verificar se já existe por name
      try {
        const existing = await pb.collection('setup_items').getFirstListItem(`name="${item.name}"`);
        console.log(`  ↻ Setup item já existe: ${item.name}`);
        
        // Atualizar imagem se existir
        if (image && image.startsWith('/')) {
          const imagePath = join(process.cwd(), 'public', image);
          if (existsSync(imagePath)) {
            const fileName = image.split('/').pop() || 'image.png';
            console.log(`  📸 Atualizando imagem para: ${item.name}`);
            try {
              await uploadFile('setup_items', existing.id, 'image', imagePath, fileName);
              console.log(`  ✓ Imagem atualizada para: ${item.name}`);
            } catch (imgError: any) {
              console.log(`  ⚠️  Erro ao atualizar imagem: ${imgError.message}`);
            }
          }
        }
        continue;
      } catch {
        // Não existe, pode criar
      }
      
      try {
        const dataToSend: any = { ...itemData };
        
        const result = await pb.collection('setup_items').create(dataToSend);
        console.log(`  ✓ Setup item criado: ${item.name}`);
        
        // Tentar fazer upload da imagem se for local
        if (image && image.startsWith('/')) {
          const imagePath = join(process.cwd(), 'public', image);
          if (existsSync(imagePath)) {
            const fileName = image.split('/').pop() || 'image.png';
            console.log(`  📸 Fazendo upload da imagem para: ${item.name}`);
            try {
              await uploadFile('setup_items', result.id, 'image', imagePath, fileName);
              console.log(`  ✓ Imagem enviada para: ${item.name}`);
            } catch (imgError: any) {
              console.log(`  ⚠️  Erro ao fazer upload da imagem: ${imgError.message}`);
            }
          } else {
            console.log(`  ⚠️  Imagem não encontrada: ${imagePath}`);
          }
        } else if (image && image.startsWith('http')) {
          // URL externa - fazer download e upload
          console.log(`  🌐 Fazendo download de imagem externa para: ${item.name}`);
          try {
            console.log(`  🌐 URL da imagem externa: ${image}`);
            const response = await fetch(image);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            const fileName = `${item.name.replace(/\s+/g, '-').toLowerCase()}.png`;
            const mimeType = blob.type || `image/png`;
            
            const file = new File([uint8Array], fileName, { type: mimeType });
            await pb.collection('setup_items').update(result.id, { image: file });
            console.log(`  ✓ Imagem externa enviada para: ${item.name}`);
          } catch (imgError: any) {
            console.log(`  ⚠️  Erro ao fazer upload da imagem externa: ${imgError.message}`);
          }
        }
      } catch (error: any) {
        console.log(`  ⚠️  Erro ao criar setup item: ${item.name}`);
        console.log(`     Erro: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error('  ❌ Erro ao processar setup items:', error.message);
    console.error(error.stack);
  }
}

// Processar feature flags
async function processFeatureFlags() {
  console.log('\n🚩 Processando Feature Flags...');
  
  try {
    const flagsPath = join(process.cwd(), 'content/feature-flags.json');
    const data = JSON.parse(readFileSync(flagsPath, 'utf-8'));
    
    for (const flag of data.flags) {
      try {
        await pb.collection('feature_flags').create(flag);
        console.log(`  ✓ Flag criada: ${flag.key}`);
      } catch (error: any) {
        console.log(`  ⚠️  Flag já existe ou erro: ${flag.key}`);
      }
    }
  } catch (error: any) {
    console.error('  ❌ Erro ao processar feature flags:', error.message);
  }
}

// Processar ads
async function processAds() {
  console.log('\n📢 Processando Ads...');
  
  try {
    const adsPath = join(process.cwd(), 'content/ads.json');
    const data = JSON.parse(readFileSync(adsPath, 'utf-8'));
    
    console.log(`  📋 Total de ads encontrados: ${data.ads.length}`);
    
    for (const ad of data.ads) {
      // Remover o campo 'id' pois será gerado pelo PocketBase
      const { id, image, ...adData } = ad;
      
      // Verificar se já existe por title
      try {
        const existing = await pb.collection('ads').getFirstListItem(`title="${ad.title}"`);
        console.log(`  ↻ Ad já existe: ${ad.title} (pulando)`);
        continue;
      } catch {
        // Não existe, pode criar
      }
      
      try {
        const dataToSend: any = { ...adData };
        const result = await pb.collection('ads').create(dataToSend);
        console.log(`  ✓ Ad criado: ${ad.title}`);
      } catch (error: any) {
        console.log(`  ⚠️  Erro ao criar ad: ${ad.title}`);
        console.log(`     Erro: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error('  ❌ Erro ao processar ads:', error.message);
  }
}

// Processar sales pages
async function processSalesPages() {
  console.log('\n💰 Processando Sales Pages...');
  
  try {
    const salesDir = join(process.cwd(), 'content/sales-pages');
    const files = readdirSync(salesDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      try {
        const filePath = join(salesDir, file);
        const data = JSON.parse(readFileSync(filePath, 'utf-8'));
        const slug = file.replace('.json', '');
        
        await pb.collection('sales_pages').create({
          slug,
          ...data
        });
        console.log(`  ✓ Sales page criada: ${slug}`);
      } catch (error: any) {
        console.log(`  ⚠️  Sales page já existe ou erro: ${file}`);
      }
    }
  } catch (error: any) {
    console.error('  ❌ Erro ao processar sales pages:', error.message);
  }
}

// Main
async function main() {
  await login();
  
  console.log('🚀 Iniciando importação de assets...');
  
  await processPosts();
  await processChallenges();
  await processLinkItems();
  await processSocialLinks();
  await processSetupItems();
  await processFeatureFlags();
  await processAds();
  await processSalesPages();
//   await processPublicAssets();
  
  console.log('\n✅ Importação concluída!');
  process.exit(0);
}

main().catch(console.error);

