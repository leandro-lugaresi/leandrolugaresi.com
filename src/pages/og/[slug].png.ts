import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '@/lib/og';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as {
    post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number];
  };
  const date = post.data.pubDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const png = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    date,
    tags: post.data.tags,
  });
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
