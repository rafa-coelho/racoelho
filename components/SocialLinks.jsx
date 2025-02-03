import { GitHubIcon, InstagramIcon, TwitterIcon, LinkedInIcon, TiktokIcon, YouTubeIcon } from './Icons'

const SocialLinks = () => {
    const social = [
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/racoelhoo',
            icon: InstagramIcon,
        },
        {
            name: 'Tiktok',
            href: 'https://www.tiktok.com/@racoelhoo',
            icon: TiktokIcon,
        },
        // {
        //     name: 'Twitter',
        //     href: 'https://twitter.com/racoelhodev',
        //     icon: TwitterIcon,
        // },
        {
            name: 'YouTube',
            href: 'https://www.youtube.com/@racoelhoo',
            icon: YouTubeIcon,
        },
        {
            name: 'GitHub',
            href: 'https://github.com/rafa-coelho',
            icon: GitHubIcon,
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/in/racoelhodev/',
            icon: LinkedInIcon,
        }
    ];
    return (
        <div className="mt-6 flex justify-center space-x-6">
            {social.map((item, index) => (
                <a
                    key={index}
                    href={item.href}
                    target='_blank'
                    className="text-gray-400 hover:text-gray-200" rel="noreferrer"
                >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
            ))}
        </div>
    )
};


export default SocialLinks;
