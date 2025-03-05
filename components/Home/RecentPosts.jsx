import Link from 'next/link';
import PostPreview from '../../components/Home/PostPreview';
import { getAllPosts } from '../../lib/local-api'

export default function RecentPosts ({ posts }) {

    return (
        <>
            <div className="bg-[#111111] rounded py-12 px-8">
                <h2 className="text-3xl text-white font-bold mb-8 text-center">Posts recentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {
                        posts.map((post) => (
                            <PostPreview
                                key={post.slug}
                                title={post.title}
                                coverImage={post.coverImage}
                                date={post.date}
                                slug={post.slug}
                            />
                        ))
                    }
                </div>
                <div className="text-center mt-8">

                    <Link
                        as={"/posts"}
                        href="/posts"
                        className="text-white hover:text-gray-500"
                        rel="noreferrer"
                    >
                        Ver outros Posts
                    </Link>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps () {
    const posts = getAllPosts([
        'title',
        'date',
        'slug',
        'author',
        'coverImage',
        'excerpt',
    ]).slice(0, 3)

    return {
        props: { posts },
    }
}

