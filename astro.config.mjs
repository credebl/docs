import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import deno from "@deno/astro-adapter";
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'

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
			plugins: [
				// Generate the OpenAPI documentation pages.
				starlightOpenAPI([
					{
					 base: 'credo-api',
					 label: 'Credo Agent',
					 schema: './src/assets/schemas/credoSwagger.yaml',
					},
					{
					 base: 'platform-api',
					 label: 'Credebl Platform API',
					 schema: './src/assets/schemas/platformSwagger.yaml',
					},
				]),
			],
			sidebar: [
				{
					collapsed: true,
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
					collapsed: true,
					label: "User Guide",
					items: [
						
						{ label: "Getting started", "link": "/en/userguide/getting-started" },
						{ label: "Studio UI overview", "link": "/en/userguide/ui-flow/" },
						{ label: "CREDEBL APIs guide", "link": "/en/userguide/api-flow/" },
						{
					collapsed: true,
							label: "API Reference",
							items: [
        				...openAPISidebarGroups,
							]
						}
					]
				},
				{
					collapsed: true,
					label: 'Developers Guide',
					items: [
						// Each item here is one entry in the navigation menu.
						{
							collapsed: true,
							label: "Installation",
							items: [
								{
									collapsed: true,
									label: "Prerequisites",
									items: [
										{ label: "Prerequisites", "link": "/en/developersguide/setup/prerequisites/prerequisitesoftwares/" },
										{ label: "Keycloak", "link": "/en/developersguide/setup/prerequisites/keycloak/" },
										{ label: "NATS", "link": "/en/developersguide/setup/prerequisites/nats/" },
										{ label: "REDIS", "link": "/en/developersguide/setup/prerequisites/redis/" },
										{ label: "PostgreSQL", "link": "/en/developersguide/setup/prerequisites/postgres/" },
									]
								},
								{
									collapsed: true,
									label: "Platform",
									items: [
										{
											collapsed: true,
											label: "Installation",
											items: [
												{ label: "Using NPM", "link": "/en/developersguide/setup/platform/basicsetup/npm/" },
												{ label: "Using Docker", "link": "/en/developersguide/setup/platform/basicsetup/docker/" },
											]
										},
										{ label: "Environment Variables", "link": "/en/developersguide/setup/platform/envsetup/" },
										{ label: "References", "link": "/en/developersguide/setup/platform/references/" },

									]
								},
								{
									collapsed: true,
									label: "Agent",
									items: [
										{ label: "Overview", "link": "/en/developersguide/setup/agent/overview/" },
										{
									collapsed: true,
											label: "Installation",
											items: [
												{ label: "Using NPM", "link": "/en/developersguide/setup/agent/basicsetup/npm/" },
												{ label: "Using Docker", "link": "/en/developersguide/setup/agent/basicsetup/docker/" },
											]
										},
										{ label: "Environment Variables", "link": "/en/developersguide/setup/agent/envsetup/" },
										{ label: "References", "link": "/en/developersguide/setup/agent/references/" },

									]
								},
								{
									collapsed: true,
									label: "Studio",
									items: [
										{
									collapsed: true,
											label: "Installation",
											items: [
												{ label: "Using NPM", "link": "/en/developersguide/setup/studio/basicsetup/npm/" },
												{ label: "Using Docker", "link": "/en/developersguide/setup/studio/basicsetup/docker/" },
											]
										},
										{ label: "Environment Variables", "link": "/en/developersguide/setup/studio/envsetup/" },
										{ label: "References", "link": "/en/developersguide/setup/studio/references/" },

									]
								},


							]
						},
						{ label: "Troubleshooting", "link": "/en/developersguide/troubleshooting/" },


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
