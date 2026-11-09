/**
 * Replaces the `{{key}}` placeholders of a step's code with the translated comments.
 * @param {string} code
 * @param {Record<string, string>} comments
 */
export function fillComments(code, comments) {
  return code.replace(/\{\{(\w+)\}\}/g, (placeholder, key) => comments[key] ?? placeholder)
}
