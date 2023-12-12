import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
integrations: [
	starlight({
			title: 'CREDEBL Docs',
			logo: {
				alt: 'CREDEBL Logo',
				src: './src/assets/CREDEBL_ICON.svg',
			  },
			defaultLocale: 'root',
			locales: {
				// English docs in `src/content/docs/en/`
				root: {
					label: 'English',
					lang: 'en', // lang is required for root locales
				},
				// zh: {
				// 	label: 'Dzongkha (Bhutan)',
				// 	lang: 'dz_BT',
				// },
				hi: {
					label: 'हिंदी (India)',
					lang: 'hi',
				},
			},
			social: {
				github: 'https://github.com/credebl',
				twitter: 'https://twitter.com/credebl',
				discord: 'https://discord.gg/w4hnQT7NJG',
				youtube: 'https://www.youtube.com/@blocksterlabs5489',
			},
			sidebar: [
				{
					label: 'Intro',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'What is CREDEBL?', link: '/en/intro/what-is-credebl/' },
						{ label: 'Platform Features', link: '/en/intro/platform-features/' },
						{ label: 'Intro to SSI', link: '/en/intro/intro-to-ssi/' },
						//{ label: 'Key Concepts', link: '/en/intro/key-concepts/' },
					],
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
					{ label: 'Getting Started', link: '/en/guides/getting-started/' },
					{ label: 'Architecture', link: '/en/guides/architecture/' },
					{ label: 'Agent Setup', link: '/en/guides/afj_setup/' },
					{ label: 'NATS', link: '/en/guides/nats/' },
						{ label: 'Local Setup using NPM',link: '/en/guides/local-setup-using-npm/' },
					{ label: 'Local Setup using Docker', link: '/en/guides/local-setup-using-docker/' },
						//{ label: 'Self-hosting', link: '/en/guides/self-hosting/' },
						{ label: 'Using CREDEBL Cloud', link: '/en/guides/using-credebl-cloud/' },
					
					],
				},
				{
					label: 'Reference',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'API Reference', link: '/en/reference/api-reference/' },
					],
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Support',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Community', link: '/en/support/community/' },
						// { label: 'Troubleshooting', link: '/en/support/troubleshooting/' },
					],
				},
				{
					label: 'License',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'License', link: '/en/license/copyright-and-license/' },
					],
				},
			],
		}),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
