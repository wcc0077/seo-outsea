const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-v4-flash';

interface TranslateFieldMap {
  [contentType: string]: string[];
}

export const TRANSLATABLE_FIELDS: TranslateFieldMap = {
  product: ['name', 'description'],
  'product-category': ['name', 'description'],
  'faq-article': ['title', 'content', 'author'],
  article: ['title', 'content', 'author'],
  application: ['name', 'description', 'useCase'],
};

export function buildTranslatePayload(records: Record<string, unknown>[], fields: string[]): Record<string, unknown>[] {
  return records.map((record) => {
    const entry: Record<string, unknown> = { _id: record.id };
    for (const field of fields) {
      if (record[field] != null) {
        entry[field] = record[field];
      }
    }
    return entry;
  });
}

export async function callDeepSeekTranslate(fromLocale: string, toLocale: string, payload: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY not configured in .env');
  }

  const languageNames: Record<string, string> = {
    en: 'English',
    zh: 'Chinese (Simplified)',
  };

  const fromLang = languageNames[fromLocale] || fromLocale;
  const toLang = languageNames[toLocale] || toLocale;

  const systemPrompt = `You are a professional translator. Translate the following JSON array from ${fromLang} to ${toLang}.

Rules:
1. Return ONLY valid JSON, no markdown code fences, no explanation.
2. Preserve all Markdown formatting (headings, lists, bold, tables, code blocks).
3. Keep product model numbers, URLs, technical specifications, and slugs unchanged.
4. Translate all text content within the fields.
5. Preserve the "_id" field exactly as-is.
6. Return an array with the same structure and length as the input.`;

  const userPrompt = JSON.stringify(payload, null, 2);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices[0]?.message?.content || '';

  // Strip markdown code fences if present
  const cleaned = content.replace(/^```json\s*/m, '').replace(/^```\s*$/m, '').trim();

  try {
    return JSON.parse(cleaned) as Record<string, unknown>[];
  } catch {
    throw new Error(`Failed to parse DeepSeek response as JSON: ${cleaned.slice(0, 200)}`);
  }
}
