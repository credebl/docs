declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"404.md": {
	id: "404.md";
  slug: "404";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/gettingstarted/architecture.md": {
	id: "en/contributorsguide/gettingstarted/architecture.md";
  slug: "en/contributorsguide/gettingstarted/architecture";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/gettingstarted/basic-info.md": {
	id: "en/contributorsguide/gettingstarted/basic-info.md";
  slug: "en/contributorsguide/gettingstarted/basic-info";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/previouscontent/afj_setup.md": {
	id: "en/contributorsguide/previouscontent/afj_setup.md";
  slug: "en/contributorsguide/previouscontent/afj_setup";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/previouscontent/getting-started.md": {
	id: "en/contributorsguide/previouscontent/getting-started.md";
  slug: "en/contributorsguide/previouscontent/getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/previouscontent/local-setup-using-docker.md": {
	id: "en/contributorsguide/previouscontent/local-setup-using-docker.md";
  slug: "en/contributorsguide/previouscontent/local-setup-using-docker";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/previouscontent/local-setup-using-npm.md": {
	id: "en/contributorsguide/previouscontent/local-setup-using-npm.md";
  slug: "en/contributorsguide/previouscontent/local-setup-using-npm";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/previouscontent/self-hosting.md": {
	id: "en/contributorsguide/previouscontent/self-hosting.md";
  slug: "en/contributorsguide/previouscontent/self-hosting";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/previouscontent/using-credebl-cloud.md": {
	id: "en/contributorsguide/previouscontent/using-credebl-cloud.md";
  slug: "en/contributorsguide/previouscontent/using-credebl-cloud";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/agent/basicsetup/docker.md": {
	id: "en/contributorsguide/setup/agent/basicsetup/docker.md";
  slug: "en/contributorsguide/setup/agent/basicsetup/docker";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/agent/basicsetup/npm.md": {
	id: "en/contributorsguide/setup/agent/basicsetup/npm.md";
  slug: "en/contributorsguide/setup/agent/basicsetup/npm";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/agent/envsetup.md": {
	id: "en/contributorsguide/setup/agent/envsetup.md";
  slug: "en/contributorsguide/setup/agent/envsetup";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/agent/intro.md": {
	id: "en/contributorsguide/setup/agent/intro.md";
  slug: "en/contributorsguide/setup/agent/intro";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/agent/references.md": {
	id: "en/contributorsguide/setup/agent/references.md";
  slug: "en/contributorsguide/setup/agent/references";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/platform/basicsetup/docker.md": {
	id: "en/contributorsguide/setup/platform/basicsetup/docker.md";
  slug: "en/contributorsguide/setup/platform/basicsetup/docker";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/platform/basicsetup/npm.md": {
	id: "en/contributorsguide/setup/platform/basicsetup/npm.md";
  slug: "en/contributorsguide/setup/platform/basicsetup/npm";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/platform/envsetup.md": {
	id: "en/contributorsguide/setup/platform/envsetup.md";
  slug: "en/contributorsguide/setup/platform/envsetup";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/platform/intro.md": {
	id: "en/contributorsguide/setup/platform/intro.md";
  slug: "en/contributorsguide/setup/platform/intro";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/platform/references.md": {
	id: "en/contributorsguide/setup/platform/references.md";
  slug: "en/contributorsguide/setup/platform/references";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/prerequisites/keycloak.md": {
	id: "en/contributorsguide/setup/prerequisites/keycloak.md";
  slug: "en/contributorsguide/setup/prerequisites/keycloak";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/prerequisites/nats.md": {
	id: "en/contributorsguide/setup/prerequisites/nats.md";
  slug: "en/contributorsguide/setup/prerequisites/nats";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/prerequisites/postgres.md": {
	id: "en/contributorsguide/setup/prerequisites/postgres.md";
  slug: "en/contributorsguide/setup/prerequisites/postgres";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/prerequisites/prerequisitesoftwares.md": {
	id: "en/contributorsguide/setup/prerequisites/prerequisitesoftwares.md";
  slug: "en/contributorsguide/setup/prerequisites/prerequisitesoftwares";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/prerequisites/redis.md": {
	id: "en/contributorsguide/setup/prerequisites/redis.md";
  slug: "en/contributorsguide/setup/prerequisites/redis";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/studio/basicsetup/docker.md": {
	id: "en/contributorsguide/setup/studio/basicsetup/docker.md";
  slug: "en/contributorsguide/setup/studio/basicsetup/docker";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/studio/basicsetup/npm.md": {
	id: "en/contributorsguide/setup/studio/basicsetup/npm.md";
  slug: "en/contributorsguide/setup/studio/basicsetup/npm";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/studio/envsetup.md": {
	id: "en/contributorsguide/setup/studio/envsetup.md";
  slug: "en/contributorsguide/setup/studio/envsetup";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/studio/intro.md": {
	id: "en/contributorsguide/setup/studio/intro.md";
  slug: "en/contributorsguide/setup/studio/intro";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/setup/studio/references.md": {
	id: "en/contributorsguide/setup/studio/references.md";
  slug: "en/contributorsguide/setup/studio/references";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/contributorsguide/troubleshooting.md": {
	id: "en/contributorsguide/troubleshooting.md";
  slug: "en/contributorsguide/troubleshooting";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/copyright-and-license.md": {
	id: "en/copyright-and-license.md";
  slug: "en/copyright-and-license";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/faq.md": {
	id: "en/faq.md";
  slug: "en/faq";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/intro/architecture.md": {
	id: "en/intro/architecture.md";
  slug: "en/intro/architecture";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/intro/intro-to-ssi.md": {
	id: "en/intro/intro-to-ssi.md";
  slug: "en/intro/intro-to-ssi";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/intro/key-concepts.md": {
	id: "en/intro/key-concepts.md";
  slug: "en/intro/key-concepts";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/intro/platform-features.md": {
	id: "en/intro/platform-features.md";
  slug: "en/intro/platform-features";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/intro/what-is-credebl.md": {
	id: "en/intro/what-is-credebl.md";
  slug: "en/intro/what-is-credebl";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/reference/example.md": {
	id: "en/reference/example.md";
  slug: "en/reference/example";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/support.md": {
	id: "en/support.md";
  slug: "en/support";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/userguide/api-flow.md": {
	id: "en/userguide/api-flow.md";
  slug: "en/userguide/api-flow";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/userguide/api-reference/credo-api-reference.md": {
	id: "en/userguide/api-reference/credo-api-reference.md";
  slug: "en/userguide/api-reference/credo-api-reference";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/userguide/api-reference/platform-api-reference.md": {
	id: "en/userguide/api-reference/platform-api-reference.md";
  slug: "en/userguide/api-reference/platform-api-reference";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/userguide/getting-started.md": {
	id: "en/userguide/getting-started.md";
  slug: "en/userguide/getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"en/userguide/ui-flow.md": {
	id: "en/userguide/ui-flow.md";
  slug: "en/userguide/ui-flow";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"hi/guides/architecture.md": {
	id: "hi/guides/architecture.md";
  slug: "hi/guides/architecture";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"hi/guides/getting-started.md": {
	id: "hi/guides/getting-started.md";
  slug: "hi/guides/getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"hi/intro/intro-to-ssi.md": {
	id: "hi/intro/intro-to-ssi.md";
  slug: "hi/intro/intro-to-ssi";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"hi/intro/what-is-credebl.md": {
	id: "hi/intro/what-is-credebl.md";
  slug: "hi/intro/what-is-credebl";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"hi/reference/api-reference.md": {
	id: "hi/reference/api-reference.md";
  slug: "hi/reference/api-reference";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"hi/reference/example.md": {
	id: "hi/reference/example.md";
  slug: "hi/reference/example";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
