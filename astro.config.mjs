import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({

  output: "hybrid",
  adapter: deno(),

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
				// hi: {
				// 	label: 'हिंदी (India)',
				// 	lang: 'hi',
				// },
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
						{ label: 'Intro to SSI', link: '/en/intro/intro-to-ssi/' },
						{ label: 'What is CREDEBL?', link: '/en/intro/what-is-credebl/' },
						{ label: 'Architecture', link: '/en/intro/architecture/' },

						//{ label: 'Key Concepts', link: '/en/intro/key-concepts/' },
					],
				},
				{
					label: "User Guide",
					items: [
						{ label: "Getting started", "link": "/en/userguide/getting-started" },
						{ label: "UI flow", "link": "/en/userguide/ui-flow/" },
						{ label: "CREDEBL APIs flow", "link": "/en/userguide/api-flow/" },
						{
							label: "API Reference",
							items: [
								{ label: "Platform API reference", "link": "/en/userguide/api-reference/platform-api-reference/" },
								{ label: "Credo API reference", "link": "/en/userguide/api-reference/credo-api-reference/" }
							]
						}
					]
				},
				{
					label: 'Contributors Guide',
					items: [
						// Each item here is one entry in the navigation menu.
						{
							label: "Getting started",
							items: [
								{ label: "Basic info", "link": "/en/contributorsguide/gettingstarted/basic-info/" },
								{ label: "Architecture", "link": "/en/contributorsguide/gettingstarted/architecture/" },
							]
						},
						{
							label: "Setup",
							items: [
								//   { label: "Prerequisites", "link": "/en/contributorsguide/setup/prerequisites/prerequisitesoftwares/" },
								{
									label: "Prerequisites",
									items: [
										{ label: "Prerequisites", "link": "/en/contributorsguide/setup/prerequisites/prerequisitesoftwares/" },
										{ label: "Keycloak", "link": "/en/contributorsguide/setup/prerequisites/keycloak/" },
										{ label: "NATS", "link": "/en/contributorsguide/setup/prerequisites/nats/" },
										{ label: "REDIS", "link": "/en/contributorsguide/setup/prerequisites/redis/" },
										{ label: "PostgreSQL", "link": "/en/contributorsguide/setup/prerequisites/postgres/" },
									]
								},
								{
									label: "Platform",
									items: [
										{ label: "Intro", "link": "/en/contributorsguide/setup/platform/intro/" },
										{
											label: "Basic setup",
											items: [
												{ label: "Using NPM", "link": "/en/contributorsguide/setup/platform/basicsetup/npm/" },
												{ label: "Using Docker", "link": "/en/contributorsguide/setup/platform/basicsetup/docker/" },
											]
										},
										{ label: ".env setup", "link": "/en/contributorsguide/setup/platform/envsetup/" },
										{ label: "References", "link": "/en/contributorsguide/setup/platform/references/" },

									]
								},
								{
									label: "Agent",
									items: [
										{ label: "Intro", "link": "/en/contributorsguide/setup/agent/intro/" },
										{
											label: "Basic setup",
											items: [
												{ label: "Using NPM", "link": "/en/contributorsguide/setup/agent/basicsetup/npm/" },
												{ label: "Using Docker", "link": "/en/contributorsguide/setup/agent/basicsetup/docker/" },
											]
										},
										{ label: ".env setup", "link": "/en/contributorsguide/setup/agent/envsetup/" },
										{ label: "References", "link": "/en/contributorsguide/setup/agent/references/" },

									]
								},
								{
									label: "Studio",
									items: [
										{ label: "Intro", "link": "/en/contributorsguide/setup/studio/intro/" },
										{
											label: "Basic setup",
											items: [
												{ label: "Using NPM", "link": "/en/contributorsguide/setup/studio/basicsetup/npm/" },
												{ label: "Using Docker", "link": "/en/contributorsguide/setup/studio/basicsetup/docker/" },
											]
										},
										{ label: ".env setup", "link": "/en/contributorsguide/setup/studio/envsetup/" },
										{ label: "References", "link": "/en/contributorsguide/setup/studio/references/" },

									]
								},


							]
						},
						{ label: "Troubleshooting", "link": "/en/contributorsguide/troubleshooting/" },


					],
				},
				{ label: "Support", "link": "/en/support/" },
				{ label: "FAQ", "link": "/en/faq" },

				{ label: "License", "link": "/en/copyright-and-license/" },

			],
		}),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	// image: { service: { entrypoint: 'astro/assets/services/sharp' } },
	// Changing image processing to support server build
	image: {
    service: passthroughImageService()
  }
});
