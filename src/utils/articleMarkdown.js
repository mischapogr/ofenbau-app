/**
 * Minimal line-based markdown parser for Ratgeber article bodies
 * (knowledgeBase.js `content` template literals). Supports exactly the
 * subset the articles use: ### / #### headings, * or - bullet lists,
 * numbered lists, paragraphs and **bold** inline.
 *
 * Returns an array of blocks:
 *   { type: 'h3' | 'h4' | 'p', html }        — html has inline bold applied
 *   { type: 'ul' | 'ol', items: [html] }
 * The first paragraph is flagged `callout: true` when it starts with the
 * "Die kurze Antwort" answer-engine lead so the view can highlight it.
 */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function formatInline(text) {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

export function parseArticleContent(content) {
  const blocks = []
  let paragraph = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'p', html: formatInline(paragraph.join(' ')) })
    paragraph = []
  }

  for (const raw of String(content).split('\n')) {
    const line = raw.trim()
    if (!line) {
      flushParagraph()
      continue
    }

    const heading = line.match(/^(#{3,4})\s*(.*)$/)
    if (heading) {
      flushParagraph()
      blocks.push({ type: heading[1] === '####' ? 'h4' : 'h3', html: formatInline(heading[2]) })
      continue
    }

    // List items: "*   text" / "-   text" / "1.  text" — a leading "**bold"
    // does not match because the marker must be followed by whitespace.
    const bullet = line.match(/^[*-]\s+(.*)$/)
    const numbered = line.match(/^\d+\.\s+(.*)$/)
    if (bullet || numbered) {
      flushParagraph()
      const type = bullet ? 'ul' : 'ol'
      const item = formatInline((bullet || numbered)[1])
      const last = blocks[blocks.length - 1]
      if (last?.type === type) last.items.push(item)
      else blocks.push({ type, items: [item] })
      continue
    }

    paragraph.push(line)
  }
  flushParagraph()

  const first = blocks[0]
  if (first?.type === 'p' && first.html.startsWith('<strong>Die kurze Antwort')) {
    first.callout = true
  }
  return blocks
}
