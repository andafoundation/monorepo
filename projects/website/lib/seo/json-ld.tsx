export type JsonLdEntity = Record<string, unknown>;
/** One entity, or several; a `null` entry, from a builder with nothing to state, is skipped. */
export type JsonLdData = JsonLdEntity | null | readonly (JsonLdEntity | null)[];

/**
 * Serializes structured data for a `<script type="application/ld+json">`.
 *
 * Every `<` becomes its JSON unicode escape, which is still valid JSON. The
 * payload carries message and poem text, and a literal `</script>` inside it
 * would otherwise close the tag and let the rest run as HTML.
 */
export function serializeJsonLd(data: JsonLdEntity | readonly JsonLdEntity[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function toEntities(data: JsonLdData): JsonLdEntity[] {
  const list: readonly (JsonLdEntity | null)[] = Array.isArray(data) ? data : [data as JsonLdEntity | null];
  return list.filter((entity): entity is JsonLdEntity => entity !== null);
}

/**
 * Server-rendered JSON-LD, one `<script>` per entity. The answer-engine
 * checkers the site is measured with recognise only a top-level object per
 * script and report an entity as missing when it sits inside an array, so
 * several entities are never serialized into one script.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <>
      {toEntities(data).map((entity, index) => (
        <script
          key={typeof entity['@type'] === 'string' ? `${entity['@type']}-${index}` : index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(entity) }}
        />
      ))}
    </>
  );
}
